import React, { useState, useMemo, useEffect } from "react";
import { Container, Row, Col, Card, Table, Badge, Modal, Button, Nav } from "react-bootstrap";
import { FaBuilding, FaUsers, FaChartPie, FaHouse, FaBars } from 'react-icons/fa6';
import XLSX from "xlsx-js-style";
import { saveAs } from "file-saver";
import ExcelJS from "exceljs";

const CompanySummary = ({ detailsData = {} }) => {
    const [selectedBuilding, setSelectedBuilding] = useState("all");
    const [showModal, setShowModal] = useState(false);
    const [modalTitle, setModalTitle] = useState("");
    const [modalRows, setModalRows] = useState([]);
    const [activeTab, setActiveTab] = useState("companyAnalytics");
    const [currentTime, setCurrentTime] = useState(new Date());
    const [sidebarOpen, setSidebarOpen] = useState(true);

    // Clock
    useEffect(() => {
        const timer = setInterval(() => setCurrentTime(new Date()), 1000);
        return () => clearInterval(timer);
    }, []);

    // Extract and process company data
    const companyData = useMemo(() => {
        const companies = {};
        let totalCount = 0;
        const buildingTotals = { "Podium Floor": 0, "2nd Floor": 0, "Tower B": 0 };

        Object.values(detailsData || {}).forEach((zoneEmployees) => {
            if (Array.isArray(zoneEmployees)) {
                zoneEmployees.forEach((employee) => {
                    const companyName = employee.CompanyName || "Unknown";
                    const building = employee.zone?.includes("2nd") ? "2nd Floor" : "Podium Floor";
                    if (!companies[companyName]) companies[companyName] = { name: companyName, total: 0, byBuilding: { "Podium Floor": 0, "2nd Floor": 0, "Tower B": 0 }, employees: [] };
                    companies[companyName].total++;
                    companies[companyName].byBuilding[building]++;
                    companies[companyName].employees.push(employee);
                    totalCount++;
                    buildingTotals[building]++;
                });
            }
        });

        return { companies: Object.values(companies), totalCount, buildingTotals };
    }, [detailsData]);

    const filteredCompanies = useMemo(() => {
        if (selectedBuilding === "all") return companyData?.companies || [];
        return companyData?.companies.filter(c => c.byBuilding[selectedBuilding] > 0);
    }, [companyData, selectedBuilding]);

    const openModalWithRows = (title, rows = []) => {
        setModalTitle(title);
        setModalRows(rows);
        setShowModal(true);
    };

    const handleCompanyClick = (company) => {
        const rows = company.employees.map((r, i) => ({ idx: i + 1, name: r.Name, employeeId: r.EmployeeID, personnelType: r.PersonnelType, zone: r.zone }));
        openModalWithRows(company.name, rows);
    };

    const handleBuildingClick = (buildingName) => {
        const rows = [];
        companyData.companies.forEach(c => {
            c.employees.forEach((r, i) => {
                if (r.zone?.includes(buildingName.split(' ')[0])) rows.push({ idx: rows.length + 1, name: r.Name, employeeId: r.EmployeeID, personnelType: r.PersonnelType, company: c.name, zone: r.zone });
            });
        });
        openModalWithRows(buildingName + " — Occupants", rows);
    };

    const renderTabContent = () => {
        if (activeTab === "companyAnalytics") {
            return (
                <>
                    {/* Building Occupancy Cards */}
                    <Row className="mb-3">
                        {["Podium Floor", "2nd Floor", "Tower B"].map((floor) => (
                            <Col md={4} key={floor}>
                                <Card className="shadow-sm mb-3 cursor-pointer text-white" style={{ background: "linear-gradient(135deg,#3a8dff,#6cc1ff)", transition: "transform 0.2s" }} onClick={() => handleBuildingClick(floor)} onMouseOver={e => e.currentTarget.style.transform = "scale(1.05)"} onMouseOut={e => e.currentTarget.style.transform = "scale(1)"}>
                                    <Card.Body className="text-center py-4">
                                        <FaUsers className="fs-1 mb-2" />
                                        <h3>{companyData.buildingTotals[floor] || 0}</h3>
                                        <p className="mb-0">{floor} Occupancy</p>
                                    </Card.Body>
                                </Card>
                            </Col>
                        ))}
                    </Row>

                    {/* Company Table */}
                    <Card className="shadow-sm mb-3">
                        <Card.Header className="bg-primary text-white d-flex justify-content-between align-items-center">
                            <h5 className="mb-0">Company Distribution</h5>
                            <Button variant="light" onClick={() => alert("Export to Excel")}>Export</Button>
                        </Card.Header>
                        <Card.Body className="p-0">
                            <div className="table-responsive">
                                <Table hover striped className="mb-0">
                                    <thead>
                                        <tr style={{ background: "#f0f4f8" }}>
                                            <th>Rank</th>
                                            <th>Company</th>
                                            <th>Podium Floor</th>
                                            <th>2nd Floor</th>
                                            <th>Tower B</th>
                                            <th>Total</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {filteredCompanies.map((company, idx) => (
                                            <tr key={idx}>
                                                <td><Badge bg="secondary">{idx + 1}</Badge></td>
                                                <td style={{ cursor: "pointer", textDecoration: "underline" }} onClick={() => handleCompanyClick(company)}>{company.name}</td>
                                                {["Podium Floor", "2nd Floor", "Tower B"].map((floor) => (
                                                    <td key={floor}>{company.byBuilding[floor] || "-"}</td>
                                                ))}
                                                <td><Badge bg="info">{company.total}</Badge></td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </Table>
                            </div>
                        </Card.Body>
                    </Card>
                </>
            );
        } else {
            return (
                <Card className="shadow-sm p-4">
                    <h5><FaChartPie className="me-2 text-primary" /> Future Analytics</h5>
                    <p className="text-secondary">Coming soon...</p>
                </Card>
            );
        }
    };

    return (
        <Container fluid style={{ minHeight: "100vh", background: "#f0f4f8" }}>
            <Row>
                {/* Sidebar */}
                <Col xs={sidebarOpen ? 2 : 1} className="bg-light shadow-sm p-3 position-sticky" style={{ minHeight: "100vh", transition: "width 0.3s" }}>
                    <div className="d-flex justify-content-between align-items-center mb-4">
                        {sidebarOpen && <h5 className="text-primary"><FaHouse className="me-2" /> Dashboard</h5>}
                        <FaBars className="cursor-pointer text-secondary" onClick={() => setSidebarOpen(!sidebarOpen)} />
                    </div>
                    {sidebarOpen && <Card className="mb-4 text-center text-white" style={{ background: "linear-gradient(90deg,#3a8dff,#6cc1ff)", borderRadius: "0.8rem" }}>
                        <Card.Body>
                            <div>Current Time</div>
                            <div className="fw-bold fs-5">{currentTime.toLocaleTimeString()}</div>
                        </Card.Body>
                    </Card>}
                    <Nav className="flex-column">
                        <Nav.Link active={activeTab === "companyAnalytics"} onClick={() => setActiveTab("companyAnalytics")} className={`mb-2 px-3 py-2 rounded shadow-sm ${activeTab === "companyAnalytics" ? "bg-primary text-white" : "bg-white text-dark"}`}> <FaBuilding className="me-2"/> {sidebarOpen && "Company Analytics"} </Nav.Link>
                        <Nav.Link active={activeTab === "futureTab"} onClick={() => setActiveTab("futureTab")} className={`mb-2 px-3 py-2 rounded shadow-sm ${activeTab === "futureTab" ? "bg-primary text-white" : "bg-white text-dark"}`}> <FaChartPie className="me-2"/> {sidebarOpen && "Future Analytics"} </Nav.Link>
                    </Nav>
                </Col>

                {/* Main Content */}
                <Col xs={sidebarOpen ? 10 : 11} className="p-4">
                    <h2 className="mb-4">{activeTab === "companyAnalytics" ? "Company Analytics Dashboard" : "Future Analytics"}</h2>
                    {renderTabContent()}
                </Col>
            </Row>
        </Container>
    );
};

export default CompanySummary;