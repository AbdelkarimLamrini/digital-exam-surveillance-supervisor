import {StudentParticipation} from "./StudentParticipation";

class Recording {
    id: number | null;
    studentParticipation: StudentParticipation;
    startTime: Date; 
    endTime: Date;
    recordingUrl: string;

    constructor(
        studentParticipation: StudentParticipation,
        startTime: Date,
        endTime: Date,
        recordingUrl: string
    ) {
        this.id = null; 
        this.studentParticipation = studentParticipation; 
        this.startTime = startTime;
        this.endTime = endTime; 
        this.recordingUrl = recordingUrl; 
    }
}

