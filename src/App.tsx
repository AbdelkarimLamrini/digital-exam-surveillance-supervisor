import React from 'react';
import './App.css';
import Onboarding from './Onboarding/Onboarding';
import {BrowserRouter, Navigate, Route, Routes} from 'react-router-dom';
import CreateExam from './Onboarding/CreateExam';
import axios from 'axios';
import {QueryClient, QueryClientProvider} from 'react-query';
import Supervise from './Supervise/Supervise';

axios.defaults.baseURL = process.env.REACT_APP_API_URL;
const queryClient = new QueryClient()

function App() {
  return (
    <QueryClientProvider client={queryClient}>
    <BrowserRouter>
    <Routes>
      <Route path="/" element={<Navigate replace to="/active" />} />
      <Route path="/:type" element={<Onboarding />} />
      <Route path="/create-exam" element={<CreateExam />} />
      <Route path="/exam/:examId/session/:sessionId/supervise" element={<Supervise />} />
    </Routes>
  </BrowserRouter>
  </QueryClientProvider>
  );
}

export default App;
