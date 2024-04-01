import React from "react";
import {Box, Button, Container, Grid, Typography} from "@mui/material";
import {useNavigate, useParams} from "react-router-dom";
import {useGetExamDetails} from "../../hooks/useExam";
import {longNumericDateTime, longPrettyDate, shortTime} from "../../utils/date";
import ExamSessionTable from "./ExamSessionTable";

function ExamDetail() {
    const navigate = useNavigate();
    const {examId} = useParams();
    const {exam, statusGettingExamDetails} = useGetExamDetails(examId);
    const handleSupervise = (sessionId: number) => {
        navigate(`/supervise/${sessionId}`);
    }

    if (statusGettingExamDetails === 'loading') {
        return <Container>Loading exam details...</Container>;
    } else if (statusGettingExamDetails === 'error' || !exam) {
        return <Container>There was an error loading the exam</Container>;
    }

    return (
        <Container>
            <Typography variant="h3" component="h1">Exam details</Typography>
            <Grid container spacing={2} sx={{my: 4}}>
                <Grid item xs={12} md={6}>
                    <Typography variant="h4" component="h2">Exam info</Typography>
                    <Box sx={{display: 'flex', gap: '3em', my: 2}}>
                        <Box>
                            <Typography>Name</Typography>
                            <Typography>ID</Typography>
                            <Typography>Creator</Typography>
                            <Typography>Created</Typography>
                            <Typography>Date</Typography>
                            <Typography>Start/End</Typography>

                        </Box>
                        <Box>
                            <Typography>{exam.name}</Typography>
                            <Typography>{exam.id}</Typography>
                            <Typography>{exam.creatorName.length ? exam.creatorName : '/'}</Typography>
                            <Typography>{longNumericDateTime(exam.creationTime)}</Typography>
                            <Typography>{longPrettyDate(exam.startTime)}</Typography>
                            <Typography>{shortTime(exam.startTime)} - {shortTime(exam.endTime)}</Typography>
                        </Box>
                    </Box>
                    <Button onClick={() => navigate(`/exams/${exam.id}/edit`)}
                            variant="contained"
                            color="primary"
                            sx={{my: 2}}
                    >
                        Edit exam
                    </Button>
                </Grid>
                <Grid item xs={12} md={6}>
                    <Typography variant="h4" component="h2">Exam sessions</Typography>
                    <ExamSessionTable examSessions={exam.examSessions} handleSupervise={handleSupervise}/>
                </Grid>
            </Grid>
        </Container>
    );
}

export default ExamDetail;