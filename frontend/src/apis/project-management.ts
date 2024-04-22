import { Member, ProjectMember } from "../interfaces/ProjectMember";

export const MyProjects = async (token: string | null | undefined): Promise<ProjectMember[]> => {
    const response = await fetch(`http://localhost:8000/project-management/projects`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      }
    })

    if (!response.ok) {
      throw new Error("Failed to fetch all groups that user is member");
    }

    return await response.json();
}

export const InviteDecision = async (token: string | null | undefined, projectId: number, decision: boolean): Promise<void> => {
    const response = await fetch(`http://localhost:8000/project-management/${projectId}/decision?decision=${decision}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({decision})
    })

    if (!response.ok) {
      throw new Error("Failed to make decision on invite");
    }
}

export const LeaveProject = async (token: string | null | undefined, projectId: number): Promise<void> => {
    const response = await fetch(`http://localhost:8000/project-management/${projectId}/leave`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      }
    })

    if (!response.ok) {
      throw new Error("Failed to leave project");
    }
}

export const GetProjectMembers = async (token: string | null | undefined, projectId: number | string): Promise<Member[]> => {
    const response = await fetch(`http://localhost:8000/project-management/${projectId}/members`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      }
    })

    if (!response.ok) {
      throw new Error("Failed to fetch project members");
    }

    return await response.json();
}

export const InviteMember = async (token: string | null | undefined, projectId: number | string, username: string): Promise<Member> => {
    const response = await fetch(`http://localhost:8000/project-management/${projectId}/add-member?member=${username}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      }
    })

    if (!response.ok) {
      throw new Error("Failed to invite member");
    }

    return await response.json();
}

export const RemoveMember = async (token: string | null | undefined, projectId: number | string, username: string): Promise<void> => {
    const response = await fetch(`http://localhost:8000/project-management/${projectId}/remove-member?member=${username}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      }
    })

    if (!response.ok) {
      throw new Error("Failed to remove member");
    }
}