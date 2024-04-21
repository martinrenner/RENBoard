import { ChangeEvent, useEffect, useState, useContext } from "react";
import { Alert, Button, Form, FormControl, Modal } from "react-bootstrap";
import TokenContext from "../../../context/TokenContext";
import { Priority } from "../../../interfaces/Priority";
import { Task, TaskUpdate } from "../../../interfaces/Task";
import { GetPriorities } from "../../../apis/priority";
import { GetTask, UpdateTask } from "../../../apis/task";
import { validateTaskUpdateForm } from "../../../validation/Task";



function EditTaskForm(props: IdModalProps) {
  const task_id: number  = props.id;
  const { token, isTokenValid } = useContext(TokenContext);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [ priorities, setPriorities ] = useState<Priority[]>([]);
  
  const [formData, setFormData] = useState<TaskUpdate>({
    name: "",
    description: "",
    priority_id: 1,
  });

  useEffect(() => {
    if (isTokenValid()) {
      const fetchData = async () => {
        try {
          if (task_id) {
            const response = await GetTask(token, task_id);
            setFormData(
              {
                name: response.name,
                description: response.description,
                priority_id: response.priority.id,
              }
            );
          }
          else 
            throw new Error("Task ID not found");
        } catch (error) {
          console.error("Error fetching task data:", error);
        }
        try {
            const result = await GetPriorities(token);
            setPriorities(result);
        } catch (error) {
            console.error("Error fetching tags data:", error);
        } 
      };

      fetchData();
    }
  }, [task_id, isTokenValid, token, props.show]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const { errors, isValid } = validateTaskUpdateForm(formData);
    setErrors(errors);

    if (isValid) {
    try {
        if (task_id) {
            const result = await UpdateTask(token, task_id, formData);
            props.setData({
                ...props.data,
                tasks: props.data.tasks.map((task: Task) => task.id === task_id ? result : task)
              });
            props.onHide();
        } else {
            throw new Error("Task ID not found");
        }
    }
      catch (error) {
        setErrorMessage("Update task failed");
        console.error("Error:", error);
      }
    }
  };

  const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData({...formData, [name]: value});
  };

  return (
    <>
      <Modal show={props.show} onHide={props.onHide}>
        <Modal.Header closeButton></Modal.Header>
        <Modal.Body>
          <h1>Edit Task</h1>
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
                <Form.Label>Tag</Form.Label>
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
              Update
            </Button>
          </Form>
        </Modal.Body>
      </Modal>
    </>
  );
}

export default EditTaskForm;

