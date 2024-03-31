import TableContainer from "@mui/material/TableContainer";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import {IconButton, TableCell} from "@mui/material";
import TableBody from "@mui/material/TableBody";
import {Visibility} from "@mui/icons-material";
import React from "react";
import {ExamSession} from "../../models/ExamSession";

interface ExamSessionTableProps {
    examSessions: ExamSession[];
    handleSupervise: (sessionId: number) => void;
}

function ExamSessionTable({examSessions, handleSupervise}: ExamSessionTableProps) {
    return (
        <TableContainer component={Paper}>
            <Table aria-label="Exam session table">
                <TableHead>
                    <TableRow>
                        <TableCell align="left">ID</TableCell>
                        <TableCell align="left">Classroom</TableCell>
                        <TableCell align="left">Supervisor</TableCell>
                        <TableCell align="left"></TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {examSessions.map((session) => (
                        <TableRow key={session.id}>
                            <TableCell align="left" scope="row">{session.id}</TableCell>
                            <TableCell align="left">{session.classRoomId}</TableCell>
                            <TableCell align="left">{session.supervisorName}</TableCell>
                            <TableCell align="right">
                                <IconButton
                                    onClick={() => handleSupervise(session.id)}
                                    aria-label="supervise"
                                >
                                    <Visibility/>
                                </IconButton>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    );
}

export default ExamSessionTable;