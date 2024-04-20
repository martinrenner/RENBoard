import { useContext } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import TokenContext from "../../context/TokenContext";
import { Container, Nav, NavDropdown, Navbar } from "react-bootstrap";

function Header() {
  const { isTokenValid, logout, username  } = useContext(TokenContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login", { replace: true });
  };

  return (
    <>
      <Navbar bg="primary" data-bs-theme="dark">
        <Container>
          <Navbar.Brand>RenBoard</Navbar.Brand>
          <Nav className="me-auto">
            <Nav.Link as={NavLink} to="/">
              Home
            </Nav.Link>
            <Nav.Link as={NavLink} to="/help">
              Help
            </Nav.Link>
            {isTokenValid() && (
              <Nav.Link as={NavLink} to="/projects">
                Projects
              </Nav.Link>
            )}
          </Nav>
          <Nav className="me-end">
            {!isTokenValid() ? (
              <>
                <Nav.Link as={NavLink} to="/login" className="Button">
                  Login
                </Nav.Link>
                <Nav.Link as={NavLink} to="/register">
                  Register
                </Nav.Link>
              </>
            ) : (
              <NavDropdown title={username}>
                <NavDropdown.Item as={NavLink} to="/groups">Groups</NavDropdown.Item>
                <NavDropdown.Item onClick={handleLogout}>Logout</NavDropdown.Item>
              </NavDropdown>
            )}
          </Nav>
        </Container>
      </Navbar>
    </>
  );
}

export default Header;
