import { Row, Col, Button } from 'react-bootstrap';
import { GraphDown, Kanban, LayoutThreeColumns, ListTask } from 'react-bootstrap-icons';
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
            By using our interactive Kanban board, you can enhance collaboration, streamline task management, and significantly boost productivity across various projects. Our tool aims to simplify complex project tracking and increase transparency in team workflows. Explore the possibilities with RenBoard and revolutionize the way you handle project management.
          </p>
          <Col className='mt-4 mb-4'>
            <Link to="/projects">
              <Button variant="primary">
                Try it out
              </Button>
            </Link>
            {' '}
            <Link to="/help">
              <Button variant="outline-primary">
                Help
              </Button>
            </Link>
          </Col>
        </Col>
        <Col md={12} className='mb-4'>
          <h2>Key Features</h2>
          <Col className='bg-light mt-4 p-4 mb-4 rounded'>
            <Row className='h-50'>
              <Col md={4} className="d-flex align-items-center justify-content-center">
                <Kanban size='100'/>
              </Col>
              <Col md={8} className='p-5'>
                <h3 className='mb-4'>Interactive Board</h3>
                <p>
                  Discover the full potential of visual management with our interactive Kanban board. Drag and drop functionality allows you to seamlessly move tasks through various stages of completion, offering a visual progression of your projects at a glance. It's perfect for maintaining momentum and ensuring continuous improvement throughout the lifecycle of your projects.
                </p>
              </Col>
            </Row>
          </Col>
          <Col className='bg-light mt-4 p-4 mb-4 rounded'>
            <Row>
              <Col md={8} className='p-5'>
                <h3 className='mb-4'>Easily Manage Your Tasks</h3>
                <p>
                  Take control of your task management with unparalleled ease. Our platform allows you to organize, prioritize, and update tasks quickly. This feature facilitates a more structured approach to task management, empowering you to meet your project goals efficiently.
                </p>
              </Col>
              <Col md={4} className="d-flex align-items-center justify-content-center">
                <ListTask size='100'/>
              </Col>
            </Row>
          </Col>
          <Col className='bg-light mt-4 p-4 mb-4 rounded'>
            <Row>
              <Col md={4} className="d-flex align-items-center justify-content-center">
                <LayoutThreeColumns size='100'/>
              </Col>
              <Col md={8} className='p-5'>
                <h3 className='mb-4'>Customizable Columns</h3>
                <p>
                  Our Kanban board comes with fully customizable columns that you can use for different phases of development. This customization allows for greater flexibility and precision in tracking project progress and managing team workload.
                </p>
              </Col>
            </Row>
          </Col>
          <Col className='bg-light mt-4 p-4 mb-4 rounded'>
            <Row>
              <Col md={8} className='p-5'>
                <h3 className='mb-4'>Burndown Chart</h3>
                <p>
                  Leverage our powerful Burndown chart to get a clear visual of your project’s progress against the planned schedule. This tool is invaluable for managing time effectively and keeping your projects on track. The Burndown chart helps you identify potential delays early and make necessary adjustments to ensure timely project delivery.
                </p>
              </Col>
              <Col md={4} className="d-flex align-items-center justify-content-center">
                <GraphDown size='100'/>
              </Col>
            </Row>
          </Col>
        </Col>
        <Col md={12} className='mb-4'>
          <h2>Created by</h2>
          <Col className='bg-light.bg-gradient mt-4 p-4 mb-4 rounded'>
            <Row>
              <Col md={4} className='d-flex align-items-center justify-content-center'>
                <span style={{fontSize: '150px'}}>👨🏿‍💻</span>
              </Col>
              <Col md={8} className="d-flex flex-column justify-content-center">
                <h3 className='mb-4'>Martin Renner</h3>
                <p>
                I am currently a student at the University of Jan Evangelista Purkyně (UJEP) in Ústí nad Labem. My academic and professional pursuits are deeply rooted in my passion for creating web applications. This application was developed as part of the coursework for the Software Engineering (SWI) subject at UJEP, specifically designed to fulfill course credit requirements.
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
