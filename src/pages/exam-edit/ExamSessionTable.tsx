import TableContainer from "@mui/material/TableContainer";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import {Box, IconButton, TableCell, Toolbar, Typography} from "@mui/material";
import TableBody from "@mui/material/TableBody";
import {Add, Delete, Edit} from "@mui/icons-material";
import React, {useEffect, useState} from "react";
import {ExamSession} from "../../models/ExamSession";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import TextField from "@mui/material/TextField";
import DialogActions from "@mui/material/DialogActions";
import Button from "@mui/material/Button";
import {useCreateExamSession, useDeleteExamSession, useUpdateExamSession} from "../../hooks/useExamSession";
import {RestError} from "../../models/RestError";

interface ExamSessionTableProps {
    examId: string;
    examSessions: ExamSession[];
}

function ExamSessionTable({examId, examSessions}: ExamSessionTableProps) {
    const [sessionFormDialogOpen, setSessionFormDialogOpen] = useState(false);
    const [sessionEditId, setSessionEditId] = useState<number>();
    const [classRoomId, setClassRoomId] = useState('');
    const [supervisorName, setSupervisorName] = useState('');
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
        setClassRoomId('');
        setSupervisorName('');
    }
    const handleOpenSessionEditDialog = (session: ExamSession) => {
        setSessionFormDialogOpen(true);
        setSessionEditId(session.id);
        setClassRoomId(session.classRoomId);
        setSupervisorName(session.supervisorName);
    }
    const handleCloseSessionFormDialog = () => {
        setSessionFormDialogOpen(false);
        setSessionEditId(undefined);
    }
    const handleSubmit = (event: any) => {
        event.preventDefault();
        if (sessionEditId) {
            mutateUpdateExamSession({sessionId: sessionEditId, data: {classRoomId, supervisorName}}, {
                onSuccess: () => {
                    setSessionFormDialogOpen(false);
                    setSessionEditId(undefined);
                }
            });
        } else {
            mutateCreateExamSession({examId: examId, data: {classRoomId, supervisorName}}, {
                onSuccess: () => {
                    setSessionFormDialogOpen(false);
                }
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
            <Dialog
                open={sessionFormDialogOpen}
                onClose={() => handleCloseSessionFormDialog}
            >
                <DialogTitle>{sessionEditId ? 'Edit Exam Session' : 'Add Exam Session'}</DialogTitle>
                <DialogContent>
                    <TextField
                        fullWidth
                        margin="dense"
                        label="ClassRoom ID"
                        value={classRoomId}
                        error={error?.fieldErrors?.classRoomId !== undefined}
                        helperText={error?.fieldErrors?.classRoomId}
                        onChange={(e) => setClassRoomId(e.target.value)}
                    />
                    <TextField
                        fullWidth
                        margin="dense"
                        label="Supervisor Name"
                        value={supervisorName}
                        error={error?.fieldErrors?.supervisorName !== undefined}
                        helperText={error?.fieldErrors?.supervisorName}
                        onChange={(e) => setSupervisorName(e.target.value)}
                    />
                    <Typography color="error">
                        {error?.message}
                    </Typography>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseSessionFormDialog}>Cancel</Button>
                    <Button onClick={handleSubmit}>{sessionEditId ? 'Edit' : 'Add'}</Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
}

export default ExamSessionTable;
