export interface ProjectMember {
    id: number;
    name: string;
    is_owner: boolean;
    is_accepted: boolean;
}

export interface Member {
    id: number;
    name: string;
    surname: string;
    email: string;
    is_accepted: boolean;
}