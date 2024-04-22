import { useEffect, useState, useContext } from "react";
import { Badge, Col, Modal } from "react-bootstrap";
import TokenContext from "../../../context/TokenContext";
import { GetTask } from "../../../apis/task";
import { Task } from "../../../interfaces/Task";


function ViewTask(props: ModalProps) {
  const task_id = props.id;
  const { token, isTokenValid } = useContext(TokenContext);
  const [task, setTask] = useState<Task>({} as Task);

  useEffect(() => {
    if (isTokenValid()) {
      const fetchData = async () => {
        try {
          if (task_id) {
            const response = await GetTask(token, task_id);
            setTask(response);
          }
          else 
            throw new Error("Task ID not found");
        } catch (error) {
          console.error("Error fetching task data:", error);
        }
      };

      fetchData();
    }
  }, [task_id, isTokenValid, token, props.show]);

  return (
    <>
      <Modal show={props.show} onHide={props.onHide}>
        <Modal.Header closeButton></Modal.Header>
        <Modal.Body>
            <h1>Task</h1>
            <Badge pill bg={task.priority?.color}>{task.priority?.name}</Badge>
            <Col className="mt-3">
                <p><strong>Name:</strong> {task?.name}</p>
                <p><strong>Description:</strong> {task?.description}</p>
            </Col>
        </Modal.Body>
      </Modal>
    </>
  );
}

export default ViewTask;

