export interface ProgressTask {
    date: string;
    tasks_remaining: number | null;
}

export interface ProgressSprint {
    id: number;
    name: string;
    is_finished: boolean;
    tasks_finished_count: number;
    tasks_unfinished_count: number;
}