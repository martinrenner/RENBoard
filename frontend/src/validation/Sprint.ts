import { SprintCreate, SprintUpdate } from "../interfaces/Sprint";
import { Task } from "../interfaces/Task";

export function validateSprintCreateForm(formData: SprintCreate, tasks: Task[]): { errors: { [key: string]: string }, isValid: boolean } {
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

    // Validate date_started
    if (!formData.date_started) {
        errors.date_started = "Date started is required";
    } else if (isNaN(Date.parse(formData.date_started))) {
        errors.date_started = "Invalid started date";
    }

    // Validate date_finished
    if (!formData.date_finished) {
        errors.date_finished = "Date finished is required";
    } else if (isNaN(Date.parse(formData.date_finished))) {
        errors.date_finished = "Invalid finish date";
    } else if (Date.parse(formData.date_finished) < Date.parse(formData.date_started)) {
        errors.date_finished = "Finish date must be after start date";
    }

    // Validate task_ids
    formData.task_ids.forEach((id) => {
        if (!tasks.find(task => task.id === Number(id))) {
            errors.task_ids = "Invalid task id";
        }
    });

    // Validate statuses
    if (formData.statuses.length < 2) {
        errors.statuses = "At least 2 statuses are required";
    }
    formData.statuses.forEach((status) => {
        if (!status.name) {
            errors.statuses = "Name is required";
        } else if (status.name.length < 3 || status.name.length > 100) {
            errors.statuses = "Name must be between 3 and 100 characters";
        }
    });

    return { errors, isValid: Object.keys(errors).length === 0 };
}


export function validateSprintUpdateForm(formData: SprintUpdate): { errors: { [key: string]: string }, isValid: boolean } {
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

    // Validate date_started
    if (!formData.date_started) {
        errors.date_started = "Date started is required";
    } else if (isNaN(Date.parse(formData.date_started))) {
        errors.date_started = "Invalid started date";
    }

    // Validate date_finished
    if (!formData.date_finished) {
        errors.date_finished = "Date finished is required";
    } else if (isNaN(Date.parse(formData.date_finished))) {
        errors.date_finished = "Invalid finish date";
    } else if (Date.parse(formData.date_finished) < Date.parse(formData.date_started)) {
        errors.date_finished = "Finish date must be after start date";
    }

    return { errors, isValid: Object.keys(errors).length === 0 };
}