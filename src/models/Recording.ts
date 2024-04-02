export interface RecordingDto {
    id: number;
    studentParticipationId: number;
    studentId: string;
    recordingUrl: string;
    startTime: string;
    endTime: string;

}
export class Recording {
    id: number;
    participationId: number;
    studentId: string;
    url: string;
    startTime: Date;
    endTime: Date | null;

    constructor({id, studentParticipationId, studentId, recordingUrl, startTime, endTime}: RecordingDto) {
        this.id = id;
        this.participationId = studentParticipationId;
        this.studentId = studentId;
        this.url = recordingUrl;
        this.startTime = new Date(startTime);
        this.endTime = endTime && new Date(endTime) || null;
    }
}

