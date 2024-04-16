import { ChangeEvent, useState, useContext } from "react";
import { Alert, Button, Form, FormControl } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import TokenContext from "../../../context/TokenContext";
import { ProjectCreate } from "../../../interfaces/Project";
import { validateProjectCreateForm } from "../../../validation/Project";
import { CreateProject } from "../../../apis/project";

function CreateProjectForm() {
  const [formData, setFormData] = useState<ProjectCreate>({
    name: "",
    description: "",
    customer: null,
  });

  const navigate = useNavigate();
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [errorMessage, setErrorMessage] = useState<string>("");
  const { token } = useContext(TokenContext);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const { errors, isValid } = validateProjectCreateForm(formData);
    setErrors(errors);

    if (isValid) {
      try {
        const result = await CreateProject(token, formData);
        navigate(`/projects/${result.id}`);
      } catch (error) {
        setErrorMessage("Create project failed");
        console.error("Error:", error);
      }
    }
  };

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  return (
    <>
      <h1>Create Project</h1>
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
          Create
        </Button>
      </Form>
    </>
  );
}

export default CreateProjectForm;
