import {useMutation, useQuery, useQueryClient} from "react-query";
import {CreateExamSessionDto} from "../Api/dto/ExamSession";
import {createExamSession, getAllExamSessions} from "../Api/ExamSessionService";

export function useCreateExamSession(invalidateQueryKey = "createExamSessions") {
    const queryClient = useQueryClient();

    const {
        mutate,
        isLoading: isLoadingCreatingExamSession,
        isError: isErrorCreatingExamSession,
        error: errorCreatingExamSession, 
        isSuccess: isSuccessCreatingExamSession, 
    } = useMutation(({examId, data}: {examId: string, data: CreateExamSessionDto}) => createExamSession(examId, data), {
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

export function useGetAllExamSessions(examId: string) {
    return useQuery(
      ["getAllExamSessions", examId],
      () => getAllExamSessions(examId),
      { enabled: !!examId } // Only fetch when examId is truthy
    );
  }
