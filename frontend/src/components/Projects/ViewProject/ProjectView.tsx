import { useEffect, useState, useContext } from "react";
import { Project } from "../../../interfaces/Project";
import { Link, useNavigate, useParams } from "react-router-dom";
import { Breadcrumb, Button, Col, Row } from "react-bootstrap";
import TokenContext from "../../../context/TokenContext";
import { DeleteProject, GetProject } from "../../../apis/project";
import EditProjectForm from "../EditProject/EditProject";

function ViewProject() {
  const navigate = useNavigate();
  const { project_id } = useParams();
  const [showEditProjectForm, setShowEditProjectForm] = useState<boolean>(false);
  const { token, isTokenValid } = useContext(TokenContext);
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

  const handleEditProjectFormOpen = () => {
    setShowEditProjectForm(true);
  }

  const handleEditProjectFormClose = () => {
    setShowEditProjectForm(false);
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
          <Col md={4} className="d-flex justify-content-end align-items-center">
            <Button variant="primary" size="sm" className="rounded-pill me-2" style={{height: '40px', width: '80px'}}>
              Members  
            </Button>
            <Button onClick={handleEditProjectFormOpen} variant="primary" size="sm" className="rounded-pill me-2" style={{height: '40px', width: '80px'}}>
              Edit
            </Button>
            <Button onClick={() => delete_project(project.id)} variant="primary" size="sm" className="rounded-pill" style={{height: '40px', width: '80px'}}>
              Delete
            </Button>
          </Col>
        </Row>
        <Row>
          <Col>
            <p>Customer: {project.customer}</p>
            <p>{project.description}</p>
          </Col>
        </Row>
        <EditProjectForm show={showEditProjectForm} onHide={handleEditProjectFormClose} setData={setProject}/>
      </>
    )}
  </>
);
}

export default ViewProject;
