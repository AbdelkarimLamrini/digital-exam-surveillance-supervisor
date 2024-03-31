import React from 'react';
import './App.css';
import Exams from './pages/exams/Exams';
import {BrowserRouter, Navigate, Route, Routes} from 'react-router-dom';
import CreateExam from './pages/exam-create/CreateExam';
import axios from 'axios';
import {QueryClient, QueryClientProvider} from 'react-query';
import Supervise from './pages/supervise/Supervise';
import {ThemeProvider} from "@mui/material";
import CssBaseline from "@mui/material/CssBaseline";
import {theme} from "./utils/theme";
import {AdapterDayjs} from '@mui/x-date-pickers/AdapterDayjs';
import {LocalizationProvider} from '@mui/x-date-pickers/LocalizationProvider';

axios.defaults.baseURL = process.env.REACT_APP_API_URL;
const queryClient = new QueryClient()

function App() {
    return (
        <LocalizationProvider dateAdapter={AdapterDayjs}>
            <QueryClientProvider client={queryClient}>
                <ThemeProvider theme={theme}>
                    <CssBaseline/>
                    <BrowserRouter>
                        <Routes>
                            <Route path="/" element={<Navigate replace to="/exams"/>}/>
                            <Route path="/exams" element={<Exams/>}/>
                            <Route path="/exams/:examId" element={<Exams/>}/>
                            <Route path="/exams/:examId/edit" element={<Exams/>}/>
                            <Route path="/create-exam" element={<CreateExam/>}/>
                            <Route path="/supervise/:sessionId" element={<Supervise/>}/>
                        </Routes>
                    </BrowserRouter>
                </ThemeProvider>
            </QueryClientProvider>
        </LocalizationProvider>
    );
}

export default App;
