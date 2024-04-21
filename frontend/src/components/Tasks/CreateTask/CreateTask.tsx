import { useState, useContext, useEffect } from "react";
import { Alert, Button, Form, FormControl, Modal } from "react-bootstrap";
import TokenContext from "../../../context/TokenContext";
import { TaskCreate } from "../../../interfaces/Task";
import { GetPriorities } from "../../../apis/priority";
import { Priority } from "../../../interfaces/Priority";
import { validateTaskCreateForm } from "../../../validation/Task";
import { CreateTask } from "../../../apis/task";


function CreateTaskForm(props: IdModalProps) {
  const [formData, setFormData] = useState<TaskCreate>({} as TaskCreate);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [errorMessage, setErrorMessage] = useState<string>("");
  const { token, isTokenValid } = useContext(TokenContext);
  const [ priorities, setPriorities ] = useState<Priority[]>([]);

  useEffect(() => {
    setFormData({
        name: "",
        description: "",
        priority_id: 1,
      });
    if (isTokenValid()) {
      const fetchData = async () => {
        try {
          const result = await GetPriorities(token);
          setPriorities(result);
        } catch (error) {
          console.error("Error fetching priority data:", error);
        }
      };
  
      fetchData();
    }
  }, [props.show]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const { errors, isValid } = validateTaskCreateForm(formData);
    setErrors(errors);

    if (isValid) {
      try {
        const result = await CreateTask(token, props.id, formData);
        props.setData({...props.data, tasks: [...props.data.tasks, result]});
        props.onHide();
      } catch (error) {
        setErrorMessage("Create task failed");
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
          <h1>Create Task</h1>
          {errorMessage && <Alert key="danger" variant="danger">{errorMessage}</Alert>}
          <Form onSubmit={handleSubmit}>
            <Form.Group>
              <Form.Label>Task Name</Form.Label>
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
              <Form.Label>Priority</Form.Label>
              <Form.Select
                name="priority_id"
                value={formData.priority_id}
                onChange={handleInputChange}
              >
                {priorities.map((priority) => (
                  <option key={priority.id} value={priority.id}>{priority.name}</option>
                ))}
              </Form.Select>
              {errors.priority_id && <div className="text-danger">{errors.priority_id}</div>}
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

export default CreateTaskForm;
