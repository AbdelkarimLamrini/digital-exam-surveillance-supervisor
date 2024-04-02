export interface StudentParticipationDto {
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

export class StudentParticipation {
    id: number;
    examId: string;
    classRoomId: string;
    studentId: string;
    fullName: string;
    email: string;
    startTime: Date;
    endTime: Date;
    hlsStreamUrl: string;
    status: ConnectionStatus;
    recording: boolean;

    constructor({id, examId, classRoomId, studentId, fullName, email, startTime, endTime, hlsStreamUrl, status, recording}: StudentParticipationDto) {
        this.id = id;
        this.examId = examId;
        this.classRoomId = classRoomId;
        this.studentId = studentId;
        this.fullName = fullName;
        this.email = email;
        this.startTime = new Date(startTime);
        this.endTime = new Date(endTime);
        this.hlsStreamUrl = hlsStreamUrl;
        this.status = status;
        this.recording = recording;
    }
}

export enum ConnectionStatus {
    CONNECTED = "CONNECTED",
    DISCONNECTED = "DISCONNECTED",
    CONNECTING = "CONNECTING",
    TERMINATED = "TERMINATED",
}
