import { useContext, useEffect, useState } from "react";
import { Alert, Button, Col, Form, FormControl, Modal, Table } from "react-bootstrap";
import { AddMember, Member } from "../../interfaces/ProjectMember";
import { GetProjectMembers, InviteMember, RemoveMember } from "../../apis/project-management";
import TokenContext from "../../context/TokenContext";
import { validateAddMemberForm } from "../../validation/Member";

function ManageMember(props: IdModalProps) {
    const [ members, setMembers ] = useState<Member[]>([]);
    const { token } = useContext(TokenContext);
    const [formData, setFormData] = useState<AddMember>({
        username: "",
    });
    const [errors, setErrors] = useState<{ [key: string]: string }>({});
    const [errorMessage, setErrorMessage] = useState<string>("");

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await GetProjectMembers(token, props.id);
                setMembers(response);
            } catch (error) {
                console.error("Error fetching project data:", error);
            }
        };

        fetchData();
    }, [props.show]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData({
          ...formData,
          [name]: value,
        });
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
    
        const { errors, isValid } = validateAddMemberForm(formData);
        setErrors(errors);
    
        if (isValid) {
          try {
            const result = await InviteMember(token, props.id, formData.username);
            setMembers([...members, result]);
          } catch (error) {
            setErrorMessage("Add member failed");
            console.error("Error:", error);
          }
        }
    };

    const removeMember = async (username: string) => {
        try {
            await RemoveMember(token, props.id, username);
            setMembers(members.filter((member) => member.username !== username));
        } catch (error) {
            console.error("Error:", error);
        }
    };

    return (
       <>
            <Modal show={props.show} onHide={props.onHide}>
                <Modal.Header closeButton></Modal.Header>
                <Modal.Body>
                    <Col className="mb-4">
                        <h1>Manage Members</h1>
                        {errorMessage && <Alert key="danger" variant="danger">{errorMessage}</Alert>}
                        <Form onSubmit={handleSubmit}>
                            <Form.Group>
                                <Form.Label>Username</Form.Label>
                                <FormControl
                                    type="text"
                                    name="username"
                                    value={formData.username}
                                    onChange={handleInputChange}
                                />
                                {errors.username && <div className="text-danger">{errors.username}</div>}
                            </Form.Group>
                            <Button variant="primary" type="submit" className="mt-3">
                                Add
                            </Button>
                        </Form>
                    </Col>
                    <Col>
                        <h2>Members</h2>
                        <Table striped bordered hover>
                            <thead>
                                <tr>
                                    <th>Username</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {members.map((member) => (
                                    <tr key={member.id}>
                                        <td>{member.username} </td>
                                        <td>
                                            {
                                                member.is_owner ? "No action" : (
                                                    member.is_accepted ? (
                                                        <Button variant="danger" onClick={() => removeMember(member.username)}>
                                                            Remove Member
                                                        </Button>
                                                    ) : (
                                                        <Button variant="danger" onClick={() => removeMember(member.username)}>
                                                            Cancel Invite
                                                        </Button>
                                                    )
                                                )
                                            }
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </Table>
                    </Col>
                </Modal.Body>
            </Modal>
       </>
    )
}

export default ManageMember;