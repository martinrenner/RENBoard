import { Task, TaskCreate, TaskUpdate } from "../interfaces/Task";


export const CreateTask = async (token: string | null | undefined, project_id: number | string, formData: TaskCreate): Promise<Task> => {
    const response = await fetch(`http://localhost:8000/task?project_id=${project_id}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(formData),
    })

    if (!response.ok) {
      throw new Error("Create task failed");
    }

    return await response.json();
}

export const UpdateTask = async (token: string | null | undefined, task_id: string | number, formData: TaskUpdate): Promise<Task> => {
    const response = await fetch(`http://localhost:8000/task/${task_id}/update`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        name: formData.name,
        description: formData.description,
        priority_id: formData.priority_id,
      })
    });

    if (!response.ok) {
      console.error("Error updating project:", response);
      throw new Error("Failed to update project");
    }

    return await response.json();
}

export const GetTasks = async (token: string | null | undefined, project_id: string | number): Promise<Task[]> => {
    const response = await fetch(`http://localhost:8000/task?project_id=${project_id}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error("Failed to fetch task data");
    }

    return await response.json();
}

export const GetTask = async (token: string | null | undefined, task_id: string | number): Promise<Task> => {
    const response = await fetch(`http://localhost:8000/task/${task_id}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error("Failed to fetch task data");
    }

    return await response.json();
}

export const DeleteTask = async (token: string | null | undefined, task_id: string | number): Promise<void> => {
    const response = await fetch(`http://localhost:8000/task/${task_id}/delete`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
    
    if (!response.ok) {
      throw new Error("Failed to delete task");
    }
}

export const AssingTask = async (token: string | null | undefined, task_id: string | number, status_id: string | number): Promise<void> => {
    const response = await fetch(`http://localhost:8000/task/${task_id}/assign?status_id=${status_id}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      }
    });

    if (!response.ok) {
      throw new Error("Failed to assign task");
    }
}