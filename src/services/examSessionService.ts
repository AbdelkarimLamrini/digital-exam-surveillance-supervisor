import axios from "axios";
import {ExamSessionDetail, ExamSessionDetailDto, NewExamSessionDto} from "../models/ExamSession";

export const getAllExamSessions = async (examId: string | undefined) => {
    if (!examId) {
        console.error('No examId provided for getAllExamSessions');
        throw new Error('No examId provided for getAllExamSessions');
    }
    try {
        const response = await axios.get(`/exams/${examId}/sessions`, {
            headers: {
                'Content-Type': 'application/json'
            }
        });
        return response.data;
    } catch (error) {
        console.error('Error getting all exam sessions', error);
        throw error;
    }
};

export const getExamSessionDetails = async (sessionId: string | undefined): Promise<ExamSessionDetail> => {
    if (!sessionId || isNaN(+sessionId)) {
        console.error('No sessionId provided for getExamSessionDetails');
        throw new Error('No sessionId provided for getExamSessionDetails');
    }
    try {
        const response = await axios.get<ExamSessionDetailDto>(`/exam-sessions/${sessionId}`);
        return new ExamSessionDetail(response.data);
    } catch (error) {
        console.error('Error getting exam session details', error);
        throw error;
    }
};

export const createExamSession = async (examId: string | undefined, data: NewExamSessionDto) => {
    if (!examId) {
        console.error('No examId provided for createExamSession');
        throw new Error('No examId provided for createExamSession');
    }
    try {
        const response = await axios.post(`/exams/${examId}/sessions`, data, {
            headers: {'Content-Type': 'application/json'}
        });
        return response.data;
    } catch (error) {
        console.error('Error creating exam session', error);
        throw error;
    }
};

export const updateExamSession = async (sessionId: number, data: NewExamSessionDto) => {
    if (!sessionId || isNaN(+sessionId)) {
        console.error('No sessionId provided for getExamSessionDetails');
        throw new Error('No sessionId provided for getExamSessionDetails');
    }
    try {
        const response = await axios.put(`/exam-sessions/${sessionId}`, data, {
            headers: {'Content-Type': 'application/json'}
        });
        return response.data;
    } catch (error) {
        console.error('Error updating exam session', error);
        throw error;
    }
};

export const deleteExamSession = async (sessionId: number) => {
    if (!sessionId || isNaN(+sessionId)) {
        console.error('No sessionId provided for deleteExamSession');
        throw new Error('No sessionId provided for deleteExamSession');
    }
    try {
        const response = await axios.delete(`/exam-sessions/${sessionId}`);
        return response.data;
    } catch (error) {
        console.error('Error deleting exam session', error);
        throw error;
    }
};
