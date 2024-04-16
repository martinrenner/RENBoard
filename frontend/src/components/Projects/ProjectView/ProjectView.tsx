import { useEffect, useState, useContext } from "react";
import { Project } from "../../../interfaces/Project";
import { Link, useNavigate, useParams } from "react-router-dom";
import { Button } from "react-bootstrap";
import TokenContext from "../../../context/TokenContext";
import { DeleteProject, GetProject } from "../../../apis/project";

function ProjectView() {
  const navigate = useNavigate();
  const { project_id } = useParams();
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

  return (
    <>
      {project && (
        <>
          <h1>{project.name}</h1>
          <hr />
          <p>Customer: {project.customer}</p>
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
