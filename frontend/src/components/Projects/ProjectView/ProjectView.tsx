import { useEffect, useState, useContext } from "react";
import { Project } from "../../../interfaces/Project";
import { Link, useNavigate, useParams } from "react-router-dom";
import { Button } from "react-bootstrap";
import TokenContext from "../../../context/TokenContext";

function ProjectView() {
  const navigate = useNavigate();
  const { project_id } = useParams();
  const { token, isTokenValid } = useContext(TokenContext);
  const [project, setProject] = useState<Project>();

  useEffect(() => {
    if (isTokenValid()) {
      fetch(`http://localhost:8000/project/${project_id}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      })
        .then((response) => {
          if (response.ok) {
            return response.json();
          } else {
            throw new Error("Failed to fetch project data");
          }
        })
        .then((data) => {
          setProject(data);
        })
        .catch((error) => {
          navigate("/projects", { replace: true });
          console.error("Error fetching project data:", error.message);
        });
    }
  }, [token, isTokenValid, project_id, navigate]);

  const delete_project = (project_id: number) => {
    fetch(`http://localhost:8000/project/${project_id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    }).then((response) => {
      if (!response.ok) {
        throw new Error("Failed to delete project");
      }
      navigate("/projects", { replace: true });
    });
  };

  return (
    <>
      {project && (
        <>
          <h1>{project.name}</h1>
          <hr />
          <p>Finished: {project.is_finished ? "Yes" : "No"}</p>
          <p>{project.description}</p>
          <Link to={`/projects/${project.id}/edit`}>
            <Button variant="warning">Edit</Button>
          </Link>
          <Button
            variant="danger"
            onClick={() => delete_project(project.id)}
            className="ms-2"
          >
            Delete
          </Button>
        </>
      )}
    </>
  );
}

export default ProjectView;
