import {useQuery} from "react-query";
import {getStudentParticipations} from "../Api/StudentParticipationService";

export function useGetStudentParticipations(examId: string | undefined, sessionId: string | undefined) {
    const query = useQuery(["getStudentParticipations", examId, sessionId], () => getStudentParticipations(examId, sessionId));

    return {
        data: query.data,
        isLoadingGettingStudents: query.isLoading,
        isErrorGettingStudents: query.isError,
        isSuccessGettingStudents: query.isSuccess,
    }
}