import axios from "axios";
import {CreateExamSessionDto} from "./dto/ExamSession";

export const createExamSession = async (examId: string, data: CreateExamSessionDto) => {
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

export const getAllExamSessions = async (examId: string) => {
    if (!examId) {
        console.error('No examId provided for getAllExamSessions');
        return; 
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

