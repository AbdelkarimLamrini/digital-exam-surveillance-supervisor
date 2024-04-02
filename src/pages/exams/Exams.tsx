import React from 'react';
import {useNavigate} from 'react-router-dom';
import ExamTable from './ExamTable';
import {useGetExams} from '../../hooks/useExam';
import {Button, Container, Typography} from "@mui/material";
import FloatingAlert from "../../components/FloatingAlert";


function Exams() {
    const {exams, statusGettingExams} = useGetExams();
    const navigate = useNavigate();

    const createExam = () => navigate('/create-exam');

    return (
        <Container>
            <FloatingAlert show={statusGettingExams === 'error'} severity={"error"}>
                There was an error loading the exams
            </FloatingAlert>
            <Typography variant="h2" component="h1" sx={{mb: 2}}>Exams</Typography>
            <Button variant="contained" sx={{mb: 1}} onClick={createExam}>Create Exam</Button>
            <ExamTable exams={exams} queryStatus={statusGettingExams}/>
        </Container>
    );
}

export default Exams;
