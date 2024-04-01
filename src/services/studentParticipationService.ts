import axios from "axios";
import {StudentParticipation} from "../models/StudentParticipation";

export async function getStudentParticipations(sessionId: string | undefined) {
    if (!sessionId || isNaN(+sessionId)) {
        console.error('Invalid sessionId');
        throw new Error('Invalid sessionId');
    }
    const url = `/exam-sessions/${sessionId}/participations`;
    try {
        const response = await axios.get<StudentParticipation[]>(url);
        return response.data;
    } catch (error) {
        console.error('Error getting student participations', error);
        throw error;
    }
}
