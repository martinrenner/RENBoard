import { useContext, useEffect, useState } from "react";
import { Breadcrumb, Button, Col, Row, Table } from "react-bootstrap";
import { ProjectMember } from "../../interfaces/ProjectMember";
import { InviteDecision, LeaveProject, MyProjects } from "../../apis/project-management";
import TokenContext from "../../context/TokenContext";
import { DeleteProject } from "../../apis/project";

function ListManageProjects() {
    const [projectMember, setProjectMember] = useState<ProjectMember[]>([]);
    const { token, isTokenValid } = useContext(TokenContext);

    useEffect(() => {
        if (isTokenValid()) {
            const fetchData = async () => {
                try {
                    const result = await MyProjects(token);
                    setProjectMember(result);
                } catch (error) {
                    console.error("Error fetching projects data:", error);
                }
            };

            fetchData();
        }
    }, []);

    const handleInvite = async (projectId: number, decision: boolean) => {
        try {
            await InviteDecision(token, projectId, decision);
            if (decision) {
                setProjectMember(prevState => prevState.map(project => 
                    project.id === projectId ? { ...project, is_accepted: true } : project
                ));
            } else {
                setProjectMember(prevState => prevState.filter(project => project.id !== projectId));
            }
        } catch (error) {
            console.error("Error accepting invite:", error);
        }
    }
    
    const handleLeave = async (projectId: number) => {
        try {
            await LeaveProject(token, projectId);
            setProjectMember(prevState => prevState.filter(project => project.id !== projectId));
        } catch (error) {
            console.error("Error leaving project:", error);
        }
    }
    
    const handleDeleteProject = async (projectId: number) => {
        try {
            await DeleteProject(token, projectId);
            setProjectMember(prevState => prevState.filter(project => project.id !== projectId));
        } catch (error) {
            console.error("Error deleting project:", error);
        }
    }

    return (
        <>
            <Row>
                <Breadcrumb>
                    <Breadcrumb.Item active>Project Management</Breadcrumb.Item>
                </Breadcrumb>
            </Row>
            <Row className="mb-4">
                <Col>
                    <h1>Project Management</h1>
                </Col>
            </Row>
            <Row>
                <Table striped bordered hover>
                    <thead>
                        <tr>
                            <th>#</th>
                            <th>Project Name</th>
                            <th>Status</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {projectMember.length > 0 ? (
                            projectMember.map((project, index) => (
                                <tr key={project.id}>
                                    <td>{index + 1}</td>
                                    <td>{project.name}</td>
                                    <td>
                                        {project.is_owner ? 
                                            <span className="badge bg-success">Owner</span> 
                                        : 
                                            project.is_accepted ? 
                                                <span className="badge bg-primary">Member</span> 
                                            : 
                                                <span className="badge bg-warning">Invite</span>

                                        }
                                    </td>
                                    <td>
                                        {project.is_owner ? 
                                            <Button variant="danger" onClick={() => handleDeleteProject(project.id)}>Delete</Button>
                                        : 
                                            project.is_accepted ? 
                                                <Button variant="primary" onClick={() => handleLeave(project.id)}>Leave</Button>
                                            : 
                                                <span>
                                                    <Button variant="primary" onClick={() => handleInvite(project.id, true)}>Accept</Button>{' '}
                                                    <Button variant="warning" onClick={() => handleInvite(project.id, false)}>Decline</Button>
                                                </span>

                                        }
                                    </td>
                                </tr>
                            ))
                            ) : (
                            <tr>
                                <td colSpan={4}>You are not part of any projects.</td>
                            </tr>
                        )}
                    </tbody>
                </Table>
            </Row>
        </>
    );
}

export default ListManageProjects;