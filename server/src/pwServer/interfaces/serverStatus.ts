export interface ServerStatus {
    id?: string;
    name: string;
    timeZone: number;
    status: boolean;
}

export interface Config {
    id: string;
    content: string;
}