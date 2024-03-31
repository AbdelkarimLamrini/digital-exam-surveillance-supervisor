import axios from "axios";
import {StudentParticipation} from "../../models/StudentParticipation";

export async function getStudentParticipations(examId: string | undefined, sessionId: string | undefined) {
    if (!examId || !sessionId || isNaN(parseInt(sessionId))) {
        throw new Error('Invalid examId or sessionId');
    }
    const url = `/exam/${examId}/session/${sessionId}/participation`;
    try {
        const response = await axios.get<StudentParticipation[]>(url);
        return response.data;
    } catch (error) {
        console.error('Error getting student participations', error);
        throw error;
    }
}
