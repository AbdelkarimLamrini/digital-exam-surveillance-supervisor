import TableContainer from "@mui/material/TableContainer";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import {Box, IconButton, TableCell, Toolbar} from "@mui/material";
import TableBody from "@mui/material/TableBody";
import {Add, Delete, Edit} from "@mui/icons-material";
import React, {useEffect, useState} from "react";
import {ExamSession, NewExamSessionDto} from "../../models/ExamSession";
import Button from "@mui/material/Button";
import {useCreateExamSession, useDeleteExamSession, useUpdateExamSession} from "../../hooks/useExamSession";
import {RestError} from "../../models/RestError";
import ExamSessionFormDialog, {ExamSessionFormState} from "./ExamSessionFormDialog";

interface ExamSessionTableProps {
    examId: string;
    examSessions: ExamSession[];
}

const initialFormState: ExamSessionFormState = {
    classRoomId: '',
    supervisorName: ''
};

function ExamSessionTable({examId, examSessions}: ExamSessionTableProps) {
    const [sessionFormDialogOpen, setSessionFormDialogOpen] = useState(false);
    const [sessionEditId, setSessionEditId] = useState<number>();
    const [examSessionFormState, setExamSessionFormState] = useState(initialFormState);
    const [error, setError] = useState<RestError>();
    const {mutateCreateExamSession, errorCreatingExamSession, isErrorCreatingExamSession} = useCreateExamSession();
    const {mutateUpdateExamSession, errorUpdatingExamSession, isErrorUpdatingExamSession} = useUpdateExamSession();
    const {mutateDeleteExamSession, errorDeletingExamSession, isErrorDeletingExamSession} = useDeleteExamSession();

    useEffect(() => {
        if (isErrorCreatingExamSession) {
            // @ts-ignore
            setError(errorCreatingExamSession.response.data as RestError)
        } else {
            setError(undefined);
        }
        // @ts-ignore
    }, [isErrorCreatingExamSession, errorCreatingExamSession]);

    useEffect(() => {
        if (isErrorUpdatingExamSession) {
            // @ts-ignore
            setError(errorUpdatingExamSession.response.data as RestError)
        } else {
            setError(undefined);
        }
        // @ts-ignore
    }, [isErrorUpdatingExamSession, errorUpdatingExamSession]);

    useEffect(() => {
        if (isErrorDeletingExamSession) {
            // @ts-ignore
            setError(errorDeletingExamSession.response.data as RestError)
        } else {
            setError(undefined);
        }
        // @ts-ignore
    }, [isErrorDeletingExamSession, errorDeletingExamSession]);

    const handleOpenSessionAddDialog = () => {
        setSessionFormDialogOpen(true);
        setExamSessionFormState(initialFormState);
    }
    const handleOpenSessionEditDialog = (session: ExamSession) => {
        setSessionFormDialogOpen(true);
        setSessionEditId(session.id);
        setExamSessionFormState({
            classRoomId: session.classRoomId,
            supervisorName: session.supervisorName
        });
    }
    const handleCloseSessionFormDialog = () => {
        setSessionFormDialogOpen(false);
        setSessionEditId(undefined);
        setExamSessionFormState(initialFormState);
    }
    const handleSubmit = (newSessionDto: NewExamSessionDto) => {
        if (sessionEditId) {
            mutateUpdateExamSession({sessionId: sessionEditId, data: newSessionDto}, {
                onSuccess: () => handleCloseSessionFormDialog()
            });
        } else {
            mutateCreateExamSession({examId: examId, data: newSessionDto}, {
                onSuccess: () => handleCloseSessionFormDialog()
            });
        }
    }
    const handleDeleteSession = (session: ExamSession) => {
        mutateDeleteExamSession(session.id);
    }

    return (
        <Box>
            <Paper sx={{my: 2}}>
                <Toolbar>
                    <Button
                        onClick={handleOpenSessionAddDialog}
                        size="small"
                        variant="contained"
                    >
                        <Add/> Add Session
                    </Button>
                </Toolbar>
                <TableContainer sx={{my: 2}}>
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
                                            onClick={() => handleOpenSessionEditDialog(session)}
                                            size="small"
                                        >
                                            <Edit fontSize="inherit"/>
                                        </IconButton>
                                        <IconButton
                                            onClick={() => handleDeleteSession(session)}
                                            size="small"
                                        >
                                            <Delete fontSize="inherit"/>
                                        </IconButton>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            </Paper>
            <ExamSessionFormDialog
                dialogOpen={sessionFormDialogOpen}
                editMode={sessionEditId !== undefined}
                handleCloseDialog={handleCloseSessionFormDialog}
                examSessionFormState={examSessionFormState}
                handleSubmit={handleSubmit}
                error={error}
            />
        </Box>
    );
}

export default ExamSessionTable;
