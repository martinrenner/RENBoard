import { Accordion, Col, Row } from "react-bootstrap";

function Learn() {
    return (
        <>
            <Row className="justify-content-center">
                <Col md={12} className='mb-4'>
                    <h1>Help</h1>
                </Col>
                <Col md={12} className='mb-4'>
                    <Accordion defaultActiveKey={['0', '1', '2', '3', '4']} alwaysOpen>
                        <Accordion.Item eventKey="0">
                            <Accordion.Header>What is RenBoard?</Accordion.Header>
                            <Accordion.Body>
                                RenBoard is a project management tool that allows users to manage tasks and projects using an interactive Kanban board. The board consists of lists that represent different stages of a project, and cards that represent tasks. Users can drag and drop cards across lists to track the progress of their tasks and projects.
                            </Accordion.Body>
                        </Accordion.Item>
                        <Accordion.Item eventKey="1">
                            <Accordion.Header>How do I create a project?</Accordion.Header>
                            <Accordion.Body>
                                To create a project, click on the "Create Project" button on the Projects page. You will be prompted to enter a name and description for the project. Once you have entered the project details, click on the "Create" button to create the project.
                            </Accordion.Body>
                        </Accordion.Item>
                        <Accordion.Item eventKey="2">
                            <Accordion.Header>How do I create a sprint?</Accordion.Header>
                            <Accordion.Body>
                                To create a sprint, click on the "Create Sprint" button on the Project page. You will be prompted to enter a name and description for the sprint. Once you have entered the sprint details, click on the "Create" button to create the sprint.
                            </Accordion.Body>
                        </Accordion.Item>
                        <Accordion.Item eventKey="3">
                            <Accordion.Header>How do I create a task?</Accordion.Header>
                            <Accordion.Body>
                                To create a task, click on the "Add Task" button on the Sprint page. You will be prompted to enter a name and description for the task. Once you have entered the task details, click on the "Add" button to create the task.
                            </Accordion.Body>
                        </Accordion.Item>
                        <Accordion.Item eventKey="4">
                            <Accordion.Header>How do I move a task to a different list?</Accordion.Header>
                            <Accordion.Body>
                                To move a task to a different list, simply drag and drop the task card to the desired list on the Sprint page.
                            </Accordion.Body>
                        </Accordion.Item>
                    </Accordion>
                </Col>
            </Row>
        </>
    );
}

export default Learn;