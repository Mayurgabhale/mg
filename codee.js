add export to excle button, 
<div className="table-responsive">

                            <Table striped bordered hover size="sm">
                                <thead>
                                    <tr>
                                        <th>Sr</th>
                                        {modalRows[0].company && <th>Company</th>}
                                        <th>Name</th>
                                        <th>Employee ID</th>
                                        <th>Personnel Type</th>
                                        <th>Zone</th>
                                    </tr>
                                </thead>
                                <tbody>


                                    {modalRows.map((r, i) => (
                                        <tr key={`${r.employeeId || r.idx}-${i}`}>
                                            <td>{r.idx}</td>
                                            {r.company && <td>{r.company}</td>}
                                            <td>{r.name}</td>
                                            <td>{r.employeeId || "-"}</td>
                                            <td>{r.personnelType || "-"}</td>
                                            <td>{r.zone || "-"}</td>
                                        </tr>
                                    ))}


                                </tbody>
                            </Table>


                        </div>
