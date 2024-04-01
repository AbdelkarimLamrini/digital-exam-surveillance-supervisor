import {useMutation, useQuery, useQueryClient} from "react-query";
import {NewExamSessionDto} from "../models/ExamSession";
import {
    createExamSession, deleteExamSession,
    getAllExamSessions,
    getExamSessionDetails,
    updateExamSession
} from "../services/api/ExamSessionService";

export function useGetAllExamSessions(examId: string) {
    const query = useQuery(["exams", examId, "sessions"], () => getAllExamSessions(examId));

    return {
        examSessions: query.data,
        errorGettingExamSessions: query.error,
        statusGettingExamSessions: query.status,
    };
}

export function useGetExamSessionDetails(sessionId: string | undefined) {
    const query = useQuery(["exam-sessions", sessionId], () => getExamSessionDetails(sessionId));

    return {
        examSession: query.data,
        errorGettingExamSessionDetails: query.error,
        statusGettingExamSessionDetails: query.status,
    };
}

export function useCreateExamSession(invalidateQueryKey = "exams") {
    const queryClient = useQueryClient();

    const {
        mutate: mutateCreateExamSession,
        error: errorCreatingExamSession,
        isError: isErrorCreatingExamSession,
    } = useMutation(({examId, data}: { examId: string, data: NewExamSessionDto }) => createExamSession(examId, data), {
        onSuccess: async () => {
            await queryClient.invalidateQueries([invalidateQueryKey]);
        },
    });

    return {
        mutateCreateExamSession,
        isErrorCreatingExamSession,
        errorCreatingExamSession,
    };
}

export function useUpdateExamSession(invalidateQueryKey = "exams") {
    const queryClient = useQueryClient();

    const {
        mutate: mutateUpdateExamSession,
        error: errorUpdatingExamSession,
        isError: isErrorUpdatingExamSession,
    } = useMutation(({sessionId, data}: { sessionId: number, data: NewExamSessionDto }) => updateExamSession(sessionId, data), {
        onSuccess: async () => {
            await queryClient.invalidateQueries([invalidateQueryKey]);
        },
    });

    return {
        mutateUpdateExamSession,
        isErrorUpdatingExamSession,
        errorUpdatingExamSession,
    };
}

export function useDeleteExamSession(invalidateQueryKey = "exams") {
    const queryClient = useQueryClient();

    const {
        mutate: mutateDeleteExamSession,
        error: errorDeletingExamSession,
        isError: isErrorDeletingExamSession,
    } = useMutation((sessionId: number) => deleteExamSession(sessionId), {
        onSuccess: async () => {
            await queryClient.invalidateQueries([invalidateQueryKey]);
        },
    });

    return {
        mutateDeleteExamSession,
        isErrorDeletingExamSession,
        errorDeletingExamSession,
    };
}