import { ProgressSprint } from "./Progress";
import { Sprint } from "./Sprint";
import { Tag } from "./Tag";
import { Task } from "./Task";

export interface Project {
   id: number;
   name: string;
   description: string;
   customer: string | null;
   tag: Tag;
   created_at: string;
   owner_id: number;
   tasks: Task[];
   sprints: Sprint[];
}

export interface ProjectCreate {
   name: string;
   description: string;
   customer: string | null;
   tag_id: number;
}

export interface ProjectUpdate {
   name: string;
   description: string;
   customer: string | null;
   tag_id: number;
}

export interface ProjectChart {
   id: number;
   name: string;
   total_sprints_count: number;
   total_sprints_finished_count: number;
   total_sprints_unfinished_count: number;
   sprints_progress: ProgressSprint[];
}