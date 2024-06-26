import React, {useEffect, useState} from 'react';
import {Box, Breadcrumbs, Container, Typography} from '@mui/material';
import {useCreateExam} from '../../hooks/useExam';
import {NewExamDto} from '../../models/Exam';
import {useNavigate} from 'react-router-dom';
import {RestError} from "../../models/RestError";
import ExamForm, {ExamFormState} from "../../components/ExamForm";
import dayjs from "dayjs";
import LinkRouter from "../../components/LinkRouter";

const initialFormState: ExamFormState = {
    id: '',
    name: '',
    creatorName: '',
    date: dayjs(),
    start: dayjs(),
    end: dayjs(),
};

function ExamCreate() {
    const {mutateCreateExam, isErrorCreatingExam, errorCreatingExam} = useCreateExam();
    const [examFormState] = useState<ExamFormState>(initialFormState);
    const [error, setError] = useState<RestError>();
    const navigate = useNavigate();


    useEffect(() => {
        if (isErrorCreatingExam) {
            // @ts-ignore
            setError(errorCreatingExam.response.data as RestError)
        }
    }, [isErrorCreatingExam, errorCreatingExam]);

    const createExam = (newExamDto: NewExamDto) => {
        mutateCreateExam(newExamDto, {
            onSuccess: () => {
                navigate('/exams');
            },
        });
    };

    return (
        <Container>
            <Typography variant="h2" component="h1">Create exam</Typography>
            <Breadcrumbs sx={{my: 2}}>
                <LinkRouter to={'/exams'}>Exams</LinkRouter>
                <Typography>New</Typography>
            </Breadcrumbs>
            <Box sx={{my: 2}} maxWidth="sm">
                <ExamForm examFormState={examFormState} handleSubmit={createExam} error={error}/>
            </Box>
        </Container>
    );
}

export default ExamCreate;
