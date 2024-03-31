import {useMutation, useQuery, useQueryClient} from "react-query";
import {createExam, deleteExam, getExams, getExamDetails, updateExam} from "../services/api/ExamService";
import {ExamDto, NewExamDto} from "../models/Exam";


export function useGetExams() {
    const query = useQuery(["getExams"], () => getExams());

    return {
        exams: query.data,
        errorGettingExams: query.error,
        statusGettingExams: query.status
    }
}

export function useGetExamDetails(examId: string | undefined) {
    const query = useQuery(["getExamDetails", examId], () => getExamDetails(examId));

    return {
        exam: query.data,
        errorGettingExamDetails: query.error,
        statusGettingExamDetails: query.status
    };
}

export function useCreateExam(invalidateQueryKey = "createExam") {
    const queryClient = useQueryClient();

    const {
        mutate: mutateCreateExam,
        isLoading: isLoadingCreatingExam,
        isError: isErrorCreatingExam,
        isSuccess: isSuccessCreatingExam,
        error: errorCreatingExam,
    } = useMutation((data: NewExamDto) => createExam(data), {
        onSuccess: async () => {
            await queryClient.invalidateQueries([invalidateQueryKey]);
        },
    });

    return {
        mutateCreateExam,
        isLoadingCreatingExam,
        isErrorCreatingExam,
        errorCreatingExam,
        isSuccessCreatingExam,
    };
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
            onSuccess: async () => {
                await queryClient.invalidateQueries([invalidateQueryKey]);
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
        onSuccess: async () => {
            await queryClient.invalidateQueries(['getExams']);
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
