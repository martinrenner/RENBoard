import { LoginResponse, LoginUser } from "./../interfaces/Auth";

export const loginUser = async (formData: LoginUser): Promise<LoginResponse> => {
  const response = await fetch("http://localhost:8000/auth/token", {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: new URLSearchParams({
      username: formData.username,
      password: formData.password,
    }),
  });

  if (!response.ok) {
    throw new Error("Login Failed");
  }
  return await response.json();
}