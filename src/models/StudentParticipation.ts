export interface StudentParticipation {
    id: number;
    examId: string;
    classRoomId: string;
    studentId: string;
    fullName: string;
    email: string;
    startTime: string;
    endTime: string;
    hlsStreamUrl: string;
    status: ConnectionStatus;
    recording: boolean;
}

export enum ConnectionStatus {
    CONNECTED = "CONNECTED",
    DISCONNECTED = "DISCONNECTED",
    CONNECTING = "CONNECTING",
    TERMINATED = "TERMINATED",
}
