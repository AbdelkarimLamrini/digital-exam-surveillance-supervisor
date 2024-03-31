import React, {useEffect, useState} from 'react';
import dayjs, {Dayjs} from 'dayjs';
import {Box, Button, Container, TextField, Typography} from '@mui/material';
import {useExam} from '../../hooks/useExam';
import {NewExamDto} from '../../models/Exam';
import {useNavigate} from 'react-router-dom';
import {DatePicker, TimePicker} from "@mui/x-date-pickers";
import {combineDateAndTimeISO} from "../../utils/date";
import {RestError} from "../../models/RestError";

function CreateExam() {
    const [id, setId] = useState('');
    const [name, setName] = useState('');
    const [creatorName, setCreatorName] = useState('');
    const [date, setDate] = useState<Dayjs | null>(dayjs());
    const [start, setStart] = useState<Dayjs | null>(dayjs());
    const [end, setEnd] = useState<Dayjs | null>(dayjs());
    const {mutateCreateExam, isErrorCreatingExam, errorCreatingExam} = useExam("createExam");
    const [error, setError] = useState<RestError>();
    const navigate = useNavigate();


    useEffect(() => {
        if (isErrorCreatingExam) {
            // @ts-ignore
            setError(errorCreatingExam.response.data as RestError)
        }
    }, [isErrorCreatingExam, errorCreatingExam]);

    const handleSubmit = (event: any) => {
        event.preventDefault();
        if (!date || !start || !end) return;

        const newExamDto: NewExamDto = {
            id: id,
            name: name,
            creatorName: creatorName,
            startTime: combineDateAndTimeISO(date, start),
            endTime: combineDateAndTimeISO(date, end),
        };

        mutateCreateExam(newExamDto, {
            onSuccess: () => {
                navigate('/exams');
            },
        });
    };

    return (
        <Container>
            <Typography variant="h2" component="h1">
                Create a new exam
            </Typography>
            <Box sx={{my: 4}} maxWidth="sm">
                <form onSubmit={handleSubmit}>
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
            </Box>
        </Container>
    );
}

export default CreateExam;
