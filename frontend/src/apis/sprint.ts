import { Sprint, SprintCreate, SprintUpdate } from "../interfaces/Sprint";

export const CreateSprint = async (token: string | null | undefined, project_id: string | number, formData: SprintCreate): Promise<Sprint> => {
    const response = await fetch(`http://localhost:8000/sprint/?project_id=${project_id}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(formData),
    })

    if (!response.ok) {
      throw new Error("Create sprint failed");
    }

    return await response.json();
}

export const UpdateSprint = async (token: string | null | undefined, sprint_id: string | number, formData: SprintUpdate): Promise<Sprint> => {
    const response = await fetch(`http://localhost:8000/sprint/${sprint_id}/update`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        name: formData.name,
        description: formData.description,
        date_started: formData.date_started,
        date_finished: formData.date_finished,
      })
    });

    if (!response.ok) {
      console.error("Error updating sprint:", response);
      throw new Error("Failed to update sprint");
    }

    return await response.json();
}

export const GetSprint = async (token: string | null | undefined, sprint_id: string | number): Promise<Sprint> => {
    const response = await fetch(`http://localhost:8000/sprint/${sprint_id}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error("Failed to fetch sprint data");
    }

    return await response.json();
}

export const DeleteSprint = async (token: string | null | undefined, sprint_id: string | number): Promise<void> => {
    const response = await fetch(`http://localhost:8000/sprint/${sprint_id}/delete`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
    
    if (!response.ok) {
      throw new Error("Failed to delete sprint");
    }
}