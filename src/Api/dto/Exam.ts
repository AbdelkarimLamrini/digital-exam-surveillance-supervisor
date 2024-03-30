
export interface CreateExamDto {
    id: string,
    name: string;
    creatorName: string;
    startTime: string;
    endTime: string;
}
export interface GetAllExamsDto {
    id: string,
    name: string;
    creatorName: string;
    creationTime: string;
    startTime: string;
    endTime: string;
}