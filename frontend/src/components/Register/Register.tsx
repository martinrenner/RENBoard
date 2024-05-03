import { useState, ChangeEvent, FormEvent } from "react";
import { Alert, Button, Card, Col, Container, Form, Row } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import { validateRegisterForm } from "../../validation/User";
import { RegisterUser } from "./../../interfaces/User";
import { registerUser } from "../../apis/user";

function RegisterForm() {
  const [formData, setFormData] = useState<RegisterUser>({
    name: "",
    surname: "",
    username: "",
    email: "",
    password: "",
    password_confirmation: "",
  });

  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [errorMessage, setErrorMessage] = useState<string>("");
  const navigate = useNavigate();

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({...formData, [name]: value,});
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const { errors, isValid } = validateRegisterForm(formData);
    setErrors(errors);

    if (isValid) {
      try {
        await registerUser(formData);
        navigate("/login", { replace: true });
      } catch (error) {
        setErrorMessage("Registration failed");
        console.error("Error:", error);
      }
    }
  };

  return (
    <>
      <Container className="py-5 h-100">
        <Row className="d-flex justify-content-center align-items-center h-100">
          <Col md={8} lg={6} xl={5}>
            <Card>
              <Card.Body className="p-5">
              <h1>Register</h1>
                {errorMessage && <Alert variant="danger">{errorMessage}</Alert>}
                <Form onSubmit={handleSubmit}>
                  <Form.Group>
                    <Form.Label>Name</Form.Label>
                    <Form.Control
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                    />
                    {errors.name && <div className="text-danger">{errors.name}</div>}
                  </Form.Group>
                  <Form.Group>
                    <Form.Label>Surname</Form.Label>
                    <Form.Control
                      type="text"
                      name="surname"
                      value={formData.surname}
                      onChange={handleInputChange}
                    />
                    {errors.surname && (
                      <div className="text-danger">{errors.surname}</div>
                    )}
                  </Form.Group>
                  <Form.Group>
                    <Form.Label>Username</Form.Label>
                    <Form.Control
                      type="text"
                      name="username"
                      value={formData.username}
                      onChange={handleInputChange}
                    />
                    {errors.username && (
                      <div className="text-danger">{errors.username}</div>
                    )}
                  </Form.Group>
                  <Form.Group>
                    <Form.Label>Email</Form.Label>
                    <Form.Control
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                    />
                    {errors.email && <div className="text-danger">{errors.email}</div>}
                  </Form.Group>
                  <Form.Group>
                    <Form.Label>Password</Form.Label>
                    <Form.Control
                      type="password"
                      name="password"
                      value={formData.password}
                      onChange={handleInputChange}
                    />
                    {errors.password && (
                      <div className="text-danger">{errors.password}</div>
                    )}
                  </Form.Group>
                  <Form.Group>
                    <Form.Label>Confirm Password</Form.Label>
                    <Form.Control
                      type="password"
                      name="password_confirmation"
                      value={formData.password_confirmation}
                      onChange={handleInputChange}
                    />
                    {errors.password_confirmation && (
                      <div className="text-danger">{errors.password_confirmation}</div>
                    )}
                  </Form.Group>
                  <Col className="d-flex align-items-center">
                      <Button variant="primary" type="submit" className="mt-3 mr-3">
                        Register
                      </Button>
                      <Form.Text className="text-muted mt-3 p-3">
                        Already have an account? <Link to="/login">Login here</Link>
                      </Form.Text>
                    </Col>
                </Form>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </>
  );
}

export default RegisterForm;
