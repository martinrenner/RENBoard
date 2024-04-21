import { useState, useContext, useEffect } from "react";
import { Alert, Button, Form, Modal } from "react-bootstrap";
import TokenContext from "../../../context/TokenContext";
import { TaskSprintCreate } from "../../../interfaces/Sprint";
import { Task } from "../../../interfaces/Task";
import { GetTasks } from "../../../apis/task";
import { validateTaskSprintCreateForm } from "../../../validation/Sprint";
import { AddTaskToSprint } from "../../../apis/sprint";
import { useParams } from "react-router-dom";


function AddTaskSprintForm(props: IdModalProps) {
  const {project_id} = useParams();
  const [formData, setFormData] = useState<TaskSprintCreate>({} as TaskSprintCreate);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [errorMessage, setErrorMessage] = useState<string>("");
  const { token, isTokenValid } = useContext(TokenContext);
  const [ tasks, setTasks ] = useState<Task[]>([]);

  useEffect(() => {
    if (isTokenValid()) {
      const fetchData = async () => {
        try {
          const result = await GetTasks(token, project_id!);
          setTasks(result);
          setFormData({
            task_id: result[0].id,
          });
        } catch (error) {
          console.error("Error fetching tasks data:", error);
        }
      };
  
      fetchData();
    }
  }, [props.show]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const { errors, isValid } = validateTaskSprintCreateForm(formData);
    setErrors(errors);

    console.log(formData);

    if (isValid) {
      try {
        await AddTaskToSprint(token, props.id, formData);
        props.onHide();
      } catch (error) {
        setErrorMessage("Add task to sprint failed");
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
          <h1>Add Task</h1>
          {errorMessage && <Alert key="danger" variant="danger">{errorMessage}</Alert>}
          <Form onSubmit={handleSubmit}>
            <Form.Group>
              <Form.Label>Priority</Form.Label>
              <Form.Select
                name="task_id"
                value={formData.task_id}
                onChange={handleInputChange}
              >
                {tasks.map((task) => (
                  <option key={task.id} value={task.id}>{task.name}</option>
                ))}
              </Form.Select>
              {errors.task_id && <div className="text-danger">{errors.task_id}</div>}
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

export default AddTaskSprintForm;
