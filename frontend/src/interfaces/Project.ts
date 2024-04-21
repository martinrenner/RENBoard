import { Tag } from "./Tag";

export interface Project {
   id: number;
   name: string;
   description: string;
   customer: string | null;
   tag: Tag;
   created_at: string;
   owner_id: number;
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