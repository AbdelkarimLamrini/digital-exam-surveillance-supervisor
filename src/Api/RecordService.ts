import axios from "axios";

export const startRecording = async (id: string) => {
    try {
        const response = await axios.post(`/recording?participationId=${id}`, {}, {
            headers: {
                'Content-Type': 'application/json'
            }
        });
        return response.data;
    } catch (error) {
        console.error('Error starting recording', error);
        throw error;
    }
}

export const stopRecording = async (id: string) => {
    try {
        const response = await axios.post(`/recording/stop?participationId=${id}`, {}, {
            headers: {
                'Content-Type': 'application/json'
            }
        });
        return response.data;
    } catch (error) {
        console.error('Error stopping recording', error);
        throw error;
    }
}