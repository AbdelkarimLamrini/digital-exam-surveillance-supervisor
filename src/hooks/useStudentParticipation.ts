import {useQuery} from "react-query";
import {getStudentParticipations} from "../services/studentParticipationService";

export function useGetStudentParticipations(sessionId: string | undefined) {
    const query = useQuery(["getStudentParticipations", sessionId], () => getStudentParticipations(sessionId));

    return {
        studentParticipations: query.data,
        statusGettingStudentParticipations: query.status,
        errorGettingStudentParticipations: query.error,
    }
}