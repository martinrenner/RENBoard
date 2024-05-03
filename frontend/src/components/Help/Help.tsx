import { Accordion, Col, Row } from "react-bootstrap";

function Learn() {
    return (
        <>
            <Row className="justify-content-center">
                <Col md={12} className='mb-4'>
                    <h1>Help</h1>
                </Col>
                <Col md={12} className='mb-4'>
                    <Accordion defaultActiveKey={['0', '1', '2', '3', '4', '5']} alwaysOpen>
                        <Accordion.Item eventKey="0">
                            <Accordion.Header>What is RenBoard?</Accordion.Header>
                            <Accordion.Body>
                                RenBoard is a versatile project management tool designed to enhance productivity and collaboration through an interactive Kanban board. It allows teams to visualize workflow, manage tasks, and monitor progress effectively. By creating cards for tasks and moving them across customizable lists that represent various stages of a project, RenBoard helps users keep track of development from inception to completion, ensuring transparency and efficient project management.
                            </Accordion.Body>
                        </Accordion.Item>
                        <Accordion.Item eventKey="1">
                            <Accordion.Header>How do I create a project?</Accordion.Header>
                            <Accordion.Body>
                                Creating a project in RenBoard is simple. Navigate to the Projects page and click the "+" button in right corner. This will open a modal form where you can input the project name and a brief description. After filling out these details, click the "Create" button at the bottom of the form. Your new project will then be set up and ready for you to start adding tasks and organizing sprints.
                            </Accordion.Body>
                        </Accordion.Item>
                        <Accordion.Item eventKey="2">
                            <Accordion.Header>How do I create a sprint?</Accordion.Header>
                            <Accordion.Body>
                                To create a sprint within a project, go to the specific Project page and select the "+" button in sprint section. You'll be asked to provide a name and, description for the sprint, starting and finishing date, etc. These details help in distinguishing it from other sprints and setting the goals or objectives. After entering this information, clicking the "Create" button will establish your sprint, allowing you to begin assigning and managing tasks within this sprint framework.
                            </Accordion.Body>
                        </Accordion.Item>
                        <Accordion.Item eventKey="3">
                            <Accordion.Header>How do I create a task?</Accordion.Header>
                            <Accordion.Body>
                                To add a task to your project, ensure you are on the Project page. Click the "+" button in the tasks section which will prompt you to enter details such as the task name, description as a user story (optionally you can write normal description) and priority. Once complete, hit the "Create" button to submit the task. It will then show up in the bottom section of your project page, ready to be imported to any project sprint.
                            </Accordion.Body>
                        </Accordion.Item>
                        <Accordion.Item eventKey="4">
                            <Accordion.Header>How do I import a task to a sprint?</Accordion.Header>
                            <Accordion.Body>
                                To import a task into a sprint, open your desired sprint page within the project. Click the "+" button in the board section to view a list of available tasks. Select the task you wish to import by selecting it, then click the "Add" button. The task will then be added to the sprint. The task will be assingned to first column(usually 'Todo'). You can repeat this process to import multiple tasks into the sprint.
                            </Accordion.Body>
                        </Accordion.Item>
                        <Accordion.Item eventKey="5">
                            <Accordion.Header>How do I move a task to a different list?</Accordion.Header>
                            <Accordion.Body>
                                Moving a task across lists is an intuitive process in RenBoard. Simply click and hold the task card you wish to move, then drag it to your desired list on the same Sprint page. Release the mouse button to drop the card into the list. This action can be used to update the task's progress stage, such as moving from 'In Progress' to 'Completed'. Note that you can only move tasks within the same sprint and only to the next or previous stage.
                            </Accordion.Body>
                        </Accordion.Item>
                    </Accordion>
                </Col>
            </Row>
        </>
    );
}

export default Learn;
