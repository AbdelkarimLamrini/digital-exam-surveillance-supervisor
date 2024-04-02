import React from 'react';
import {useNavigate} from 'react-router-dom';
import ExamTable from './ExamTable';
import {useGetExams} from '../../hooks/useExam';
import {Alert, Button, Container, Typography} from "@mui/material";


function Exams() {
    const {exams, statusGettingExams} = useGetExams();
    const navigate = useNavigate();

    const createExam = () => navigate('/create-exam');

    return (
        <Container>
            {
                statusGettingExams === 'error' &&
                <Alert severity={"error"}
                       sx={{
                           position: "fixed",
                           top: 20,
                           left: "30%",
                           right: "30%",
                           zIndex: 1000,
                       }}>
                    There was an error loading the exams
                </Alert>
            }
            <Typography variant="h2" component="h1" sx={{mb: 2}}>
                Exams
            </Typography>
            <Button variant="contained" sx={{mb: 1}} onClick={createExam}>Create Exam</Button>
            <ExamTable exams={exams} queryStatus={statusGettingExams}/>
        </Container>
    );
}

export default Exams;
