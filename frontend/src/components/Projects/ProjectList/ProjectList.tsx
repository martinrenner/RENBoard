import { useEffect, useState, useContext } from "react";
import { Project } from "../../../interfaces/Project";
import { Button, Card, Col, Row } from "react-bootstrap";
import { Link } from "react-router-dom";
import TokenContext from "../../../context/TokenContext";
import { DeleteProject, GetProjects } from "../../../apis/project";

function ProjectList() {
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
  }, [token, isTokenValid]);

  const delete_project = async (project_id: number) => {
    try {
      await DeleteProject(token, project_id);
      setProjects(projects.filter((project) => project.id !== project_id));
    } catch (error) {
      console.error("Error deleting project:", error);
    }
  };

  return (
    <>
      <Row>
        <Col xs={10}>
          <h1>Projects</h1>
        </Col>
        <Col xs={2}>
          <Link to="/projects/create">
            <Button variant="primary" className="float-end">
              Create project
            </Button>
          </Link>
        </Col>
      </Row>

      {projects.map((project) => (
        <Card key={project.id} className="mb-3">
          <Card.Body>
            <Row>
              <Col xs={10}>
                <Card.Title>{project.name}</Card.Title>
              </Col>
              <Col xs={2} className="d-flex justify-content-end gap-2">
                <Link to={`/projects/${project.id}`}>
                  <Button variant="primary">View</Button>
                </Link>
                <Link to={`/projects/${project.id}/edit`}>
                  <Button variant="warning">Edit</Button>
                </Link>
                <Button
                  variant="danger"
                  onClick={() => delete_project(project.id)}
                >
                  Delete
                </Button>
              </Col>
            </Row>

            <Card.Text>{project.description} <b>({project.customer})</b></Card.Text>
          </Card.Body>
        </Card>
      ))}
    </>
  );
}

export default ProjectList;
