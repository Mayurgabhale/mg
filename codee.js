i want to change graph bg color
    
<Row className="mb-4">
                        <Col>
                            <Card className="shadow-sm border-0 p-3">
                                <h5 className="mb-3">Company Occupancy Line Graph</h5>
                                <ResponsiveContainer width="100%" height={400}>
                                    <LineChart data={chartData}>
                                        <CartesianGrid strokeDasharray="3 3" />
                                        <XAxis dataKey="name" angle={-30} textAnchor="end" height={100} />
                                        <YAxis />
                                        <Tooltip />
                                        <Legend />
                                        <Line type="monotone" dataKey="podium" stroke="#8884d8" name="Podium Floor" />
                                        <Line type="monotone" dataKey="second" stroke="#82ca9d" name="2nd Floor" />
                                        <Line type="monotone" dataKey="towerB" stroke="#ffc658" name="Tower B" />
                                        <Line type="monotone" dataKey="total" stroke="#ff7300" name="Total" />
                                    </LineChart>
                                </ResponsiveContainer>
                            </Card>
                        </Col>

                        
                    </Row>
