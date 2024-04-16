import { ChangeEvent, useEffect, useState, useContext } from "react";
import { Alert, Button, Form, FormControl } from "react-bootstrap";
import { useNavigate, useParams } from "react-router-dom";
import TokenContext from "../../../context/TokenContext";
import { validateProjectUpdateForm } from "../../../validation/Project";
import { ProjectUpdate } from "../../../interfaces/Project";
import { GetProject, UpdateProject } from "../../../apis/project";


function ProjectEdit() {
  const { project_id } = useParams();
  const { token, isTokenValid } = useContext(TokenContext);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [errorMessage, setErrorMessage] = useState<string>("");
  const navigate = useNavigate();
  const [formData, setFormData] = useState<ProjectUpdate>({
    name: "",
    description: "",
    customer: null,
  });

  useEffect(() => {
    if (isTokenValid()) {
      const fetchData = async () => {
        try {
          if (project_id) {
            const response = await GetProject(token, project_id);
            setFormData(response);
          }
          else 
            throw new Error("Project ID not found");
        } catch (error) {
          console.error("Error fetching project data:", error);
        }
      };

      fetchData();
    }
  }, [project_id, isTokenValid, token]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const { errors, isValid } = validateProjectUpdateForm(formData);
    setErrors(errors);

    if (isValid) {
      try {
        if (project_id) {
          await UpdateProject(token, project_id, formData);
          navigate(`/projects/${project_id}`);
        }
        else
          throw new Error("Project ID not found");
      }
      catch (error) {
        setErrorMessage("Update project failed");
        console.error("Error:", error);
      }
    }
  };

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({...formData, [name]: value});
  };

  return (
    <>
      <h1>Edit Project</h1>
      {errorMessage && <Alert key="danger" variant="danger">{errorMessage}</Alert>}
      <Form onSubmit={handleSubmit}>
        <Form.Group>
          <Form.Label>Project Name</Form.Label>
          <FormControl
            type="text"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
          />
          {errors.name && <div className="text-danger">{errors.name}</div>}
        </Form.Group>
        <Form.Group>
          <Form.Label>Description</Form.Label>
          <FormControl
            as="textarea"
            name="description"
            value={formData.description}
            onChange={handleInputChange}
          />
          {errors.description && <div className="text-danger">{errors.description}</div>}
        </Form.Group>
        <Form.Group>
          <Form.Label>Customer</Form.Label>
          <FormControl
            type="text"
            name="customer"
            value={formData.customer || ""}
            onChange={handleInputChange}
          />
          {errors.customer && <div className="text-danger">{errors.customer}</div>}
        </Form.Group>
        <Button variant="primary" type="submit" className="mt-3">
          Update
        </Button>
      </Form>
    </>
  );
}

export default ProjectEdit;
