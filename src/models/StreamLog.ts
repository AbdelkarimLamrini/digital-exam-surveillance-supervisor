import {ConnectionStatus} from "./StudentParticipation";

export interface StreamLogDto {
    participationId: number;
    timestamp: string;
    status: string;
}

export class StreamLog {
    participationId: number;
    timestamp: Date;
    status: ConnectionStatus;

    constructor({participationId, timestamp, status}: StreamLogDto) {
        this.participationId = +participationId;
        this.timestamp = new Date(timestamp);
        this.status = status as ConnectionStatus;
    }
}
