import axios from "axios";
import {CreateExamDto, GetAllExamsDto} from "./dto/Exam";


export const createExam = async (data: CreateExamDto) => {
    try {
        const response = await axios.post('/exam', data, {
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
        await axios.delete(`/exam/${id}`);
    } catch (error) {
        console.error('Error deleting exam', error);
        throw error;
    }
}


export const getAllExams = async () => {
    try {
        const response = await axios.get('/exam');
        return response.data;
    } catch (error) {
        console.error('Error getting exams', error);
        throw error;
    }
}

export const updateExam = async (id: string, data: GetAllExamsDto) => {
    try {
        const response = await axios.put(`/exam/${id}`, data, {
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