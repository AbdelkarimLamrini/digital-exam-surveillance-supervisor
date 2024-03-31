import axios from "axios";

export const getExamDetails = async (examId: string, sessionId: string | undefined) => {
    if (!examId) {
        console.error('No examId provided for getExamDetails');
        return;
    }
    const url = sessionId ? `/exam/${examId}/session/${sessionId}` : `/exam/${examId}`;
    try {
        const response = await axios.get(url, {
            headers: {
                'Content-Type': 'application/json'
            }
        });
        return response.data;
    } catch (error) {
        console.error('Error getting exam details', error);
        throw error;
    }
};
