import {Box, Button, TextField, Typography} from "@mui/material";
import {DatePicker, TimePicker} from "@mui/x-date-pickers";
import React, {useEffect, useState} from "react";
import {Dayjs} from "dayjs";
import {RestError} from "../models/RestError";
import {NewExamDto} from "../models/Exam";
import {combineDateAndTimeISO} from "../utils/date";

interface ExamFormProps {
    examFormState: ExamFormState;
    handleSubmit: (exam: NewExamDto) => void;
    error?: RestError;
}

export interface ExamFormState {
    id: string;
    name: string;
    creatorName: string;
    date: Dayjs | null;
    start: Dayjs | null;
    end: Dayjs | null;
}

function ExamForm({examFormState,handleSubmit, error}: ExamFormProps){
    const [id, setId] = useState(examFormState.id);
    const [name, setName] = useState(examFormState.name);
    const [creatorName, setCreatorName] = useState(examFormState.creatorName);
    const [date, setDate] = useState<Dayjs | null>(examFormState.date);
    const [start, setStart] = useState<Dayjs | null>(examFormState.start);
    const [end, setEnd] = useState<Dayjs | null>(examFormState.end);

    useEffect(() => {
        setId(examFormState.id);
        setName(examFormState.name);
        setCreatorName(examFormState.creatorName);
        setDate(examFormState.date);
        setStart(examFormState.start);
        setEnd(examFormState.end);
    }, [examFormState]);


    const onSubmit = (event: any) => {
        event.preventDefault();
        if (!date || !start || !end) return;
        const newExamDto: NewExamDto = {
            id: id,
            name: name,
            creatorName: creatorName,
            startTime: combineDateAndTimeISO(date, start),
            endTime: combineDateAndTimeISO(date, end),
        }
        handleSubmit(newExamDto);
    }

    return (
        <form onSubmit={onSubmit}>
            <Box sx={{
                display: 'flex',
                flexDirection: 'column',
                gap: '1em',
            }}>
                <TextField
                    fullWidth
                    label="Exam ID"
                    value={id}
                    error={error?.fieldErrors?.id !== undefined}
                    helperText={error?.fieldErrors?.id}
                    onChange={(e) => setId(e.target.value)}
                />
                <TextField
                    fullWidth
                    label="Exam Name"
                    value={name}
                    error={error?.fieldErrors?.name !== undefined}
                    helperText={error?.fieldErrors?.name}
                    onChange={(e) => setName(e.target.value)}
                />
                <TextField
                    fullWidth
                    label="Creator Name"
                    value={creatorName}
                    error={error?.fieldErrors?.creatorName !== undefined}
                    helperText={error?.fieldErrors?.creatorName}
                    onChange={(e) => setCreatorName(e.target.value)}
                />
                <DatePicker
                    label="Date"
                    sx={{width: '100%'}}
                    value={date}
                    onChange={setDate}
                />
                <Box sx={{
                    display: 'flex',
                    flexDirection: 'row',
                    width: '100%',
                    gap: '1em',
                }}>
                    <TimePicker
                        sx={{flexGrow: 1}}
                        label="Start Time"
                        value={start}
                        onChange={setStart}
                    />
                    <TimePicker
                        sx={{flexGrow: 1}}
                        label="End Time"
                        value={end}
                        onChange={setEnd}
                    />
                </Box>

                <Typography color="error">
                    {error?.message}
                </Typography>

                <Button type="submit" variant="contained" color="primary">
                    Submit
                </Button>
            </Box>
        </form>
    );
}

export default ExamForm;