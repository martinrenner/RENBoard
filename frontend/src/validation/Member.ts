import { AddMember } from "../interfaces/ProjectMember";

export function validateAddMemberForm(formData: AddMember): { errors: { [key: string]: string }, isValid: boolean } {
    const errors: { [key: string]: string } = {};

    // Validate username
    if (!formData.username) {
        errors.username = "Username is required";
      } else if (formData.username.length < 3 || formData.username.length > 100) {
        errors.username = "Username must be between 3 and 100 characters";
      }

    return { errors, isValid: Object.keys(errors).length === 0 };
}