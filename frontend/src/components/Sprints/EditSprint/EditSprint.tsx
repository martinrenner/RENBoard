import { useState, useContext, useEffect } from "react";
import { Alert, Button, Form, FormControl, Modal } from "react-bootstrap";
import TokenContext from "../../../context/TokenContext";
import { SprintUpdate } from "../../../interfaces/Sprint";
import { validateSprintUpdateForm } from "../../../validation/Sprint";
import { GetSprint, UpdateSprint } from "../../../apis/sprint";


function EditSprintForm(props: ModalProps) {
    const sprint_id = props.id;
    const [formData, setFormData] = useState<SprintUpdate>({
        name: "",
        description: "",
        date_started: "",
        date_finished: "",
    });
    const [errors, setErrors] = useState<{ [key: string]: string }>({});
    const [errorMessage, setErrorMessage] = useState<string>("");
    const { token, isTokenValid } = useContext(TokenContext);

    useEffect(() => {
        if (isTokenValid()) {
            const fetchData = async () => {
                try {
                    if (sprint_id) {
                        const result = await GetSprint(token, sprint_id);
                        setFormData({
                            name: result.name,
                            description: result.description,
                            date_started: result.date_started,
                            date_finished: result.date_finished,
                        });
                    }
                    else
                        throw new Error("Sprint ID not found");
                } catch (error) {
                    console.error("Error fetching tasks data:", error);
                }
            };
    
            fetchData();
        }
    }, [sprint_id, props.show]);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        const { errors, isValid } = validateSprintUpdateForm(formData);
        setErrors(errors);

        if (isValid && sprint_id) {
          try {
            const response = await UpdateSprint(token, sprint_id, formData);
            props.updateData(response);
            props.onHide();
          } catch (error) {
            setErrorMessage("Update sprint failed");
            console.error("Error:", error);
          }
        }
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData({
          ...formData,
          [name]: value,
        });
    };

    return (
        <>
        <Modal show={props.show} onHide={props.onHide}>
            <Modal.Header closeButton></Modal.Header>
            <Modal.Body>
            <h1>Edit Sprint</h1>
            {errorMessage && <Alert key="danger" variant="danger">{errorMessage}</Alert>}
            <Form onSubmit={handleSubmit}>
                <Form.Group>
                    <Form.Label>Sprint Name</Form.Label>
                    <FormControl
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                    />
                    {errors.name && <div className="text-danger">{errors.name}</div>}
                </Form.Group>
                <Form.Group>
                    <Form.Label>Description</Form.Label>
                    <FormControl
                        as="textarea"
                        name="description"
                        value={formData.description}
                        onChange={handleInputChange}
                    />
                    {errors.description && <div className="text-danger">{errors.description}</div>}
                </Form.Group>
                <Form.Group>
                    <Form.Label>Date Started</Form.Label>
                    <FormControl
                        type="date"
                        name="date_started"
                        value={formData.date_started}
                        onChange={handleInputChange}
                    />
                    {errors.date_started && <div className="text-danger">{errors.date_started}</div>}
                </Form.Group>
                <Form.Group>
                    <Form.Label>Date Finished</Form.Label>
                    <FormControl
                        type="date"
                        name="date_finished"
                        value={formData.date_finished}
                        onChange={handleInputChange}
                    />
                    {errors.date_finished && <div className="text-danger">{errors.date_finished}</div>} 
                </Form.Group>
                <Button variant="primary" type="submit" className="mt-3">
                    Update
                </Button>
            </Form>
            </Modal.Body>
        </Modal>
        </>
    );
}

export default EditSprintForm;
