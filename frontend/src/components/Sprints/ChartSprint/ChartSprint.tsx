import { useState, useContext, useEffect } from "react";
import { Col, Modal, Row } from "react-bootstrap";
import TokenContext from "../../../context/TokenContext";
import { SprintChart } from "../../../interfaces/Sprint";
import { GetSprintChart } from "../../../apis/sprint";
import { CartesianGrid, Legend, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";


function ChartSprintForm(props: ModalProps) {
    const { token, isTokenValid } = useContext(TokenContext);
    const [ sprint, setSprint ] = useState<SprintChart>();
    const [ chartData, setChartData ] = useState<{ date: string; tasksRemaining: number | null; tasksIdeal: number; }[]>([]);

    useEffect(() => {
        if (isTokenValid()) {
            const fetchData = async () => {
                try {
                    if (props.id) {
                        const response = await GetSprintChart(token, props.id);
                        setSprint(response);

                        const startDate = new Date(response.date_started);
                        const endDate = new Date(response.date_finished);
                        const numDays = (endDate.getTime() - startDate.getTime()) / (1000 * 3600 * 24);
                        const decrementPerDay = response.total_tasks_count / numDays;
                        const newChartData = [];

                        for (let i = 0; i <= numDays; i++) {
                            const currentDate = new Date(startDate);
                            currentDate.setDate(startDate.getDate() + i);
                            const formattedDate = currentDate.toISOString().split('T')[0];
                            const localDate = currentDate.toLocaleDateString("cs-CZ");
                            const progressEntry = response.daily_progress.find(entry => entry.date === formattedDate);
                            const tasksRemaining = progressEntry ? progressEntry.tasks_remaining : null;

                            newChartData.push({
                                date: localDate,
                                tasksRemaining: tasksRemaining,
                                tasksIdeal: Math.max(0, response.total_tasks_count - decrementPerDay * i)
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
                <h1>Sprint Statistics</h1>
                <Row className="mb-4">
                    <Col md={4} className="mb-3">
                        <Col className="bg-light rounded p-2">
                            <p>Total:</p>
                            <h3 className="text-center"><b>{sprint?.total_tasks_count}</b></h3>
                        </Col>
                    </Col>
                    <Col md={4} className="mb-3">
                        <Col className="bg-light rounded p-2">
                            <p>Done:</p>
                            <h3 className="text-center"><b>{sprint?.total_tasks_finished_count}</b></h3>
                        </Col>
                    </Col>
                    <Col md={4} className="mb-3">
                        <Col className="bg-light rounded p-2">
                            <p>Remaining:</p>
                            <h3 className="text-center"><b>{sprint?.total_tasks_unfinished_count}</b></h3>
                        </Col>
                    </Col>
                </Row>
                <Row>
                    <Col>
                        <h2>Burndown Chart</h2>
                    </Col>
                </Row>
                <ResponsiveContainer width="100%" height={400}>
                    <LineChart width={600} height={300} data={chartData} margin={{ top: 10, right: 30, left: 30, bottom: 40 }}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="date" name="Days" label={{ value: 'Days', position: 'insideBottomCenter', dy: 30 }}/>
                        <YAxis name="Task Count" label={{ value: 'Task Count', angle: -90, position: 'insideLeftCenter', dx: -10 }}/>
                        <Tooltip contentStyle={{ fontSize: '14px' }}/>
                        <Legend verticalAlign="top"  wrapperStyle={{ paddingBottom: '30px' }}/>
                        <Line type="monotone" name="Actual Tasks Remaining" isAnimationActive={false} dataKey="tasksRemaining" stroke="#0d6efd" strokeWidth={2}/>
                        <Line type="linear" name="Ideal Tasks Remaining" isAnimationActive={false} dataKey="tasksIdeal" stroke="#28a745" strokeWidth={2} dot={false}/>
                    </LineChart>
                </ResponsiveContainer>
            </Modal.Body>
        </Modal>
        </>
    );
}

export default ChartSprintForm;
