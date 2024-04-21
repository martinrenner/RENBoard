import { Task } from "./Task";

export interface Status {
    id: number;
    name: string;
    task: Task[];
}