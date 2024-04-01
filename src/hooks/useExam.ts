import {useMutation, useQuery, useQueryClient} from "react-query";
import {createExam, deleteExam, getExamDetails, getExams, updateExam} from "../services/examService";
import {NewExamDto} from "../models/Exam";


export function useGetExams() {
    const query = useQuery(["exams"], () => getExams());

    return {
        exams: query.data,
        errorGettingExams: query.error,
        statusGettingExams: query.status
    }
}

export function useGetExamDetails(examId: string | undefined) {
    const query = useQuery(["exams", examId], () => getExamDetails(examId));

    return {
        exam: query.data,
        errorGettingExamDetails: query.error,
        statusGettingExamDetails: query.status
    };
}

export function useCreateExam(invalidateQueryKey = "exams") {
    const queryClient = useQueryClient();

    const {
        mutate: mutateCreateExam,
        error: errorCreatingExam,
        isError: isErrorCreatingExam,
    } = useMutation((data: NewExamDto) => createExam(data), {
        onSuccess: async () => {
            await queryClient.invalidateQueries([invalidateQueryKey]);
        },
    });

    return {
        mutateCreateExam,
        errorCreatingExam,
        isErrorCreatingExam,
    };
}


export function useUpdateExam(invalidateQueryKey = "exams") {
    const queryClient = useQueryClient();

    const {
        mutate: mutateUpdateExam,
        error: errorUpdatingExam,
        isError: isErrorUpdatingExam,
    } = useMutation(
        ({id, data}: { id: string | undefined; data: NewExamDto }) => updateExam(id, data), {
            onSuccess: async () => {
                await queryClient.invalidateQueries([invalidateQueryKey]);
            },
        });

    return {
        mutateUpdateExam,
        errorUpdatingExam,
        isErrorUpdatingExam,
    };
}

export function useDeleteExam() {
    const queryClient = useQueryClient();

    const {
        mutate,
        isError: isErrorDeletingExam,
        error: errorDeletingExam,
    } = useMutation((id: string) => deleteExam(id), {
        onSuccess: async () => {
            await queryClient.invalidateQueries(['exams']);
        },
        onError: (error) => {
            console.error('Error deleting exam:', error);
        },
    });

    return {
        mutateDeleteExam: mutate,
        isErrorDeletingExam,
        errorDeletingExam,
    };
}
