import { Priority } from "./Priority";

export interface Task {
    id: number;
    name: string;
    description: string;
    date_created: string;
    date_finished: string | null;
    priority: Priority;
}

export interface TaskCreate {
    name: string;
    description: string;
    priority_id: number;
}

export interface TaskUpdate {
    name: string;
    description: string;
    priority_id: number;
}