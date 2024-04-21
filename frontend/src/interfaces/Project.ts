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