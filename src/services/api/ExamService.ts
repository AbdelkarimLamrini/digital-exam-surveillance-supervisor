import axios from "axios";
import {Exam, ExamDto, NewExamDto} from "../../models/Exam";


export const getExams = async (): Promise<Exam[]> => {
    try {
        const response = await axios.get<ExamDto[]>('/exams');
        return response.data.map(examDto => new Exam(examDto));
    } catch (error) {
        console.error('Error getting exams', error);
        throw error;
    }
}

export const getExamDetails = async (examId: string | undefined): Promise<Exam> => {
    if (!examId) {
        console.error('No examId provided for getExamDetails');
        throw new Error('No examId provided for getExamDetails');
    }
    const url = `/exams/${examId}`;
    try {
        const response = await axios.get<ExamDto>(url);
        return new Exam(response.data);
    } catch (error) {
        console.error('Error getting exam details', error);
        throw error;
    }
};

export const createExam = async (data: NewExamDto) => {
    try {
        const response = await axios.post('/exams', data, {
            headers: {'Content-Type': 'application/json'}
        });
        return response.data;
    } catch (error) {
        console.error('Error creating exam', error);
        throw error;
    }
}

export const updateExam = async (id: string | undefined, data: NewExamDto) => {
    if (!id) {
        console.error('No examId provided for updateExam');
        throw new Error('No examId provided for updateExam');
    }
    try {
        const response = await axios.put(`/exams/${id}`, data, {
            headers: {'Content-Type': 'application/json'}
        });
        return response.data;
    } catch (error) {
        console.error('Error updating exam', error);
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