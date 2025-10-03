if want to send this data, sent thid data  on sparph 11:00 am email, compnay email, to how to do this. 
   <div className="table-responsive">
                                        <Table hover className="mb-0" id="companyTable">
                                            <thead style={{ background: "#aacef2" }}>
                                                <tr>
                                                    <th style={{ background: "#2965cc", color: "#FFF" }}>Rank</th>
                                                    <th style={{ background: "#2965cc", color: "#FFF" }}>Company</th>
                                                    <th style={{ background: "#2965cc", color: "#FFF" }}>Podium Floor</th>
                                                    <th style={{ background: "#2965cc", color: "#FFF" }}>2nd Floor</th>
                                                    <th style={{ background: "#2965cc", color: "#FFF" }}>Tower B</th>
                                                    <th style={{ background: "#2965cc", color: "#FFF" }}>Total</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {(filteredCompanies || []).map((company, index) => (
                                                    <tr key={company?.name || index}>
                                                        <td>
                                                            <Badge bg="light" text="dark">{index + 1}</Badge>
                                                        </td>
                                                        <td
                                                            onClick={() => handleCompanyClick(company)}
                                                            style={{ cursor: "pointer", textDecoration: "underline" }}
                                                        >
                                                            {company?.name}
                                                        </td>
                                                        {["Podium Floor", "2nd Floor", "Tower B"].map((floor) => (
                                                            <td key={floor}>
                                                                {company?.byBuilding?.[floor] > 0 ? (
                                                                    <Badge
                                                                        bg="primary"
                                                                        role="button"
                                                                        style={{ cursor: "pointer" }}
                                                                        onClick={() => handleCompanyBuildingClick(company, floor)}
                                                                    >
                                                                        {company?.byBuilding?.[floor]}
                                                                    </Badge>
                                                                ) : "-"}
                                                            </td>
                                                        ))}
                                                        <td>
                                                            <Badge bg="light" text="dark">{company?.total || 0}</Badge>
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                            <tfoot>
                                                <tr className="fw-bold" style={{ background: "#aacef2" }}>
                                                    <td colSpan={2} className="text-end">Totals:</td>
                                                    <td>{companyData?.buildingTotals?.["Podium Floor"] || 0}</td>
                                                    <td>{companyData?.buildingTotals?.["2nd Floor"] || 0}</td>
                                                    <td>{companyData?.buildingTotals?.["Tower B"] || 0}</td>
                                                    <td>{companyData?.totalCount || 0}</td>
                                                </tr>
                                            </tfoot>

                                        </Table>
                                        <div className="d-flex justify-content-between align-items-center" style={{ background: "#FFF" }}>
                                            <h5 className="mb-0">Company Distribution</h5>
                                            <Button variant="success" onClick={exportToExcel}>
                                                Export to Excel
                                            </Button>
                                        </div>
                                    </div>
