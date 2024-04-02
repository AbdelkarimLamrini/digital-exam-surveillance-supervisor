export interface NewExamSessionDto {
    classRoomId: string,
    supervisorName: string;
}

export interface ExamSession {
    id: number,
    classRoomId: string,
    supervisorName: string;
}

export interface ExamSessionDetailDto {
    id: number,
    examId: string,
    examName: string,
    classRoomId: string,
    supervisorName: string;
    startTime: string;
    endTime: string;
}

export class ExamSessionDetail {
    id: number;
    examId: string;
    examName: string;
    classRoomId: string;
    supervisorName: string;
    startTime: Date;
    endTime: Date;

    constructor(dto: ExamSessionDetailDto) {
        this.id = dto.id;
        this.examId = dto.examId;
        this.examName = dto.examName;
        this.classRoomId = dto.classRoomId;
        this.supervisorName = dto.supervisorName;
        this.startTime = new Date(dto.startTime);
        this.endTime = new Date(dto.endTime);
    }
}