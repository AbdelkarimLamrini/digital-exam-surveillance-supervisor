import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import TextField from "@mui/material/TextField";
import {Typography} from "@mui/material";
import DialogActions from "@mui/material/DialogActions";
import Button from "@mui/material/Button";
import React, {useEffect, useState} from "react";
import {RestError} from "../../models/RestError";
import {NewExamSessionDto} from "../../models/ExamSession";

interface ExamSessionFormDialogProps {
    editMode: boolean;
    dialogOpen: boolean;
    handleCloseDialog: () => void;
    examSessionFormState: ExamSessionFormState;
    handleSubmit: (examSession: NewExamSessionDto) => void;
    error?: RestError;
}

export interface ExamSessionFormState {
    classRoomId: string;
    supervisorName: string;
}

function ExamSessionFormDialog(
    {
        editMode,
        dialogOpen,
        handleCloseDialog,
        examSessionFormState,
        handleSubmit,
        error,
    }: ExamSessionFormDialogProps) {
    const [classRoomId, setClassRoomId] = useState(examSessionFormState.classRoomId);
    const [supervisorName, setSupervisorName] = useState(examSessionFormState.supervisorName);

    useEffect(() => {
        setClassRoomId(examSessionFormState.classRoomId);
        setSupervisorName(examSessionFormState.supervisorName);
    }, [examSessionFormState, dialogOpen]);

    const onSubmit = (event: any) => {
        event.preventDefault();
        const newExamSessionDto: NewExamSessionDto = {
            classRoomId: classRoomId,
            supervisorName: supervisorName
        }
        handleSubmit(newExamSessionDto);
    }

    return (
        <Dialog
            open={dialogOpen}
            onClose={() => handleCloseDialog}
        >
            <DialogTitle>{editMode ? 'Edit Exam Session' : 'Add Exam Session'}</DialogTitle>
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
                <Button onClick={handleCloseDialog}>Cancel</Button>
                <Button onClick={onSubmit}>{editMode ? 'Edit' : 'Add'}</Button>
            </DialogActions>
        </Dialog>
    );
}

export default ExamSessionFormDialog;