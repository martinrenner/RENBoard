import { Breadcrumb, Col, Row } from "react-bootstrap";

function ListGroups() {
    return (
        <>
            <Row>
                <Breadcrumb>
                    <Breadcrumb.Item active>Groups</Breadcrumb.Item>
                </Breadcrumb>
            </Row>
            <Row className="mb-4">
                <Col>
                    <h1>Groups</h1>
                </Col>
            </Row>
        </>
    );
}

export default ListGroups;