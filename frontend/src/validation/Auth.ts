import { LoginUser } from "../interfaces/Auth";

export function validateLoginForm(formData: LoginUser): { errors: { [key: string]: string }, isValid: boolean } {
    const errors: { [key: string]: string } = {};

    if (!formData.username) {
        errors.username = "Username or Email is required";
    } else if (formData.username.length < 3 || formData.username.length > 100) {
        errors.username = "Username or Email must be between 3 and 100 characters";
    }
  
    // Validate password
    if (!formData.password) {
        errors.password = "Password is required";
    } else if (formData.password.length < 3 || formData.password.length > 100) {
        errors.password = "Password must be between 3 and 100 characters";
    }
    
    return { errors, isValid: Object.keys(errors).length === 0 };
}