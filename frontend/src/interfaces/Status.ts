import { Task } from "./Task";

export interface Status {
    id: number;
    name: string;
    tasks: Task[];
}

export interface StatusCreate {
    name: string;
}