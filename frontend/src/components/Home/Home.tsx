import { Row, Col, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';

function Home() {
  return (
    <>
      <Row className="justify-content-center">
        <Col md={12} className='mb-4'>
          <h1>Welcome to Your Kanban Board!</h1>
          <p className="lead">
            Embrace the flexibility and efficiency of managing projects with our interactive Kanban board. 
            Whether you are part of a small team or a large organization, our tool is designed to streamline 
            task management, enhance collaboration, and boost productivity across your projects.
          </p>
        </Col>
        <Col md={12} className='mb-4'>
          <h2>Key Features</h2>
          <ul>
              <li><b>Customizable boards</b> - to suit your workflow</li>
              <li><b>Drag-and-drop</b> - functionality for easy task management</li>
              <li><b>Color-coded labels</b> - to categorize tasks</li>
              <li><b>Burndown chart</b> - to keep track of task details</li>
          </ul>
        </Col>
        <Col md={12} >
          <Link to="/projects">
            <Button variant="primary">
              Go to Board
            </Button>
          </Link>
          <Link to="/learn">
            <Button variant="secondary" href="/about" className="ms-2">Learn More</Button>
          </Link>
        </Col>
      </Row>
    </>
  );
};

export default Home;
