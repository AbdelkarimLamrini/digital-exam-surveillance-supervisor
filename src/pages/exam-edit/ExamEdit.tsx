import React, {useEffect, useState} from 'react';
import dayjs from 'dayjs';
import {Breadcrumbs, Container, Grid, Typography} from '@mui/material';
import {useGetExamDetails, useUpdateExam} from '../../hooks/useExam';
import {ExamDto, NewExamDto} from '../../models/Exam';
import {useNavigate, useParams} from 'react-router-dom';
import {RestError} from "../../models/RestError";
import ExamSessionTable from "./ExamSessionTable";
import ExamForm, {ExamFormState} from "../../components/ExamForm";
import {useQueryClient} from "react-query";
import LinkRouter from "../../components/LinkRouter";

const initialFormState: ExamFormState = {
    id: '',
    name: '',
    creatorName: '',
    date: dayjs(),
    start: dayjs(),
    end: dayjs(),
};

function CreateExam() {
    const queryClient = useQueryClient();
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
            onSuccess: async (examDto: ExamDto) => {
                navigate(`/exams/${examDto.id}`);
                if (examId !== examDto.id) {
                    queryClient.removeQueries(['exams', examId]);
                    await queryClient.invalidateQueries(['exams']);
                }
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
            <Typography variant="h2" component="h1">Edit exam</Typography>
            <Breadcrumbs sx={{my: 2}}>
                <LinkRouter to={'/exams'}>Exams</LinkRouter>
                <LinkRouter to={`/exams/${examId}`}>{exam.name}</LinkRouter>
                <Typography>Edit</Typography>
            </Breadcrumbs>
            <Grid container spacing={2} sx={{my: 2}}>
                <Grid item xs={12} md={6}>
                    <Typography variant="h4" component="h2" sx={{mb: '0.5em'}}>Exam info</Typography>
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
