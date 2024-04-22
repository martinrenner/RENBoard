import { useContext, useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import TokenContext from "../../../context/TokenContext";
import { DeleteSprint, GetSprint } from "../../../apis/sprint";
import { Sprint } from "../../../interfaces/Sprint";
import { Project } from "../../../interfaces/Project";
import { GetProject } from "../../../apis/project";
import ViewTask from "../../Tasks/ViewTask/ViewTask";
import { Badge, Breadcrumb, Button, Card, Col, Row } from "react-bootstrap";
import { Calendar, PencilSquare, Trash } from "react-bootstrap-icons";
import { DeleteTask } from "../../../apis/task";
import EditTaskForm from "../../Tasks/EditTask/EditTask";
import EditSprintForm from "../EditSprint/EditSprint";
import AddTaskSprint from "../AddTaskSprint/AddTaskSprint";
import { Task } from "../../../interfaces/Task";

function ViewSprint() {
  const navigate = useNavigate();
  const { project_id, sprint_id } = useParams();
  const { token, isTokenValid } = useContext(TokenContext);
  const [ project, setProject ] = useState<Project>();
  const [ sprint, setSprint ] = useState<Sprint>({} as Sprint);
  const [showAddTaskForm, setShowAddTaskForm] = useState<boolean>(false);
  const [showEditTaskForm, setShowEditTaskForm] = useState<boolean>(false);
  const [showEditSprintForm, setShowEditSprintForm] = useState<boolean>(false);
  const [showViewTask, setShowViewTask] = useState<boolean>(false);
  const [selectedTaskId, setSelectedTaskId] = useState<number>({} as number);
  
  useEffect(() => {
    if (isTokenValid()) {
      const fetchData = async () => {
        try {
          if (sprint_id) {
            const response = await GetSprint(token, sprint_id);
            setSprint(response);
          }
          else 
            throw new Error("sprint ID not found");
        } catch (error) {
          console.error("Error fetching sprint data:", error);
        }
        try {
          if (project_id) {
            const response = await GetProject(token, project_id);
            setProject(response);
          }
          else 
            throw new Error("project ID not found");
        } catch (error) {
          console.error("Error fetching project data:", error);
        }
      };

      fetchData();
    }
  }, [token, isTokenValid, project_id, sprint_id]);

  const delete_sprint = async (sprint_id: number) => {
    try {
      await DeleteSprint(token, sprint_id);
      navigate(`/projects/${project_id}`);
    } catch (error) {
      console.error("Error deleting sprint:", error);
    }
  };

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
                task: status.task.filter((task) => task.id !== task_id)
              }
            }
          )
        }
      )
    } catch (error) {
      console.error("Error deleting task:", error);
    }
  }

  const updateShowSprint = (newInstance: any) => {
    setSprint(newInstance);
  }

  const createShowSprintTasks = (newInstance: Task) => {
    setSprint(
      {
        ...sprint,
        statuses: sprint?.statuses.map((status, index) => 
          index === 0 ? {...status, task: [...status.task, newInstance]} : status
        )
      }
    );
  }

  const updateShownSprintTasks = (updatedInstance: Task) => {
    setSprint(
      {
        ...sprint,
        statuses: sprint?.statuses.map((status) => 
          {
            return {
              ...status,
              task: status.task.map((task) => 
                task.id === updatedInstance.id ? updatedInstance : task
              )
            }
          }
        )
      }
    )
  }

  return (
    <>
      {
       project && sprint && (
        <>
        <Row>
          <Breadcrumb>
            <Link to="/projects" className="breadcrumb-item">
              Projects
            </Link>
            <Link to={`/projects/${project.id}`} className="breadcrumb-item">
                {project.name}
            </Link>
            <Breadcrumb.Item active>{sprint.name}</Breadcrumb.Item>
          </Breadcrumb>
        </Row>
        <Row className="mb-4">
          <Col md={8}>
            <h1>{project.name} - {sprint.name}</h1>
          </Col>
          <Col md={4} className="d-flex justify-content-end align-items-center">
            <Button onClick={() => setShowEditSprintForm(true)} variant="primary" size="sm" className="rounded-pill me-2" style={{height: '40px', width: '80px'}}>
              Edit
            </Button>
            <Button onClick={() => delete_sprint(sprint.id)} variant="primary" size="sm" className="rounded-pill" style={{height: '40px', width: '80px'}}>
              Delete
            </Button>
          </Col>
        </Row>
        <Row className="mb-5">
          <Col xs={12}>
            <p>
              <Calendar size={25} className="me-2"/>
              {new Date(sprint.date_started).toLocaleDateString('cs-CZ')} - {new Date(sprint.date_finished).toLocaleDateString('cs-CZ')}
            </p>
            <p>{sprint.description}</p>
          </Col>
        </Row>
        <Row className="mb-3">
          <Col xs={10}>
            <h2>Board</h2>
          </Col>
          <Col xs={2} className="d-flex justify-content-end">
            <Button onClick={() => setShowAddTaskForm(true)} variant="primary" size="lg" className="float-end rounded-circle">
              +
            </Button>
          </Col>
        </Row>
        <Row className="mb-5" style={{minHeight: "50vh"}}>
        {
          sprint.statuses.map((status) => (
            <Col key={status.id} md={12/sprint.statuses.length}>
              <Col className="p-2 bg-light rounded h-100">
                <h3 className="text-center">{status.name}</h3>
                {
                  status.task.map((task) => (
                    <Card key={task.id} className="flex-grow-1 d-flex flex-column">
                      <Card.Body className="d-flex flex-column">
                        <Card.Title>
                          <h3>{task.name}</h3>
                        </Card.Title>
                        <Card.Subtitle className="mb-2 text-muted">
                          <Badge pill bg={task.priority.color}>{task.priority.name}</Badge>
                        </Card.Subtitle>
                        <Card.Text>
                          <Button variant="primary" onClick={() => {setShowViewTask(true); setSelectedTaskId(task.id);}}>Open</Button>{' '}
                          <Button variant="primary" onClick={() => {setShowEditTaskForm(true); setSelectedTaskId(task.id);}}><PencilSquare/></Button>{' '}
                          <Button variant="primary" onClick={() => delete_task(task.id)}><Trash/></Button>
                        </Card.Text>
                      </Card.Body>
                    </Card>
                  ))
                }
              </Col>
            </Col>
          ))
        }
        </Row>
        <Row className="mb-2">
          <h2>Chart</h2>
        </Row>
        <Row>
          <Col md={10}>
          
          </Col>
          <Col md={2}>
            <Col>
              <p>Speed:</p>
            </Col>
            <Col>
              <p>Velocity:</p>
            </Col>
            <Col>
              <p>Progress:</p>
            </Col>
          </Col>
        </Row>
        {
          showAddTaskForm && (
            <AddTaskSprint show={showAddTaskForm} onHide={() => {setShowAddTaskForm(false)}} id={sprint.id} updateData={createShowSprintTasks}/>
          )
        }
        {
          showEditSprintForm && (
            <EditSprintForm show={showEditSprintForm} onHide={() => {setShowEditSprintForm(false)}} id={sprint.id} updateData={updateShowSprint}/>
          )
        }
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
      ) 
    }
    </>
  );
}

export default ViewSprint;