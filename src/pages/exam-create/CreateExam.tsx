import React, {useState} from 'react';
import dayjs, {Dayjs} from 'dayjs';
import {Box, Button, Container, TextField, Typography} from '@mui/material';
import {useExam} from '../../hooks/useExam';
import {NewExamDto} from '../../models/Exam';
import {useNavigate} from 'react-router-dom';
import {DatePicker, TimePicker} from "@mui/x-date-pickers";

function CreateExam() {
    const [id, setId] = useState('');
    const [name, setName] = useState('');
    const [creatorName, setCreatorName] = useState('');
    const [date, setDate] = useState<Dayjs | null>(dayjs(new Date()));
    const [start, setStart] = useState<Dayjs | null>(dayjs(new Date()));
    const [end, setEnd] = useState<Dayjs | null>(dayjs(new Date()));
    const {mutateCreateExam} = useExam("createExam");
    const navigate = useNavigate();


    const handleSubmit = (event: any) => {
        event.preventDefault();
        console.log({id, name, creatorName, start, end});

        if (!date || !start || !end) {
            console.error('Invalid date(s)');
            return;
        }
        const newExamDto: NewExamDto = {
            id: id,
            name: name,
            creatorName: creatorName,
            startTime: start.toISOString(),
            endTime: end.toISOString(),
        };
        console.log(newExamDto);
        mutateCreateExam(newExamDto, {
            onSuccess: () => {
                navigate('/exams');
            },
        });
    };


    return (
        <Container className='mx-auto' maxWidth="sm">
            <Typography variant="h2" component="h1">
                Create New Exam
            </Typography>
            <form onSubmit={handleSubmit}>
                <Box sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: '1em',
                }}>
                    <TextField
                        fullWidth
                        label="Exam ID"
                        value={id}
                        onChange={(e) => setId(e.target.value)}
                    />
                    <TextField
                        fullWidth
                        label="Exam Name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                    />
                    <TextField
                        fullWidth
                        label="Creator Name"
                        value={creatorName}
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
                        justifyContent: 'space-between',
                        width: '100%',
                        gap: '1em',
                    }}>
                        <TimePicker
                            label="Start Time"
                            value={start}
                            onChange={setStart}
                        />
                        <TimePicker
                            label="End Time"
                            value={end}
                            onChange={setEnd}
                        />
                    </Box>

                    <Button type="submit" variant="contained" color="primary" style={{marginTop: '20px'}}>
                        Submit
                    </Button>
                </Box>
            </form>
        </Container>
    );
}

export default CreateExam;
