export interface RestError {
    status: number;
    error: string;
    message: string;
    fieldErrors:  Record<string, string>
}