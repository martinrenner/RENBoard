import { RegisterUser } from "./../interfaces/User";

export function validateRegisterForm(formData: RegisterUser): { errors: { [key: string]: string }, isValid: boolean } {
    const errors: { [key: string]: string } = {};

    // Validate name
    if (!formData.name) {
        errors.name = "Name is required";
    } else if (formData.name.length < 3 || formData.name.length > 100) {
        errors.name = "Name must be between 3 and 100 characters";
    }

    // Validate surname
    if (!formData.surname) {
        errors.surname = "Surname is required";
    } else if (formData.surname.length < 3 || formData.surname.length > 100) {
        errors.surname = "Surname must be between 3 and 100 characters";
    }

    // Validate username
    if (!formData.username) {
        errors.username = "Username is required";
      } else if (formData.username.length < 3 || formData.username.length > 100) {
        errors.username = "Username must be between 3 and 100 characters";
      }

    // Validate email
    if (!formData.email) {
        errors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
        errors.email = "Invalid email address";
    } else if (formData.email.length < 3 || formData.email.length > 100) {
        errors.email = "Email must be between 3 and 100 characters";
    }

    // Validate password
    if (!formData.password) {
        errors.password = "Password is required";
    } else if (formData.password.length < 3 || formData.password.length > 100) {
        errors.password = "Password must be between 3 and 100 characters";
    }

    // Validate password confirmation
    if (!formData.password_confirmation) {
        errors.password_confirmation = "Password confirmation is required";
    } else if (formData.password !== formData.password_confirmation) {
        errors.password_confirmation = "Password and password confirmation must match";
    }

    return { errors, isValid: Object.keys(errors).length === 0 };
}