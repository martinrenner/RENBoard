import { ProgressTask } from "./Progress";
import { Status, StatusCreate } from "./Status";

export interface Sprint {
    id: number;
    name: string;
    description: string;
    date_started: string;
    date_finished: string;
    statuses: Status[];
}

export interface SprintCreate {
    name: string;
    description: string;
    date_started: string;
    date_finished: string;
    task_ids: number[];
    statuses: StatusCreate[];
}

export interface SprintUpdate {
    name: string;
    description: string;
    date_started: string;
    date_finished: string;
}

export interface TaskSprintCreate {
    task_id: number;
}

export interface SprintChart {
    id: number;
    name: string;
    date_started: string;
    date_finished: string;
    total_tasks_count: number;
    total_tasks_finished_count: number;
    total_tasks_unfinished_count: number;
    daily_progress: ProgressTask[];
}