import axios from "axios";
import {StudentParticipationDto, StudentParticipation} from "../models/StudentParticipation";

export async function getStudentParticipations(sessionId: string | undefined) {
    if (!sessionId) {
        console.error('No sessionId provided for getStudentParticipations');
        throw new Error('No sessionId provided for getStudentParticipations');
    }
    try {
        const response = await axios.get<StudentParticipationDto[]>(`/exam-sessions/${sessionId}/participations`);
        return response.data.map((dto) => new StudentParticipation(dto));
    } catch (error) {
        console.error('Error getting student participations', error);
        throw error;
    }
}

export async function getStudentParticipation(participationId: string | undefined) {
    if (!participationId) {
        console.error('No participationId provided for getStudentParticipation');
        throw new Error('No participationId provided for getStudentParticipation');
    }
    try {
        const response = await axios.get<StudentParticipationDto>(`/student-participations/${participationId}`);
        return new StudentParticipation(response.data);
    } catch (error) {
        console.error('Error getting student participation', error);
        throw error;
    }
}
