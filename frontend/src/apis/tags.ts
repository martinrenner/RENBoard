import { Tag } from "../interfaces/Tag";

export const GetTags = async (token: string | null | undefined): Promise<Tag[]> => {
    const response = await fetch("http://localhost:8000/tag/", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error("Failed to fetch tag data");
    }

    return await response.json();
}
