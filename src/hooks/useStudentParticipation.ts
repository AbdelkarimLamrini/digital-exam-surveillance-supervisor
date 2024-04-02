import {useQuery} from "react-query";
import {getStudentParticipation, getStudentParticipations} from "../services/studentParticipationService";

export function useGetStudentParticipations(sessionId: string | undefined) {
    const query = useQuery(["exam-sessions", sessionId, "participations"], () => getStudentParticipations(sessionId));

    return {
        students: query.data,
        statusGettingStudents: query.status,
        errorGettingStudents: query.error,
    }
}

export function useGetStudentParticipation(participationId: string | undefined) {
    const query = useQuery(["participations", participationId], () => getStudentParticipation(participationId));

    return {
        student: query.data,
        statusGettingStudent: query.status,
        errorGettingStudent: query.error,
    }
}