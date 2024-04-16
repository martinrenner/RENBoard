import { useEffect, useState, useContext } from "react";
import { Project } from "../../../interfaces/Project";
import { Button, Card, Col, Row } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import TokenContext from "../../../context/TokenContext";

function ProjectList() {
  const [projects, setProjects] = useState<Project[]>([]);
  const { logout, token, isTokenValid } = useContext(TokenContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (isTokenValid()) {
      fetch("http://localhost:8000/project/", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      })
        .then((response) => {
          if (response.ok) {
            return response.json();
          }
          throw new Error("Failed to fetch projects data");
        })
        .then((data) => {
          setProjects(data);
        })
        .catch((error) => {
          console.error("Error fetching projects data:", error.message);
        });
    }
  }, [token, isTokenValid, navigate]);

  const delete_project = (project_id: number) => {
    fetch(`http://localhost:8000/project/${project_id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    })
      .then((response) => {
        if (response.ok) {
          return response.json();
        } else {
          throw new Error("Failed to delete project");
        }
      })
      .then(() => {
        setProjects(projects.filter((project) => project.id !== project_id));
      })
      .catch((error) => {
        console.error("Error deleting project:", error);
      });
  };

  const finish_project = (project_id: number) => {
    fetch(`http://localhost:8000/project/${project_id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ is_finished: true }),
    })
      .then((response) => {
        if (response.ok) {
          return response.json();
        } else {
          throw new Error("Failed to finish project");
        }
      })
      .then(() => {
        setProjects(
          projects.map((project) =>
            project.id === project_id
              ? { ...project, is_finished: true }
              : project
          )
        );
      })
      .catch((error) => {
        console.error("Error finishing project:", error);
      });
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
              <Col>
                <Card.Title>
                  {project.name} -
                  {project.is_finished ? " Finished" : " Not finished"}
                </Card.Title>
              </Col>
              <Col xs={2} className="d-flex justify-content-end gap-2">
                {!project.is_finished && (
                  <Button
                    variant="success"
                    onClick={() => finish_project(project.id)}
                  >
                    Finish
                  </Button>
                )}
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

            <Card.Text>{project.description}</Card.Text>
          </Card.Body>
        </Card>
      ))}
    </>
  );
}

export default ProjectList;
