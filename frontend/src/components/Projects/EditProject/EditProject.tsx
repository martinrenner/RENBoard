import { ChangeEvent, useEffect, useState, useContext } from "react";
import { Button, Form, FormControl } from "react-bootstrap";
import { useNavigate, useParams } from "react-router-dom";
import TokenContext from "../../../context/TokenContext";

interface FormData {
  name: string;
  description: string;
  is_finished: boolean;
}

function ProjectEdit() {
  const { project_id } = useParams();
  const { token, isTokenValid } = useContext(TokenContext);
  const navigate = useNavigate();
  const [formData, setFormData] = useState<FormData>({
    name: "",
    description: "",
    is_finished: false,
  });

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
          setFormData({
            name: data.name,
            description: data.description,
            is_finished: data.is_finished,
          });
        })
        .catch((error) => {
          console.error("Error fetching project data:", error.message);
        });
    }
  }, [project_id, isTokenValid, token, navigate]);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    fetch(`http://localhost:8000/project/${project_id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(formData),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to edit project");
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
      <h1>Edit Project</h1>
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
        <Form.Group>
          <Form.Check
            type="checkbox"
            label="Finished"
            name="is_finished"
            checked={formData.is_finished}
            onChange={(e) =>
              setFormData({
                ...formData,
                is_finished: e.target.checked,
              })
            }
          />
        </Form.Group>
        <Button variant="primary" type="submit" className="mt-3">
          Update
        </Button>
      </Form>
    </>
  );
}

export default ProjectEdit;
