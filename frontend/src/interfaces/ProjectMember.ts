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
    username: string;
    email: string;
    is_owner: boolean;
    is_accepted: boolean;
}

export interface AddMember {
    username: string;
}