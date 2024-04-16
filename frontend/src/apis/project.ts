import { Project, ProjectCreate, ProjectUpdate } from "../interfaces/Project";

export const CreateProject = async (token: string | null | undefined, formData: ProjectCreate): Promise<Project> => {
    const response = await fetch(`http://localhost:8000/project`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(formData),
    })

    if (!response.ok) {
      throw new Error("Create project failed");
    }

    return await response.json();
}

export const UpdateProject = async (token: string | null | undefined, project_id: string | number, formData: ProjectUpdate): Promise<Project> => {
    const response = await fetch(`http://localhost:8000/project/${project_id}/update`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        name: formData.name,
        description: formData.description,
        customer: formData.customer,
      })
    });

    if (!response.ok) {
      console.error("Error updating project:", response);
      throw new Error("Failed to update project");
    }

    return await response.json();
}

export const GetProjects = async (token: string | null | undefined): Promise<Project[]> => {
    const response = await fetch("http://localhost:8000/project/", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error("Failed to fetch projects data");
    }

    return await response.json();
}

export const GetProject = async (token: string | null | undefined, project_id: string | number): Promise<Project> => {
    const response = await fetch(`http://localhost:8000/project/${project_id}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error("Failed to fetch project data");
    }

    return await response.json();
}

export const DeleteProject = async (token: string | null | undefined, project_id: string | number): Promise<void> => {
    const response = await fetch(`http://localhost:8000/project/${project_id}/delete`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
    
    if (!response.ok) {
      throw new Error("Failed to delete project");
    }
}