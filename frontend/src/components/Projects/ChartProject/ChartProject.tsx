import { Col, Modal, Row } from "react-bootstrap";
import { ProjectChart } from "../../../interfaces/Project";
import TokenContext from "../../../context/TokenContext";
import { useContext, useEffect, useState } from "react";
import { GetProjectChart } from "../../../apis/project";
import { Bar, BarChart, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

function ChartProjectForm(props: ModalProps) {
    const { token, isTokenValid } = useContext(TokenContext);
    const [ project, setProject ] = useState<ProjectChart>();
    const [ chartData, setChartData ] = useState<{ name: string; tasksFinished: number | null; tasksUnfinished: number; }[]>([]);

    useEffect(() => {
        if (isTokenValid()) {
            const fetchData = async () => {
                try {
                    if (props.id) {
                        const response = await GetProjectChart(token, props.id);
                        setProject(response);

                        const newChartData = [];
                        for (let i = 0; i < response.sprints_progress.length; i++) {
                            newChartData.push({
                                name: response.sprints_progress[i].name + " " + (response.sprints_progress[i].is_finished ? "(Finished)" : "(Unfinished)"),
                                tasksFinished: response.sprints_progress[i].tasks_finished_count,
                                tasksUnfinished: response.sprints_progress[i].tasks_unfinished_count,
                            });
                        }

                        setChartData(newChartData);
                    } else {
                        throw new Error("Sprint ID not found");
                    }
                } catch (error) {
                    console.error("Error fetching sprint data:", error);
                }
            };
        
            fetchData();
        }
    }, [props.show]);

    return (
        <>
            <Modal show={props.show} size="lg" onHide={props.onHide}>
                <Modal.Header closeButton></Modal.Header>
                <Modal.Body>
                    <h1>Project Statistics</h1>
                    <Row className="mb-4">
                    <Col md={4} className="mb-3">
                        <Col className="bg-light rounded p-2">
                            <p>Total sprints:</p>
                            <h3 className="text-center"><b>{project?.total_sprints_count}</b></h3>
                        </Col>
                    </Col>
                    <Col md={4} className="mb-3">
                        <Col className="bg-light rounded p-2">
                            <p>Done:</p>
                            <h3 className="text-center"><b>{project?.total_sprints_finished_count}</b></h3>
                        </Col>
                    </Col>
                    <Col md={4} className="mb-3">
                        <Col className="bg-light rounded p-2">
                            <p>Remaining:</p>
                            <h3 className="text-center"><b>{project?.total_sprints_unfinished_count}</b></h3>
                        </Col>
                    </Col>
                </Row>
                <Row>
                    <Col>
                        <h2>Velocity/Throughput Chart</h2>
                    </Col>
                </Row>
                <ResponsiveContainer width="100%" height={400}>
                    <BarChart width={600} height={300} data={chartData} margin={{ top: 10, right: 30, left: 30, bottom: 40 }}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" name="Sprint Name" label={{ value: 'Sprint Name', position: 'insideBottomCenter', dy: 30 }}/>
                        <YAxis name="Task Count" label={{ value: 'Task Count', angle: -90, position: 'insideLeftCenter', dx: -10 }}/>
                        <Legend verticalAlign="top"  wrapperStyle={{ paddingBottom: '30px' }}/>
                        <Tooltip contentStyle={{ fontSize: '14px' }}/>
                        <Bar dataKey="tasksFinished" name="Tasks Finished" isAnimationActive={false} fill="#0d6efd" stackId="a"/>
                        <Bar dataKey="tasksUnfinished" name="Tasks Remaining" isAnimationActive={false} fill="#28a745" stackId="a"/>
                    </BarChart>
                </ResponsiveContainer>
                </Modal.Body>
            </Modal>
        </>
    )
}

export default ChartProjectForm;