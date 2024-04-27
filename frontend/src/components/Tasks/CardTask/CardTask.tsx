import { Badge, Button, Card } from "react-bootstrap";
import { Task } from "../../../interfaces/Task";
import { PencilSquare, Trash, XLg } from "react-bootstrap-icons";
import { Sprint } from "../../../interfaces/Sprint";
import { useContext, useState } from "react";
import TokenContext from "../../../context/TokenContext";
import { DeassignTask, DeleteTask } from "../../../apis/task";
import EditTaskForm from "../EditTask/EditTask";
import ViewTask from "../ViewTask/ViewTask";
import { useDraggable } from "@dnd-kit/core";

interface Transform {
  x: number;
  y: number;
}

interface CardTaskProps {
  task: Task;
  sprint: Sprint;
  setSprint: React.Dispatch<React.SetStateAction<Sprint>>;
}

function CardTask(props: CardTaskProps) {
    const { task, sprint, setSprint } = props;
    const { token } = useContext(TokenContext);
    const [showEditTaskForm, setShowEditTaskForm] = useState<boolean>(false);
    const [showViewTask, setShowViewTask] = useState<boolean>(false);
    const [selectedTaskId, setSelectedTaskId] = useState<number>({} as number);
    const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({id: task.id, data: task});

    const updateShownSprintTasks = (updatedInstance: Task) => {
        setSprint(
          {
            ...sprint,
            statuses: sprint?.statuses.map((status) => 
              {
                return {
                  ...status,
                  tasks: status.tasks.map((task) => 
                    task.id === updatedInstance.id ? updatedInstance : task
                  )
                }
              }
            )
          }
        )
      }

    const delete_task = async (task_id: number) => {
        try {
          await DeleteTask(token, task_id);
          setSprint(
            {
              ...sprint,
              statuses: sprint?.statuses.map((status) => 
                {
                  return {
                    ...status,
                    tasks: status.tasks.filter((task) => task.id !== task_id)
                  }
                }
              )
            }
          )
        } catch (error) {
          console.error("Error deleting task:", error);
        }
    }

    const deassign_task = async (task_id: number) => {
      try {
        await DeassignTask(token, task_id);
        setSprint(
          {
            ...sprint,
            statuses: sprint?.statuses.map((status) => 
              {
                return {
                  ...status,
                  tasks: status.tasks.filter((task) => task.id !== task_id)
                }
              }
            )
          }
        )
      } catch (error) {
        console.error("Error deassigning task:", error);
      }
  }

    const customTransform = (transform: Transform | null) => {
        const {x, y} = transform ?? {x: 0, y: 0};
        return `translateX(${x}px) translateY(${y}px)`
    }

    return (
        <>
            <Card ref={setNodeRef} {...attributes} {...listeners} style={{transform: customTransform(transform), zIndex: isDragging ? 10 : 1}} key={task.id} className="flex-grow-1 d-flex flex-column">
                <Card.Body className="d-flex flex-column">
                    <Card.Title>
                        <h3>{task.name}</h3>
                    </Card.Title>
                    <Card.Subtitle className="mb-2 text-muted">
                        <Badge pill bg={task.priority.color}>{task.priority.name}</Badge>
                    </Card.Subtitle>
                    <Card.Text>
                        <Button data-no-dnd="true" variant="primary" onClick={() => {setShowViewTask(true); setSelectedTaskId(task.id);}}>Open</Button>{' '}
                        <Button variant="primary" onClick={() => {setShowEditTaskForm(true); setSelectedTaskId(task.id);}}><PencilSquare/></Button>{' '}
                        <Button variant="primary" onClick={() => delete_task(task.id)}><Trash/></Button>{' '}
                        <Button variant="primary" onClick={() => {deassign_task(task.id)}}><XLg/></Button>
                    </Card.Text>
                </Card.Body>
            </Card>
            {
                showEditTaskForm && (
                    <EditTaskForm show={showEditTaskForm} onHide={() => {setShowEditTaskForm(false)}} id={selectedTaskId} updateData={updateShownSprintTasks}/>
                )
            }
            {
                showViewTask && (
                    <ViewTask show={showViewTask} onHide={() => setShowViewTask(false)} id={selectedTaskId} updateData={() => {}}/>
                )
            }
        </>
    );
}

export default CardTask;