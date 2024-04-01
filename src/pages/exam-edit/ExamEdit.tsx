import React, {useEffect, useState} from 'react';
import dayjs, {Dayjs} from 'dayjs';
import {Box, Button, Container, Grid, TextField, Typography} from '@mui/material';
import {useGetExamDetails, useUpdateExam} from '../../hooks/useExam';
import {NewExamDto} from '../../models/Exam';
import {useNavigate, useParams} from 'react-router-dom';
import {DatePicker, TimePicker} from "@mui/x-date-pickers";
import {combineDateAndTimeISO} from "../../utils/date";
import {RestError} from "../../models/RestError";
import ExamSessionTable from "./ExamSessionTable";

function CreateExam() {
    const {examId} = useParams();
    const {exam, statusGettingExamDetails} = useGetExamDetails(examId);
    const {mutateUpdateExam, errorUpdatingExam, isErrorUpdatingExam} = useUpdateExam();
    const [id, setId] = useState('');
    const [name, setName] = useState('');
    const [creatorName, setCreatorName] = useState('');
    const [date, setDate] = useState<Dayjs | null>(dayjs());
    const [start, setStart] = useState<Dayjs | null>(dayjs());
    const [end, setEnd] = useState<Dayjs | null>(dayjs());
    const [error, setError] = useState<RestError>();
    const navigate = useNavigate();

    useEffect(() => {
        if (statusGettingExamDetails === 'success' && exam) {
            setId(exam.id);
            setName(exam.name);
            setCreatorName(exam.creatorName);
            setDate(dayjs(exam.startTime));
            setStart(dayjs(exam.startTime));
            setEnd(dayjs(exam.endTime));
        }
    }, [statusGettingExamDetails, exam]);

    useEffect(() => {
        if (isErrorUpdatingExam) {
            // @ts-ignore
            setError(errorUpdatingExam.response.data as RestError)
        }
    }, [isErrorUpdatingExam, errorUpdatingExam]);

    const handleEditExam = (event: any) => {
        event.preventDefault();
        if (!date || !start || !end) return;

        const newExamDto: NewExamDto = {
            id: id,
            name: name,
            creatorName: creatorName,
            startTime: combineDateAndTimeISO(date, start),
            endTime: combineDateAndTimeISO(date, end),
        };

        mutateUpdateExam({id: examId, data: newExamDto}, {
            onSuccess: () => {
                navigate(`/exams/${examId}`);
            },
        });
    };

    if (statusGettingExamDetails === 'error' || !exam) {
        return (
            <Container>
                <Typography variant="h2" component="h1">
                    Exam not found
                </Typography>
            </Container>
        );
    }

    return (
        <Container>
            <Typography variant="h3" component="h1">Edit exam</Typography>
            <Grid container spacing={2} sx={{my: 4}}>
                <Grid item xs={12} md={6}>
                    <form onSubmit={handleEditExam}>
                        <Box sx={{
                            display: 'flex',
                            flexDirection: 'column',
                            gap: '1em',
                        }}>
                            <Typography variant="h4" component="h2">Exam info</Typography>
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

                            <Box sx={{display: 'flex', gap: '1em'}}>
                                <Button onClick={() => navigate(`/exams/${examId}`)}
                                        variant="outlined" color="primary">
                                    Details
                                </Button>
                                <Button type="submit" variant="contained" color="primary">
                                    Submit
                                </Button>
                            </Box>
                        </Box>
                    </form>
                </Grid>
                <Grid item xs={12} md={6}>
                    <Typography variant="h4" component="h2">Exam sessions</Typography>
                    <ExamSessionTable examId={exam.id} examSessions={exam.examSessions}/>
                </Grid>
            </Grid>
        </Container>
    );
}

export default CreateExam;
