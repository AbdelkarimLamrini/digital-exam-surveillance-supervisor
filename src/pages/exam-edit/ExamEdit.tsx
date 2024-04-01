import React, {useEffect, useState} from 'react';
import dayjs  from 'dayjs';
import {Button, Container, Grid, Typography} from '@mui/material';
import {useGetExamDetails, useUpdateExam} from '../../hooks/useExam';
import {NewExamDto} from '../../models/Exam';
import {useNavigate, useParams} from 'react-router-dom';
import {RestError} from "../../models/RestError";
import ExamSessionTable from "./ExamSessionTable";
import ExamForm, {ExamFormState} from "../../components/ExamForm";

const initialFormState: ExamFormState = {
    id: '',
    name: '',
    creatorName: '',
    date: dayjs(),
    start: dayjs(),
    end: dayjs(),
};

function CreateExam() {
    const {examId} = useParams();
    const {exam, statusGettingExamDetails} = useGetExamDetails(examId);
    const {mutateUpdateExam, errorUpdatingExam, isErrorUpdatingExam} = useUpdateExam();
    const [examFormState, setExamFormState] = useState<ExamFormState>(initialFormState);
    const [error, setError] = useState<RestError>();
    const navigate = useNavigate();

    useEffect(() => {
        if (statusGettingExamDetails === 'success' && exam) {
            setExamFormState({
                id: exam.id,
                name: exam.name,
                creatorName: exam.creatorName,
                date: dayjs(exam.startTime),
                start: dayjs(exam.startTime),
                end: dayjs(exam.endTime),
            });
        }
    }, [statusGettingExamDetails, exam]);

    useEffect(() => {
        if (isErrorUpdatingExam) {
            // @ts-ignore
            setError(errorUpdatingExam.response.data as RestError)
        }
    }, [isErrorUpdatingExam, errorUpdatingExam]);

    const editExam = (newExamDto: NewExamDto) => {
        mutateUpdateExam({id: examId, data: newExamDto}, {
            onSuccess: () => {
                navigate(`/exams/${examId}`);
            },
        });
    };

    if (statusGettingExamDetails === 'error' || !exam) {
        return (
            <Container>
                <Typography variant="h2" component="h1">
                    Exam not found
                </Typography>
            </Container>
        );
    }

    return (
        <Container>
            <Typography variant="h3" component="h1">Edit exam</Typography>
            <Button onClick={() => navigate(`/exams/${examId}`)}
                    variant="outlined" color="primary">
                Details
            </Button>
            <Grid container spacing={2} sx={{my: 4}}>
                <Grid item xs={12} md={6}>
                    <Typography variant="h4" component="h2" sx={{mb:'0.5em'}}>Exam info</Typography>
                    <ExamForm examFormState={examFormState} handleSubmit={editExam} error={error}/>
                </Grid>
                <Grid item xs={12} md={6}>
                    <Typography variant="h4" component="h2">Exam sessions</Typography>
                    <ExamSessionTable examId={exam.id} examSessions={exam.examSessions}/>
                </Grid>
            </Grid>
        </Container>
    );
}

export default CreateExam;
