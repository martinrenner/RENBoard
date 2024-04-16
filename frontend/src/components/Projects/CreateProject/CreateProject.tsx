import React, { ChangeEvent, useState, useContext } from "react";
import { Button, Form, FormControl } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import TokenContext from "../../../context/TokenContext";

interface FormData {
  name: string;
  description: string;
}

function ProjectCreate() {
  const [formData, setFormData] = useState<FormData>({
    name: "",
    description: "",
  });

  const navigate = useNavigate();
  const { token } = useContext(TokenContext);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    fetch(`http://localhost:8000/project`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(formData),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to create project");
        }
        return response.json();
      })
      .then((data) => {
        navigate(`/projects/${data.id}`);
      })
      .catch((error) => {
        console.error("Error:", error);
      });
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
      <Form onSubmit={handleSubmit}>
        <Form.Group>
          <Form.Label>Project Name</Form.Label>
          <FormControl
            type="text"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
          />
        </Form.Group>
        <Form.Group>
          <Form.Label>Description</Form.Label>
          <FormControl
            as="textarea"
            name="description"
            value={formData.description}
            onChange={handleInputChange}
          />
        </Form.Group>
        <Button variant="primary" type="submit" className="mt-3">
          Create
        </Button>
      </Form>
    </>
  );
}

export default ProjectCreate;
