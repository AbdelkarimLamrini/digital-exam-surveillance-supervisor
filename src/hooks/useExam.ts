import {useMutation, useQuery, useQueryClient} from "react-query";
import {createExam, deleteExam, getExams, updateExam} from "../services/api/ExamService";
import {NewExamDto, ExamDto} from "../models/Exam";
import {getExamDetails} from "../services/api/ExamInfoService";


export function useExam(invalidateQueryKey = "createExam") {
    const queryClient = useQueryClient();

    const {
        mutate,
        isLoading: isLoadingCreatingExam,
        isError: isErrorCreatingExam,
        error: errorCreatingExam,
        isSuccess: isSuccessCreatingExam,
    } = useMutation((data: NewExamDto) => createExam(data), {
        onSuccess: () => {
            queryClient.invalidateQueries([invalidateQueryKey]);
        },
        onError: (error) => {
            console.error('Error creating exam:', error);
        },
    });

    return {
        mutateCreateExam: mutate,
        isLoadingCreatingExam,
        isErrorCreatingExam,
        errorCreatingExam,
        isSuccessCreatingExam,
    };
}

export function useGetExams() {
    const query = useQuery(["getExams"], () => getExams());

    return {
        exams: query.data,
        errorGettingExams: query.error,
        statusGettingExams: query.status
    }
}


export function useUpdateExam(invalidateQueryKey = "updateExam") {
    const queryClient = useQueryClient();

    const {
        mutate,
        isLoading: isLoadingUpdatingExam,
        isError: isErrorUpdatingExam,
        error: errorUpdatingExam,
        isSuccess: isSuccessUpdatingExam,
    } = useMutation(
        ({id, data}: { id: string; data: ExamDto }) => updateExam(id, data), {
            onSuccess: () => {
                queryClient.invalidateQueries([invalidateQueryKey]);
            },
            onError: (error) => {
                console.error('Error creating exam:', error);
            },
        });

    return {
        mutateCreateExam: mutate,
        isLoadingUpdatingExam,
        isErrorUpdatingExam,
        errorUpdatingExam,
        isSuccessUpdatingExam,
    };
}

export function useDeleteExam() {
    const queryClient = useQueryClient();

    const {
        mutate,
        isLoading: isLoadingDeletingExam,
        isError: isErrorDeletingExam,
        error: errorDeletingExam,
        isSuccess: isSuccessDeletingExam,
    } = useMutation((id: string) => deleteExam(id), {
        onSuccess: () => {
            queryClient.invalidateQueries(['getExams']);
        },
        onError: (error) => {
            console.error('Error deleting exam:', error);
        },
    });

    return {
        mutateDeleteExam: mutate,
        isLoadingDeletingExam,
        isErrorDeletingExam,
        errorDeletingExam,
        isSuccessDeletingExam,
    };
}

export function useExamInfo(examId: string, sessionId: string | undefined) {
    const queryClient = useQueryClient();

    const query = useQuery(["getExamDetails", examId, sessionId], () => getExamDetails(examId, sessionId), {
        enabled: !!examId,
        onSuccess: () => {

            queryClient.invalidateQueries(['getExamDetails']);
        },
        onError: (error) => {
            console.error('Error fetching exam details:', error);
        },
    });

    return {
        data: query.data,
        isLoading: query.isLoading,
        isError: query.isError,
        error: query.error,
        isSuccess: query.isSuccess,
    };
}




