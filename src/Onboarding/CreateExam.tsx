import React, {useState} from 'react';
import {Button, Container, TextField, Typography} from '@mui/material';
import DateTimePicker from 'react-datetime-picker'
import '../Onboarding/DateTimePicker.css'
import 'react-calendar/dist/Calendar.css';
import 'react-clock/dist/Clock.css';
import {useExam} from '../Hooks/useExam';
import {CreateExamDto} from '../Api/dto/Exam';
import {useNavigate} from 'react-router-dom';
import {format} from 'date-fns';
import SidebarHome from './SidebarHome';

type ValuePiece = Date | null;

type Value = ValuePiece | [ValuePiece, ValuePiece];

function CreateExam() {
  const [examID, setExamID] = useState('');
  const [examSubject, setExamSubject] = useState('');
  const [docentName, setDocentName] = useState('');
  const [beginDate, setBeginDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [beginValue, onBeginChange] = useState<Value>(new Date());
  const [endValue, onEndChange] = useState<Value>(new Date());
  const { mutateCreateExam } = useExam("createExam"); 
  const navigate = useNavigate();


  const handleBeginDateChange = (newValue: ValuePiece) => {
    onBeginChange(newValue); 
    if(newValue instanceof Date) {
      setBeginDate(newValue);
    }
  };
  
  const handleEndDateChange = (newValue: ValuePiece) => {
    onEndChange(newValue); 
    if(newValue instanceof Date) {
      setEndDate(newValue);
    }
  };

  
  const handleSubmit = (event: { preventDefault: () => void; }) => {
    event.preventDefault();
    console.log({ examID, examSubject, docentName, beginDate, endDate });
  
    
    if (!beginDate || !endDate || !(beginDate instanceof Date) || !(endDate instanceof Date)) {
      console.error('Invalid date(s)');
      return;
    }
  
  
    const adjustedBeginDate = new Date(beginDate.getTime()  );
    const adjustedEndDate = new Date(endDate.getTime());

    const formattedBeginDate = format(adjustedBeginDate, "yyyy-MM-dd'T'HH:mm:ss");
    const formattedEndDate = format(adjustedEndDate, "yyyy-MM-dd'T'HH:mm:ss");

  
    const examData: CreateExamDto = {
      id: examID,
      name: examSubject,
      creatorName: docentName,
      startTime: formattedBeginDate,
      endTime: formattedEndDate,
    };
    console.log(examData);
    mutateCreateExam(examData, {
      onSuccess: () => {
        navigate('/active'); 
      },
    });
  };

  
  return (
    <div className='flex flex-row'>
     <SidebarHome />
      <Container className='mx-auto' maxWidth="sm">
      <Typography className='py-5 text-center' variant="h5" component="h1" gutterBottom sx={{ color: 'black', fontWeight: 'bold' }}>
        Create New Exam
      </Typography>
      <div className='w-full border border-black-200 rounded-lg shadow sm:p-8 dark:bg-black-800'>
        <form onSubmit={handleSubmit}>
          <TextField
            margin="normal"
            fullWidth
            label="Exam ID"
            InputLabelProps={{
              style: { color: 'black' },
            }}
            InputProps={{
              style: { color: 'black' }, 
            }}
            value={examID}
            onChange={(e) => setExamID(e.target.value)}
          />
          <TextField
            margin="normal"
            fullWidth
            label="Exam Subject"
            InputLabelProps={{
              style: { color: 'black' }, 
            }}
            InputProps={{
              style: { color: 'black' }, 
            }}
            value={examSubject}
            onChange={(e) => setExamSubject(e.target.value)}
          />
          <TextField
            margin="normal"
            fullWidth
            label="Docent Name"
            InputLabelProps={{
              style: { color: 'black' },
            }}
            InputProps={{
              style: { color: 'black' }, 
            }}
            value={docentName}
            onChange={(e) => setDocentName(e.target.value)}
          />
          <div className="datepicker-wrapper" style={{ marginTop: '20px' }}>
            <Typography variant="subtitle1" gutterBottom sx={{ color: 'black' }}>Begin Date</Typography>
            <DateTimePicker onChange={handleBeginDateChange} value={beginValue} />
            
          </div>
          <div className="datepicker-wrapper" style={{ marginTop: '20px' }}>
            <Typography variant="subtitle1" gutterBottom sx={{ color: 'black' }}>End Date</Typography>
            <DateTimePicker onChange={handleEndDateChange} value={endValue} />

          </div>
          <Button type="submit" variant="contained" color="primary" style={{ marginTop: '20px' }}>
            Submit
          </Button>
        </form>
        </div>
      </Container>
    </div>
  );
}

export default CreateExam;
