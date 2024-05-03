import { TaskCreate, TaskUpdate } from "../interfaces/Task";

export function validateTaskCreateForm(formData: TaskCreate): { errors: { [key: string]: string }, isValid: boolean } {
    const errors: { [key: string]: string } = {};

    // Validate name
    if (!formData.name) {
        errors.name = "Name is required";
    } else if (formData.name.length < 3 || formData.name.length > 100) {
        errors.name = "Name must be between 3 and 100 characters";
    }

    // Validate description
    if (!formData.description) {
        errors.description = "Description is required";
    } else if (formData.description.length < 3 || formData.description.length > 1000) {
        errors.description = "Description must be between 3 and 1000 characters";
    }

    // Validate priority_id
    if (!formData.priority_id) {
        errors.priority_id = "Priority is required";
    } else if (formData.priority_id < 1) {
        errors.priority_id = "Priority must be 1 or greater";
    }

    return { errors, isValid: Object.keys(errors).length === 0 };
}

export function validateTaskUpdateForm(formData: TaskUpdate): { errors: { [key: string]: string }, isValid: boolean } {
    const errors: { [key: string]: string } = {};

    // Validate name
    if (!formData.name) {
        errors.name = "Name is required";
    } else if (formData.name.length < 3 || formData.name.length > 100) {
        errors.name = "Name must be between 3 and 100 characters";
    }

    // Validate description
    if (!formData.description) {
        errors.description = "Description is required";
    } else if (formData.description.length < 3 || formData.description.length > 1000) {
        errors.description = "Description must be between 3 and 1000 characters";
    }

    // Validate priority_id
    if (!formData.priority_id) {
        errors.priority_id = "Priority is required";
    } else if (formData.priority_id < 1) {
        errors.priority_id = "Priority must be 1 or greater";
    }

    return { errors, isValid: Object.keys(errors).length === 0 };
}