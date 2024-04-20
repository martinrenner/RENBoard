import { useState, useContext, useEffect } from "react";
import { Alert, Button, Form, FormControl, Modal } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import TokenContext from "../../../context/TokenContext";
import { ProjectCreate } from "../../../interfaces/Project";
import { validateProjectCreateForm } from "../../../validation/Project";
import { CreateProject } from "../../../apis/project";
import { Tag } from "../../../interfaces/Tag";
import { GetTags } from "../../../apis/tags";

function CreateProjectForm(props: ModalProps) {
  const [formData, setFormData] = useState<ProjectCreate>({} as ProjectCreate);

  const navigate = useNavigate();
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [errorMessage, setErrorMessage] = useState<string>("");
  const { token, isTokenValid } = useContext(TokenContext);
  const [ tags, setTags ] = useState<Tag[]>([]);

  useEffect(() => {
    setFormData({
        name: "",
        description: "",
        customer: null,
        tag_id: 1,
      });
    if (isTokenValid()) {
      const fetchData = async () => {
        try {
          const result = await GetTags(token);
          setTags(result);
        } catch (error) {
          console.error("Error fetching tags data:", error);
        }
      };
  
      fetchData();
    }
  }, [props.show]);

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

 const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
  const { name, value } = e.target;
  setFormData({
    ...formData,
    [name]: value,
  });
};

  return (
    <>
      <Modal show={props.show} onHide={props.onHide}>
        <Modal.Header closeButton></Modal.Header>
        <Modal.Body>
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
              <Form.Label>Tag</Form.Label>
              <Form.Select
                name="tag_id"
                value={formData.tag_id}
                onChange={handleInputChange}
              >
                {tags.map((tag) => (
                  <option key={tag.id} value={tag.id}>{tag.name}</option>
                ))}
              </Form.Select>
              {errors.tag_id && <div className="text-danger">{errors.tag_id}</div>}
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
        </Modal.Body>
      </Modal>
    </>
  );
}

export default CreateProjectForm;
