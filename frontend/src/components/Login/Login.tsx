import { useState, ChangeEvent, FormEvent, useContext } from "react";
import { useNavigate } from "react-router-dom";
import TokenContext from "../../context/TokenContext";
import { Alert, Button, Form, FormControl, FormGroup, FormText } from "react-bootstrap";
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
      <h1>Login</h1>
      {errorMessage && <Alert key="danger" variant="danger">{errorMessage}</Alert>}
      <Form onSubmit={handleSubmit}>
        <FormGroup>
          <Form.Label>Username or Email</Form.Label>
          <FormControl
            type="text"
            name="username"
            value={formData.username}
            onChange={handleInputChange}
          ></FormControl>
          {errors.username && (
            <FormText className="text-danger"> * {errors.username}</FormText>
          )}
        </FormGroup>
        <FormGroup>
          <Form.Label>Password</Form.Label>
          <FormControl
            type="password"
            name="password"
            value={formData.password}
            onChange={handleInputChange}
          ></FormControl>
          {errors.password && (
            <FormText className="text-danger"> * {errors.password}</FormText>
          )}
        </FormGroup>
        <Button variant="primary" type="submit" className="mt-3">
          Login
        </Button>
      </Form>
    </>
  );
}

export default LoginForm;
