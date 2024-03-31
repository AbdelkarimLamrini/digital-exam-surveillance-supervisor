import {useMutation, useQuery, useQueryClient} from "react-query";
import {NewExamSessionDto} from "../models/ExamSession";
import {createExamSession, getAllExamSessions, getExamSessionDetails} from "../services/api/ExamSessionService";

export function useGetAllExamSessions(examId: string) {
    return useQuery(
        ["getAllExamSessions", examId],
        () => getAllExamSessions(examId),
        {enabled: !!examId} // Only fetch when examId is truthy
    );
}

export function useGetExamSessionDetails(sessionId: string | undefined) {
    const query =  useQuery(["getExamSessionDetails", sessionId], () => getExamSessionDetails(sessionId));

    return {
        examSession: query.data,
        errorGettingExamSessionDetails: query.error,
        statusGettingExamSessionDetails: query.status,
    };
}

export function useCreateExamSession(invalidateQueryKey = "createExamSessions") {
    const queryClient = useQueryClient();

    const {
        mutate,
        isLoading: isLoadingCreatingExamSession,
        isError: isErrorCreatingExamSession,
        error: errorCreatingExamSession,
        isSuccess: isSuccessCreatingExamSession,
    } = useMutation(({examId, data}: {
        examId: string,
        data: NewExamSessionDto
    }) => createExamSession(examId, data), {
        onSuccess: () => {
            queryClient.invalidateQueries([invalidateQueryKey]);
        },
        onError: (error) => {
            console.error('Error creating exam:', error);
        },
    });

    return {
        mutateCreateExamSession: mutate,
        isLoadingCreatingExamSession,
        isErrorCreatingExamSession,
        errorCreatingExamSession,
        isSuccessCreatingExamSession,
    };
}