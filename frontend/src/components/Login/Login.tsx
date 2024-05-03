import { useState, ChangeEvent, FormEvent, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import TokenContext from "../../context/TokenContext";
import { Alert, Button, Card, Col, Container, Form, FormControl, FormGroup, FormText, Row } from "react-bootstrap";
import { LoginUser } from "../../interfaces/Auth";
import { validateLoginForm } from "../../validation/Auth";
import { loginUser } from "../../apis/auth";

function LoginForm() {
  const [formData, setFormData] = useState<LoginUser>({
    username: "",
    password: "",
  });

  const navigate = useNavigate();
  const { login } = useContext(TokenContext);

  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [errorMessage, setErrorMessage] = useState<string>("");

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({...formData, [name]: value,});
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const { errors, isValid } = validateLoginForm(formData);
    setErrors(errors);

    if (isValid) {
      try {
        const result = await loginUser(formData);
        setErrorMessage("");
        login(result.access_token);
        navigate("/projects");
      } catch (error) {
        setErrorMessage("Login failed");
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
                  <h1>Login</h1>
                  {errorMessage && <Alert variant="danger">{errorMessage}</Alert>}
                  <Form onSubmit={handleSubmit}>
                    <Form.Group>
                      <Form.Label>Username or Email</Form.Label>
                      <Form.Control
                        type="text"
                        name="username"
                        value={formData.username}
                        onChange={handleInputChange}
                      />
                      {errors.username && (
                        <Form.Text className="text-danger"> * {errors.username}</Form.Text>
                      )}
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
                        <Form.Text className="text-danger"> * {errors.password}</Form.Text>
                      )}
                    </Form.Group>
                    <Col className="d-flex align-items-center">
                      <Button variant="primary" type="submit" className="mt-3 mr-3">
                        Login
                      </Button>
                      <Form.Text className="text-muted mt-3 p-3">
                        Don't have an account? <Link to="/register">Register here</Link>
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

export default LoginForm;
