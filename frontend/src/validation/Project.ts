import { ProjectCreate } from "./../interfaces/Project";

export function validateProjectCreateForm(formData: ProjectCreate): { errors: { [key: string]: string }, isValid: boolean } {
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

    if (formData.customer !== null && (formData.customer.length < 3 || formData.customer.length > 100)) {
        errors.customer = "Customer name must be between 3 and 100 characters";
    }

    return { errors, isValid: Object.keys(errors).length === 0 };
}

export function validateProjectUpdateForm(formData: ProjectCreate): { errors: { [key: string]: string }, isValid: boolean } {
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

    if (formData.customer !== null && (formData.customer.length < 3 || formData.customer.length > 100)) {
        errors.customer = "Customer name must be between 3 and 100 characters";
    }

    return { errors, isValid: Object.keys(errors).length === 0 };
}