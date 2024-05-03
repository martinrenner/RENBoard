import { Col } from "react-bootstrap";
import { Status } from "../../../interfaces/Status";
import { Sprint } from "../../../interfaces/Sprint";
import { useDroppable } from "@dnd-kit/core";
import CardTask from "../../Tasks/CardTask/CardTask";

interface ViewStatusProps {
    status: Status;
    sprint: Sprint;
    setSprint: React.Dispatch<React.SetStateAction<Sprint>>;
}

function ViewStatus(props: ViewStatusProps) {
    const {status, sprint, setSprint} = props;
    
    const {setNodeRef} = useDroppable({id: status.id, data: status});

    return (
        <>
            <Col key={status.id} xs={12} sm={6} md={4} xl={3} xxl={3} ref={setNodeRef}>
                <Col className="p-2 bg-light rounded h-100">
                    <h3 className="text-center">{status.name}</h3>
                    {
                        status.tasks.map((task) => (
                            <CardTask key={task.id} task={task} sprint={sprint} setSprint={setSprint}></CardTask>
                        ))
                    }
              </Col>
            </Col>
        </>
    )
}

export default ViewStatus