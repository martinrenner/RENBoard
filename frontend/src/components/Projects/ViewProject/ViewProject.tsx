import { useEffect, useState, useContext } from "react";
import { Project } from "../../../interfaces/Project";
import { Link, useNavigate, useParams } from "react-router-dom";
import { Badge, Breadcrumb, Button, Card, Col, Row } from "react-bootstrap";
import TokenContext from "../../../context/TokenContext";
import { DeleteProject, GetProject } from "../../../apis/project";
import EditProjectForm from "../EditProject/EditProject";
import ManageMember from "../../Members/ManageMember";
import CreateTaskForm from "../../Tasks/CreateTask/CreateTask";
import EditTaskForm from "../../Tasks/EditTask/EditTask";
import ViewTask from "../../Tasks/ViewTask/ViewTask";
import { PencilSquare, Trash } from "react-bootstrap-icons";
import { DeleteTask } from "../../../apis/task";
import CreateSprintForm from "../../Sprints/CreateSprint/CreateSprint";

function ViewProject() {
  const navigate = useNavigate();
  const { project_id } = useParams();
  const [showEditProjectForm, setShowEditProjectForm] = useState<boolean>(false);
  const [showManageMembers, setShowManageMembers] = useState<boolean>(false);
  const [showCreateTaskForm, setShowCreateTaskForm] = useState<boolean>(false);
  const [showEditTaskForm, setShowEditTaskForm] = useState<boolean>(false);
  const [showViewTask, setShowViewTask] = useState<boolean>(false);
  const [showCreateSprintForm, setShowCreateSprintForm] = useState<boolean>(false);
  const [selectedTaskId, setSelectedTaskId] = useState<number>({} as number);
  const { id, token, isTokenValid } = useContext(TokenContext);
  const [project, setProject] = useState<Project>();

  useEffect(() => {
    if (isTokenValid()) {
      const fetchData = async () => {
        try {
          if (project_id) {
            const response = await GetProject(token, project_id);
            setProject(response);
          }
          else 
            throw new Error("Project ID not found");
        } catch (error) {
          console.error("Error fetching project data:", error);
        }
      };

      fetchData();
    }
  }, [token, isTokenValid, project_id]);

  const delete_project = async (project_id: number) => {
    try {
      await DeleteProject(token, project_id);
      navigate("/projects");
    } catch (error) {
      console.error("Error deleting project:", error);
    }
  };

  const delete_task = async (task_id: number) => {
    try {
      await DeleteTask(token, task_id);
      setProject((prevProject) => ({
        ...prevProject!,
        tasks: prevProject!.tasks.filter(task => task.id !== task_id)
      }));
    } catch (error) {
      console.error("Error deleting task:", error);
    }
  }

  return (
  <>
    {project && (
      <>
        <Row>
          <Breadcrumb>
            <Link to="/projects" className="breadcrumb-item">
              Projects
            </Link>
            <Breadcrumb.Item active>{project.name}</Breadcrumb.Item>
          </Breadcrumb>
        </Row>
        <Row>
          <Col md={8}>
            <h1>{project.name}</h1>
          </Col>
          {
            id === project.owner_id && (
              <Col md={4} className="d-flex justify-content-end align-items-center">
                <Button onClick={() => setShowManageMembers(true)} variant="primary" size="sm" className="rounded-pill me-2" style={{height: '40px', width: '80px'}}>
                  Members  
                </Button>
                <Button onClick={() => setShowEditProjectForm(true)} variant="primary" size="sm" className="rounded-pill me-2" style={{height: '40px', width: '80px'}}>
                  Edit
                </Button>
                <Button onClick={() => delete_project(project.id)} variant="primary" size="sm" className="rounded-pill" style={{height: '40px', width: '80px'}}>
                  Delete
                </Button>
              </Col>
            )
          }
        </Row>
        <Row className="mb-5">
          <Col xs={12}>
            <Badge pill bg="primary">{project.tag.name}</Badge>
          </Col>
          <Col xs={12} className="mt-4">
            <p><b>Customer</b>: {project.customer}</p>
            <p>{project.description}</p>
          </Col>
        </Row>
        <Row className="mb-3">
        <Col xs={10}>
          <h2>Sprints</h2>
        </Col>
        <Col xs={2}>
          <Button onClick={() => setShowCreateSprintForm(true)} variant="primary" size="lg" className="float-end rounded-circle">
            +
          </Button>
        </Col>
      </Row>
      <Row className="mb-5">
            {
              project.sprints.map((sprint) => (
                <Col key={sprint.id} md={4} xl={3} className="mb-1 d-flex">
                  <Card className="flex-grow-1 d-flex flex-column">
                    <Card.Body className="d-flex flex-column">
                      <Card.Title>
                        <h3>{sprint.name}</h3>
                      </Card.Title>
                      <Card.Subtitle className="mb-2 text-muted">
                        {
                          new Date(sprint.date_finished) < new Date() ? (
                            <Badge pill bg="success">Completed</Badge>
                          ) : (
                            <Badge pill bg="info">In Progress</Badge>
                          )
                        }
                      </Card.Subtitle>
                      <Card.Text className="mt-3 mb-3 flex-grow-1">
                        {sprint.description.substring(0, 200)}{sprint.description.length > 200 && "..."}
                      </Card.Text>
                      <Link to={`sprint/${sprint.id}`} className="mt-auto">
                        <Button variant="primary">Open</Button>
                      </Link>
                    </Card.Body>
                  </Card>
                </Col>
              ))
            }
        </Row>
        <Row className="mb-3">
        <Col xs={10}>
          <h2>Tasks</h2>
        </Col>
        <Col xs={2}>
          <Button variant="primary" size="lg" className="float-end rounded-circle" onClick={() => setShowCreateTaskForm(true)}>
            +
          </Button>
        </Col>
      </Row>
        <Row className="mb-5">
            {
              project.tasks.map((task) => (
                <Col key={task.id} md={4} xl={3} className="mb-4 d-flex">
                  <Card className="flex-grow-1 d-flex flex-column">
                      <Card.Body className="d-flex flex-column">
                          <Card.Title>
                            <h3>{task.name}</h3>
                          </Card.Title>
                          <Card.Subtitle className="mb-2 text-muted">
                            <Badge pill bg={task.priority.color}>{task.priority.name}</Badge>
                          </Card.Subtitle>
                          <Card.Text className="mt-3 mb-3 flex-grow-1">
                            {task.description.substring(0, 200)}{task.description.length > 200 && "..."}
                          </Card.Text>
                          <Col className="mt-auto">
                            <Button variant="primary" onClick={() => {setShowViewTask(true); setSelectedTaskId(task.id);}}>Open</Button>{' '}
                            <Button variant="primary" onClick={() => {setShowEditTaskForm(true); setSelectedTaskId(task.id);}}><PencilSquare/></Button>{' '}
                            <Button variant="primary" onClick={() => delete_task(task.id)}><Trash/></Button>
                          </Col>
                      </Card.Body>
                  </Card>
              </Col>
              ))
            }
        </Row>
        <EditProjectForm show={showEditProjectForm} onHide={() => {setShowEditProjectForm(false)}} id={project.id} data={null} setData={setProject}/>
        {
          project.owner_id === id && (
            <ManageMember show={showManageMembers} onHide={() => {setShowManageMembers(false)}} id={project.id} data={null} setData={() => {}}/>
          )
        }
        {
          showCreateTaskForm && (
            <CreateTaskForm show={showCreateTaskForm} onHide={() => {setShowCreateTaskForm(false)}} id={project.id} data={project} setData={setProject}/>
          )
        }
        {
          showEditTaskForm && (
            <EditTaskForm show={showEditTaskForm} onHide={() => {setShowEditTaskForm(false)}} id={selectedTaskId} data={project} setData={setProject}/>
          )
        }
        {
          showViewTask && (
            <ViewTask show={showViewTask} onHide={() => setShowViewTask(false)} id={selectedTaskId} data={null} setData={() => {}}/>
          )
        }
        {
          showCreateSprintForm && (
            <CreateSprintForm show={showCreateSprintForm} onHide={() => setShowCreateSprintForm(false)} id={project.id} data={null} setData={() => {}}/>
          )
        }
      </>
    )}
  </>
);
}

export default ViewProject;
