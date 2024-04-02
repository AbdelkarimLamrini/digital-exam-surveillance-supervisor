export interface FraudDetectionDto {
    id: number;
    participationId: number;
    studentId: string;
    timestamp: string;
    fraudScore: number;
}

export class FraudDetection {
    id: number;
    participationId: number;
    studentId: string;
    timestamp: Date;
    fraudScore: number;

    constructor({id, participationId, studentId, timestamp, fraudScore}: FraudDetectionDto) {
        this.id = id;
        this.participationId = participationId;
        this.studentId = studentId;
        this.timestamp = new Date(timestamp);
        this.fraudScore = fraudScore;
    }
}
