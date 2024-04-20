import { Row, Col, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';

function Home() {
  return (
    <>
      <Row className="justify-content-center">
        <Col md={12} className='mb-4'>
          <h1>Welcome to RenBoard!</h1>
        </Col>
        <Col md={12} className='mb-4'>
          <p className="lead">
            Embrace the flexibility and efficiency of managing projects with our interactive Kanban board. 
            Whether you are part of a small team or a large organization, our tool is designed to streamline 
            task management, enhance collaboration, and boost productivity across your projects.
          </p>
          <Col className='mt-4 mb-4'>
            <Link to="/projects">
              <Button variant="primary" size='lg'>
                Try it out
              </Button>
            </Link>
          </Col>
        </Col>
        <Col md={12} className='mb-4'>
          <h2>Key Features</h2>
          <Col className='bg-light mt-4 p-4 mb-4 rounded'>
            <Row>
              <Col md={4}>
                <i className="bi bi-clipboard-data fs-1 text-primary"></i>
              </Col>
              <Col md={8}>
                <h3>Interactive Kanban Board</h3>
                <p>
                  Visualize your workflow with our interactive Kanban board. Drag and drop cards across 
                  lists to track the progress of your tasks and projects.
                </p>
              </Col>
            </Row>
          </Col>
          <Col className='bg-light mt-4 p-4 mb-4 rounded'>
            <Row>
              <Col md={8}>
                <h3>Interactive Kanban Board</h3>
                <p>
                  Visualize your workflow with our interactive Kanban board. Drag and drop cards across 
                  lists to track the progress of your tasks and projects.
                </p>
              </Col>
              <Col md={4}>
                <i className="bi bi-clipboard-data fs-1 text-primary"></i>
              </Col>
            </Row>
          </Col>
          <Col className='bg-light mt-4 p-4 mb-4 rounded'>
            <Row>
              <Col md={4}>
                <i className="bi bi-clipboard-data fs-1 text-primary"></i>
              </Col>
              <Col md={8}>
                <h3>Interactive Kanban Board</h3>
                <p>
                  Visualize your workflow with our interactive Kanban board. Drag and drop cards across 
                  lists to track the progress of your tasks and projects.
                </p>
              </Col>
            </Row>
          </Col>
          <Col className='bg-light mt-4 p-4 mb-4 rounded'>
            <Row>
              <Col md={8}>
                <h3>Interactive Kanban Board</h3>
                <p>
                  Visualize your workflow with our interactive Kanban board. Drag and drop cards across 
                  lists to track the progress of your tasks and projects.
                </p>
              </Col>
              <Col md={4}>
                <i className="bi bi-clipboard-data fs-1 text-primary"></i>
              </Col>
            </Row>
          </Col>
        </Col>
        <Col md={12} className='mb-4'>
          <h2>Created by</h2>
          <Col className='bg-light.bg-gradient mt-4 p-4 mb-4 rounded'>
            <Row>
              <Col md={4} className='text-center'>
                <img src="https://via.placeholder.com/150" alt="Placeholder" className="img-fluid rounded-circle" />
              </Col>
              <Col md={8} className="d-flex flex-column justify-content-center">
                <h3>Martin Renner</h3>
                <p>
                  Full Stack Developer with a passion for creating web applications. 
                  I am always eager to learn new technologies and improve my skills.
                </p>
              </Col>
            </Row>
          </Col>
        </Col>
      </Row>
    </>
  );
};

export default Home;
