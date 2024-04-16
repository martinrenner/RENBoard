export interface Project {
   id: number;
   name: string;
   description: string;
   customer: string | null;
}

export interface ProjectCreate {
   name: string;
   description: string;
   customer: string | null;
}

export interface ProjectUpdate {
   name: string;
   description: string;
   customer: string | null;
}