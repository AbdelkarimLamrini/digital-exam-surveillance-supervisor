import React from "react";
import {Box, Container, Table, TableBody, TableCell, TableContainer, TableRow, Typography} from "@mui/material";
import {useNavigate, useParams} from "react-router-dom";
import {useGetExamDetails} from "../../hooks/useExam";
import {prettyDate, shortTime} from "../../utils/date";
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
            <Box sx={{my: 2}}>
                <Typography variant="h1" component="h4">Exam Details</Typography>
                <TableContainer sx={{mr: 'auto', maxWidth: '600px'}}>
                    <Table aria-label="Exam detail table">
                        <TableBody>
                            <TableRow>
                                <TableCell align="left">Name</TableCell>
                                <TableCell align="left">{exam.name}</TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell align="left">ID</TableCell>
                                <TableCell align="left">{exam.id}</TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell align="left">Creator</TableCell>
                                <TableCell align="left">{exam.creatorName}</TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell align="left">Date</TableCell>
                                <TableCell align="left">{prettyDate(exam.startTime)}</TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell align="left">Start/End</TableCell>
                                <TableCell
                                    align="left">{shortTime(exam.startTime)} - {shortTime(exam.endTime)}</TableCell>
                            </TableRow>
                        </TableBody>
                    </Table>
                </TableContainer>
            </Box>
            <ExamSessionTable examSessions={exam.examSessions} handleSupervise={handleSupervise}/>
        </Container>
    );
}

export default ExamDetail;