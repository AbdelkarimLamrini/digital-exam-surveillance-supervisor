import axios from "axios";
import {Recording, RecordingDto} from "../models/Recording";

export const getRecordings = async (participationId: number): Promise<Recording[]> => {
    try {
        const response = await axios.get<RecordingDto[]>(`/student-participations/${participationId}/recordings`);
        return response.data.map((recording) => new Recording(recording));
    } catch (error) {
        console.error('Error getting recordings', error);
        throw error;
    }
}

export const startRecording = async (participationId: number): Promise<Recording> => {
    try {
        const response = await axios.post(`/recordings?participationId=${participationId}`);
        return new Recording(response.data);
    } catch (error) {
        console.error('Error starting recording', error);
        throw error;
    }
}

export const stopRecording = async (participationId: number): Promise<Recording> => {
    try {
        const response = await axios.post(`/recordings/stop?participationId=${participationId}`);
        return new Recording(response.data);
    } catch (error) {
        console.error('Error stopping recording', error);
        throw error;
    }
}