import axios from "axios";
import {Exam, ExamDto, NewExamDto} from "../../models/Exam";


export const createExam = async (data: NewExamDto) => {
    try {
        const response = await axios.post('/exams', data, {
            headers: {
                'Content-Type': 'application/json'
            }
        });
        return response.data;
    } catch (error) {
        console.error('Error creating exam', error);
        throw error;
    }
}

export const deleteExam = async (id: string) => {
    try {
        await axios.delete(`/exams/${id}`);
    } catch (error) {
        console.error('Error deleting exam', error);
        throw error;
    }
}


export const getExams = async (): Promise<Exam[]> => {
    try {
        const response = await axios.get<ExamDto[]>('/exams');
        return response.data.map(examDto => new Exam(examDto));
    } catch (error) {
        console.error('Error getting exams', error);
        throw error;
    }
}

export const updateExam = async (id: string, data: ExamDto) => {
    try {
        const response = await axios.put(`/exams/${id}`, data, {
            headers: {
                'Content-Type': 'application/json'
            }
        });
        return response.data;
    } catch (error) {
        console.error('Error updating exam', error);
        throw error;
    }
}