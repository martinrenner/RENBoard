import { useEffect, useState, useContext } from "react";
import { Project } from "../../../interfaces/Project";
import { Badge, Breadcrumb, Button, Card, Col, Row } from "react-bootstrap";
import { Link } from "react-router-dom";
import TokenContext from "../../../context/TokenContext";
import { GetProjects } from "../../../apis/project";
import CreateProjectForm from "../CreateProject/CreateProject";

function ListProject() {
  const [showCreateProjectForm, setShowCreateProjectForm] = useState<boolean>(false);
  const [projects, setProjects] = useState<Project[]>([]);
  const { token, isTokenValid } = useContext(TokenContext);


  useEffect(() => {
    if (isTokenValid()) {
      const fetchData = async () => {
        try {
          const result = await GetProjects(token);
          setProjects(result);
        } catch (error) {
          console.error("Error fetching project data:", error);
        }
      };
  
      fetchData();
    }
  }, []);

  const handleCreateProjectFormOpen = () => {
    setShowCreateProjectForm(true);
  }

  const handleCreateProjectFormClose = () => {
    setShowCreateProjectForm(false);
  }

  return (
    <>
      <Row>
        <Breadcrumb>
          <Breadcrumb.Item active>Projects</Breadcrumb.Item>
        </Breadcrumb>
      </Row>
      <Row className="mb-4">
        <Col xs={10}>
          <h1>Projects</h1>
        </Col>
        <Col xs={2}>
          <Button variant="primary" size="lg" className="float-end rounded-circle" onClick={handleCreateProjectFormOpen}>
            +
          </Button>
        </Col>
      </Row>
      <Row>
        {projects.map((project) => (
          <Col key={project.id} md={4} xl={3} className="mb-4 d-flex">
            <Card className="flex-grow-1 d-flex flex-column">
              <Card.Body className="d-flex flex-column">
                <Card.Title>
                  <h3>{project.name}</h3>
                </Card.Title>
                <Card.Subtitle className="mb-2 text-muted">
                  <Badge pill bg="primary">{project.tag.name}</Badge>
                </Card.Subtitle>
                <Card.Text className="mt-3 mb-3 flex-grow-1">
                  {project.description.substring(0, 200)}{project.description.length > 200 && "..."}
                </Card.Text>
                <Link to={`/projects/${project.id}`} className="mt-auto">
                  <Button variant="primary">Open</Button>
                </Link>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
      <CreateProjectForm show={showCreateProjectForm} onHide={handleCreateProjectFormClose}/>
    </>
  );
}

export default ListProject;
