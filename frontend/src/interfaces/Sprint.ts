import { Status } from "./Status";

export interface Sprint {
    id: number;
    name: string;
    description: string;
    date_started: string;
    date_finished: string;
    statuses: Status[];
}