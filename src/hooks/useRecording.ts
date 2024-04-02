import {useMutation, useQuery, useQueryClient} from "react-query";
import {getRecordings, startRecording, stopRecording} from "../services/recordingService";

export function useGetRecordings(participationId: number) {
    const query = useQuery(["student-participations", participationId, "recordings"], () => getRecordings(participationId));

    return {
        recordings: query.data,
        errorGettingRecordings: query.error,
        statusGettingRecordings: query.status
    };
}

export function useStartRecording() {
    const {
        mutate: mutateStartRecording,
        isLoading: isLoadingStartingRecording,
        error: errorStartingRecording,
    } = useMutation((participationId: number) => startRecording(participationId));

    return {
        mutateStartRecording,
        isLoadingStartingRecording,
        errorStartingRecording,
    };
}


export function useStopRecording() {
    const queryClient = useQueryClient();
    let id: number;

    const {
        mutate: mutateStopRecording,
        isLoading: isLoadingStoppingRecording,
        error: errorStoppingRecording,
    } = useMutation((participationId: number) => {
        id = participationId;
        return stopRecording(participationId)
    }, {
        onSuccess: () => queryClient.invalidateQueries(["student-participations", id, "recordings"])
    });

    return {
        mutateStopRecording,
        isLoadingStoppingRecording,
        errorStoppingRecording,
    };
}

