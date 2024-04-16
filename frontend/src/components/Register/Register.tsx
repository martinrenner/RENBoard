import { useState, ChangeEvent, FormEvent } from "react";
import { Button, Form } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
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
      <h1>Register</h1>
      {errorMessage && <div className="text-danger">{errorMessage}</div>}
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
        <Button variant="primary" type="submit" className="mt-3">
          Register
        </Button>
      </Form>
    </>
  );
}

export default RegisterForm;
