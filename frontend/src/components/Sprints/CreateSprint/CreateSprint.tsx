import { useState, useContext, useEffect } from "react";
import { Alert, Button, Col, Form, FormControl, Modal, Row, Table } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import TokenContext from "../../../context/TokenContext";
import { SprintCreate } from "../../../interfaces/Sprint";
import { validateSprintCreateForm } from "../../../validation/Sprint";
import { CreateSprint } from "../../../apis/sprint";
import { Task } from "../../../interfaces/Task";
import { GetTasks } from "../../../apis/task";
import { Trash } from "react-bootstrap-icons";


function CreateSprintForm(props: ModalProps) {
    const project_id = props.id;
    const [inputStatus, setInputStatus] = useState("");
    const [formData, setFormData] = useState<SprintCreate>({
        name: "",
        description: "",
        date_started: "",
        date_finished: "",
        task_ids: [],
        statuses: [],
    });
    const navigate = useNavigate();
    const [errors, setErrors] = useState<{ [key: string]: string }>({});
    const [errorMessage, setErrorMessage] = useState<string>("");
    const { token, isTokenValid } = useContext(TokenContext);
    const [ tasks, setTasks ] = useState<Task[]>([]);

    useEffect(() => {
        if (isTokenValid()) {
            const fetchData = async () => {
                try {
                    if (project_id) {
                        const result = await GetTasks(token, project_id);
                        setTasks(result);
                    }
                    else
                        throw new Error("Project ID not found");
                } catch (error) {
                    console.error("Error fetching tasks data:", error);
                }
            };
        
            fetchData();
        }
    }, [props.show]);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        const { errors, isValid } = validateSprintCreateForm(formData, tasks);
        setErrors(errors);

        if (isValid && project_id) {
          try {
            const result = await CreateSprint(token, project_id, formData);
            props.updateData(result);
            // navigate(`/projects/${project_id}/sprint/${result.id}`);
            props.onHide();
          } catch (error) {
            setErrorMessage("Create sprint failed");
            console.error("Error:", error);
          }
        }
    };

    const handleStatusAdd = () => {
        if (inputStatus) {
            setFormData(prevState => ({ ...prevState, statuses: [...prevState.statuses, { name: inputStatus }] }));
            setInputStatus("");
        }
    }

    const handleStatusRemove = (index: number) => {
        setFormData(prevState => {
            const newStatuses = [...prevState.statuses];
            newStatuses.splice(index, 1);
            return { ...prevState, statuses: newStatuses };
        });
    }

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name } = e.target;
    let value: string[] | string;

    if (e.target instanceof HTMLSelectElement && e.target.multiple) {
        value = Array.from(e.target.selectedOptions, option => option.value);
    } else {
        value = e.target.value;
    }

    setFormData(prevState => ({ ...prevState, [name]: value }));
    };

    return (
        <>
        <Modal show={props.show} onHide={props.onHide}>
            <Modal.Header closeButton></Modal.Header>
            <Modal.Body>
            <h1>Create Sprint</h1>
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
                <Form.Group>
                    <Form.Label>Tasks</Form.Label>
                    <Form.Select
                        name="task_ids"
                        onChange={handleInputChange}
                        value={formData.task_ids?.map(String)}
                        multiple
                    >
                        {tasks.map((task) => (
                            <option key={task.id} value={task.id}>{task.name}</option>
                        ))}
                    </Form.Select>
                    {errors.task_ids && <div className="text-danger">{errors.task_ids}</div>}
                </Form.Group>
                <Form.Group>
                    <Row>
                        <Col sm={10}>
                            <Form.Label>Statuses</Form.Label>
                            <Form.Control type="text" value={inputStatus} onChange={(e) => setInputStatus(e.target.value)} />
                        </Col>
                        <Col sm={2} className="align-self-end">
                            <Button onClick={handleStatusAdd}>Add</Button>
                        </Col>
                        {errors.statuses && <div className="text-danger">{errors.statuses}</div>}
                    </Row>
                    <Table striped bordered hover className="mt-2">
                        <thead>
                            <tr>
                                <th>Status</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                        {formData.statuses?.map((status, index) => (
                            <tr key={index}>
                                <td>
                                    {status.name}
                                </td>
                                <td>
                                    <Button variant="danger" onClick={() => handleStatusRemove(index)}><Trash /></Button>
                                </td>
                            </tr>
                        ))}
                        </tbody>
                    </Table>
                </Form.Group>
                <Button variant="primary" type="submit" className="mt-3">
                    Create
                </Button>
            </Form>
            </Modal.Body>
        </Modal>
        </>
    );
}

export default CreateSprintForm;
