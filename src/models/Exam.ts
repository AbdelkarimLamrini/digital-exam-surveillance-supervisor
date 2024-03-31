export interface NewExamDto {
    id: string,
    name: string;
    creatorName: string;
    startTime: string;
    endTime: string;
}

export interface ExamDto {
    id: string,
    name: string;
    creatorName: string;
    creationTime: string;
    startTime: string;
    endTime: string;
}

export class Exam {
    id: string;
    name: string;
    creatorName: string;
    creationTime: Date;
    startTime: Date;
    endTime: Date;

    constructor({id, name, creatorName, creationTime, startTime, endTime}: ExamDto) {
        this.id = id;
        this.name = name;
        this.creatorName = creatorName;
        this.creationTime = new Date(creationTime);
        this.startTime = new Date(startTime);
        this.endTime = new Date(endTime);
    }
}

