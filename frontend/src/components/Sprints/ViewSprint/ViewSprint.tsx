import { useContext, useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import TokenContext from "../../../context/TokenContext";
import { DeleteSprint, GetSprint } from "../../../apis/sprint";
import { Sprint } from "../../../interfaces/Sprint";
import { Project } from "../../../interfaces/Project";
import { GetProject } from "../../../apis/project";
import { Breadcrumb, Button, Col, Row } from "react-bootstrap";
import { Calendar } from "react-bootstrap-icons";
import EditSprintForm from "../EditSprint/EditSprint";
import AddTaskSprint from "../AddTaskSprint/AddTaskSprint";
import { Task } from "../../../interfaces/Task";
import { DndContext, MouseSensor, closestCorners, useSensor, useSensors } from "@dnd-kit/core";
import ViewStatus from "../../Statuses/ViewStatus/ViewStatus";
import { AssingTask } from "../../../apis/task";

function ViewSprint() {
  const navigate = useNavigate();
  const { project_id, sprint_id } = useParams();
  const { token, isTokenValid } = useContext(TokenContext);
  const [ project, setProject ] = useState<Project>();
  const [ sprint, setSprint ] = useState<Sprint>({} as Sprint);
  const [showAddTaskForm, setShowAddTaskForm] = useState<boolean>(false);
  const [showEditSprintForm, setShowEditSprintForm] = useState<boolean>(false);
  
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

  const updateShowSprint = (newInstance: any) => {
    setSprint(newInstance);
  }

  const createShowSprintTasks = (newInstance: Task) => {
    setSprint(
      {
        ...sprint,
        statuses: sprint?.statuses.map((status, index) => 
          index === 0 ? {...status, tasks: [...status.tasks, newInstance]} : status
        )
      }
    );
  }

  const mouseSensor = useSensor(MouseSensor, {
    activationConstraint: {
      delay: 100,
      tolerance: 5
    }
  });

  const sensors = useSensors(mouseSensor);

  const handleDragEnd = async (event: any) => {
    const { active, over } = event;
    
    try {
      setSprint(prevSprint => {
        const task = active.data.current;

        const newStatuses = prevSprint?.statuses.map(status => {
          return {...status, tasks: status.tasks.filter(task => task.id !== active.id)};
        });
    
        newStatuses.forEach(status => {
          if (status.id === over.id) {
            status.tasks.push(task);
          }
        });
      
        return {...prevSprint, statuses: newStatuses};
      });

      await AssingTask(token, active.id, over.id);
    } catch (error) {
      console.error("Error assigning task:", error);
    }
  };

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
        <Row className="mb-5" style={{minHeight: "50vh", flexWrap: 'nowrap', overflowX: 'auto'}}>
        <DndContext onDragEnd={handleDragEnd} collisionDetection={closestCorners} sensors={sensors}>
          {
            sprint.statuses.map((status) => (
              <ViewStatus key={status.id} status={status} sprint={sprint} setSprint={setSprint}></ViewStatus>
            ))
          }
        </DndContext>
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
        </>
      ) 
    }
    </>
  );
}

export default ViewSprint;