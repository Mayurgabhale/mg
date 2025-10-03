i want to export this table in excle sheet, with same desing ok 
<Table hover className="mb-0">
                                            <thead bg="#aacef2" style={{ background: "#aacef2" }}>
                                                <tr style={{ background: "#aacef2" }}>
                                                    <th style={{ background: "#2965cc",color:"#FFF"}} >Rank</th>
                                                    <th style={{ background: "#2965cc",color:"#FFF" }} >Company</th>
                                                    <th style={{ background: "#2965cc",color:"#FFF" }} >Podium Floor</th>
                                                    <th style={{ background: "#2965cc",color:"#FFF" }} >2nd Floor</th>
                                                    <th style={{ background: "#2965cc",color:"#FFF" }} >Tower B</th>
                                                    <th style={{ background: "#2965cc",color:"#FFF" }} >Total</th>
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
                                                <tr className="fw-bold " background="#aacef2" style={{ background: "#aacef2" }}>
                                                    <td colSpan={2} className="text-end" style={{ background: "" }}>Totals:</td>
                                                    <td>{companyData?.buildingTotals?.["Podium Floor"] || 0}</td>
                                                    <td>{companyData?.buildingTotals?.["2nd Floor"] || 0}</td>
                                                    <td>{companyData?.buildingTotals?.["Tower B"] || 0}</td>
                                                    <td>{companyData?.totalCount || 0}</td>
                                                </tr>
                                            </tfoot>
                                        </Table>
