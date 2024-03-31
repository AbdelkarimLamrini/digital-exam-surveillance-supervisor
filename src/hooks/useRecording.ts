import {useMutation, useQueryClient} from "react-query";
import {startRecording, stopRecording} from "../services/api/RecordService";

export function useStartRecording(invalidateQueryKey = "recordings") {
    const queryClient = useQueryClient();

    const {
        mutate,
        isLoading: isLoadingStartingRecording,
        isError: isErrorStartingRecording,
        error: errorStartingRecording,
        isSuccess: isSuccessStartingRecording,
    } = useMutation((studentParticipationId: string) => startRecording(studentParticipationId), {
        onSuccess: () => {
            queryClient.invalidateQueries([invalidateQueryKey]);
        },
        onError: (error) => {
            console.error('Error starting recording:', error);
        },
    });

    return {
        startRecordingMutate: mutate,
        isLoadingStartingRecording,
        isErrorStartingRecording,
        errorStartingRecording,
        isSuccessStartingRecording,
    };
}


export function useStopRecording(invalidateQueryKey = "recordings") {
    const queryClient = useQueryClient();

    const {
        mutate,
        isLoading: isLoadingStoppingRecording,
        isError: isErrorStoppingRecording,
        error: errorStoppingRecording,
        isSuccess: isSuccessStoppingRecording,
    } = useMutation((studentParticipationId: string) => stopRecording(studentParticipationId), {
        onSuccess: () => {
            queryClient.invalidateQueries([invalidateQueryKey]);
        },
        onError: (error) => {
            console.error('Error stopping recording:', error);
        },
    });

    return {
        stopRecordingMutate: mutate,
        isLoadingStoppingRecording,
        isErrorStoppingRecording,
        errorStoppingRecording,
        isSuccessStoppingRecording,
    };
}

