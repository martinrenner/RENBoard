import { ChangeEvent, useEffect, useState, useContext } from "react";
import { Alert, Button, Form, FormControl, Modal } from "react-bootstrap";
import TokenContext from "../../../context/TokenContext";
import { validateProjectUpdateForm } from "../../../validation/Project";
import { ProjectUpdate } from "../../../interfaces/Project";
import { GetProject, UpdateProject } from "../../../apis/project";
import { Tag } from "../../../interfaces/Tag";
import { GetTags } from "../../../apis/tags";


function EditProjectForm(props: ModalProps) {
  const project_id = props.id;
  const { token, isTokenValid } = useContext(TokenContext);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [ tags, setTags ] = useState<Tag[]>([]);
  const [formData, setFormData] = useState<ProjectUpdate>({
    name: "",
    description: "",
    customer: null,
    tag_id: 1,
  });

  useEffect(() => {
    if (isTokenValid()) {
      const fetchData = async () => {
        try {
          if (project_id) {
            const response = await GetProject(token, project_id);
            setFormData(
              {
                name: response.name,
                description: response.description,
                customer: response.customer,
                tag_id: response.tag.id,
              }
            );
          }
          else 
            throw new Error("Project ID not found");
        } catch (error) {
          console.error("Error fetching project data:", error);
        }
        try {
          const result = await GetTags(token);
          setTags(result);
        } catch (error) {
          console.error("Error fetching tags data:", error);
        } 
      };

      fetchData();
    }
  }, [project_id, isTokenValid, token, props.show]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const { errors, isValid } = validateProjectUpdateForm(formData);
    setErrors(errors);

    if (isValid) {
      try {
        if (project_id) {
          const project = await UpdateProject(token, project_id, formData);
          props.updateData(project);
          props.onHide();
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

  const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData({...formData, [name]: value});
  };

  return (
    <>
      <Modal show={props.show} onHide={props.onHide}>
        <Modal.Header closeButton></Modal.Header>
        <Modal.Body>
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
              Update
            </Button>
          </Form>
        </Modal.Body>
      </Modal>
    </>
  );
}

export default EditProjectForm;
