import { Row, Col, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';

function Home() {
  return (
    <>
      <Row className="justify-content-center">
        <Col md={12}>
          <h1>Welcome to Your Kanban Board!</h1>
          <p className="lead">
            Embrace the flexibility and efficiency of managing projects with our interactive Kanban board. 
            Whether you are part of a small team or a large organization, our tool is designed to streamline 
            task management, enhance collaboration, and boost productivity across your projects.
          </p>
          <div className="mb-4">
          <Link to="/projects">
            <Button variant="primary">
                Go to Board
            </Button>
            </Link>
          </div>
        </Col>
      </Row>
    </>
  );
};

export default Home;
