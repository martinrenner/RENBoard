import { Priority } from "../interfaces/Priority";

export const GetPriorities = async (token: string | null | undefined): Promise<Priority[]> => {
    const response = await fetch("http://localhost:8000/priority/", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error("Failed to fetch priority data");
    }

    return await response.json();
}
