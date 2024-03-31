import axios from "axios";
import {ExamSessionDetail, ExamSessionDetailDto, NewExamSessionDto} from "../../models/ExamSession";

export const getAllExamSessions = async (examId: string) => {
    if (!examId) {
        console.error('No examId provided for getAllExamSessions');
        throw new Error('No examId provided for getAllExamSessions');
    }
    try {
        const response = await axios.get(`/exam/${examId}/session`, {
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
    if (!sessionId) {
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

export const createExamSession = async (examId: string, data: NewExamSessionDto) => {
    try {
        const response = await axios.post(`/exam/${examId}/session`, data, {
            headers: {
                'Content-Type': 'application/json'
            }
        });
        return response.data;
    } catch (error) {
        console.error('Error creating exam session', error);
        throw error;
    }
};
