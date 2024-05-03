import { RegisterUser } from "./../interfaces/User";

export const registerUser = async (formData: RegisterUser): Promise<void> => {
  const response = await fetch("http://localhost:8000/user", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(formData),
  });

  if (!response.ok) {
    throw new Error("Registration Failed");
  }
}