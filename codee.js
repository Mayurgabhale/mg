// CompanySummary.jsx
import React, { useState, useMemo } from "react";
import { Container, Row, Col, Card, Table, Badge, Modal, Button } from "react-bootstrap";
import { FaTrophy, FaMedal, FaChartBar, FaBuilding, FaUsers } from "react-icons/fa6";

const CompanySummary = ({
  detailsData = {},
  personnelBreakdown = [],
  zoneBreakdown = [],
  floorBreakdown = []
}) => {
  const [selectedBuilding, setSelectedBuilding] = useState("all");
  const [showModal, setShowModal] = useState(false);
  const [modalTitle, setModalTitle] = useState("");
  const [modalRows, setModalRows] = useState([]);

  const getBuildingFromZone = (zone) => {
    if (!zone) return null;
    const z = String(zone).toLowerCase();
    if (z.includes("red zone") || z.includes("yellow zone") || z.includes("green zone") || z.includes("reception")) {
      return "Podium Floor";
    }
    if (z.includes("2nd")) return "2nd Floor";
    if (z.includes("tower b")) return "Tower B";
    return null;
  };

  const companyData = useMemo(() => {
    const companies = {};
    let totalCount = 0;
    const buildingTotals = { "Podium Floor": 0, "2nd Floor": 0, "Tower B": 0 };

    Object.values(detailsData || {}).forEach((zoneEmployees) => {
      if (Array.isArray(zoneEmployees)) {
        zoneEmployees.forEach((employee) => {
          const companyName = employee?.CompanyName || "Unknown Company";
          const building = getBuildingFromZone(employee?.zone);
          if (!building) return;

          if (!companies[companyName]) {
            companies[companyName] = {
              name: companyName,
              total: 0,
              byBuilding: { "Podium Floor": 0, "2nd Floor": 0, "Tower B": 0 },
              employees: [],
              locations: new Set()
            };
          }

          companies[companyName].total++;
          companies[companyName].byBuilding[building]++;
          companies[companyName].employees.push(employee);
          if (employee?.PrimaryLocation) companies[companyName].locations.add(employee.PrimaryLocation);

          totalCount++;
          buildingTotals[building]++;
        });
      }
    });

    const companyArray = Object.values(companies)
      .map((company) => ({
        ...company,
        locations: Array.from(company.locations || []),
        percentage: totalCount > 0 ? ((company.total / totalCount) * 100).toFixed(1) : "0.0"
      }))
      .sort((a, b) => (b.total || 0) - (a.total || 0));

    return { companies: companyArray, totalCount, buildingTotals };
  }, [detailsData]);

  const filteredCompanies = useMemo(() => {
    if (selectedBuilding === "all") return companyData?.companies || [];
    return companyData?.companies.filter((c) => (c.byBuilding?.[selectedBuilding] || 0) > 0);
  }, [companyData?.companies, selectedBuilding]);

  const getPodiumWinners = () => {
    const podiumCompanies = (companyData?.companies || [])
      .filter((c) => (c.byBuilding?.["Podium Floor"] || 0) > 0)
      .sort((a, b) => (b.byBuilding?.["Podium Floor"] || 0) - (a.byBuilding?.["Podium Floor"] || 0))
      .slice(0, 3);

    return podiumCompanies.map((c, idx) => ({
      name: c?.name || "Unknown",
      count: c?.byBuilding?.["Podium Floor"] || 0,
      position: idx === 0 ? "1st" : idx === 1 ? "2nd" : "3rd",
      icon: idx === 0 ? FaTrophy : FaMedal,
      color: idx === 0 ? "#ffd700" : idx === 1 ? "#c0c0c0" : "#cd7f32"
    }));
  };

  const podiumWinners = getPodiumWinners();

  const openModalWithRows = (title, rows = []) => {
    setModalTitle(title || "");
    setModalRows(rows || []);
    setShowModal(true);
  };

  const handleCompanyClick = (company) => {
    const rows = (company?.employees || []).map((r, i) => ({
      idx: i + 1,
      name: r?.ObjectName1 || r?.Name || "—",
      employeeId: r?.EmployeeID || "",
      cardNumber: r?.CardNumber || "",
      personnelType: r?.PersonnelType || "",
      primaryLocation: r?.PrimaryLocation || "",
      zone: r?.zone || ""
    }));
    openModalWithRows(company?.name || "Company Details", rows);
  };

  const handleBuildingClick = (buildingName) => {
    const allEmployees = [];
    (companyData?.companies || []).forEach((c) => {
      (c.employees || []).forEach((r) => {
        const b = getBuildingFromZone(r?.zone);
        if (b === buildingName) {
          allEmployees.push({
            name: r?.ObjectName1 || r?.Name || "—",
            employeeId: r?.EmployeeID || "",
            cardNumber: r?.CardNumber || "",
            personnelType: r?.PersonnelType || "",
            primaryLocation: r?.PrimaryLocation || "",
            company: r?.CompanyName || "Unknown Company",
            zone: r?.zone || ""
          });
        }
      });
    });

    allEmployees.sort((a, b) => {
      if ((a.company || "") !== (b.company || "")) return (a.company || "").localeCompare(b.company || "");
      return (a.name || "").localeCompare(b.name || "");
    });

    const rows = allEmployees.map((r, i) => ({ idx: i + 1, ...r }));
    openModalWithRows(`${buildingName} — Occupants`, rows);
  };

  const handleCompanyBuildingClick = (company, buildingName) => {
    const rows = (company?.employees || [])
      .filter((r) => getBuildingFromZone(r?.zone) === buildingName)
      .map((r, i) => ({
        idx: i + 1,
        name: r?.ObjectName1 || r?.Name || "—",
        employeeId: r?.EmployeeID || "",
        cardNumber: r?.CardNumber || "",
        personnelType: r?.PersonnelType || "",
        primaryLocation: r?.PrimaryLocation || "",
        zone: r?.zone || ""
      }));

    openModalWithRows(`${company?.name || "Company"} — ${buildingName}`, rows);
  };

  return (
    <Container fluid className="company-summary-dashboard">
      {/* Header */}
      <Row className="mb-4">
        <Col>
          <div className="d-flex justify-content-between align-items-center">
            <div>
              <h2 className="mb-1 text-dark">
                <FaBuilding className="me-2 text-primary" />
                Company Analytics Dashboard
              </h2>
              <p className="text-secondary mb-0">Real-time company presence and distribution</p>
            </div>
            <Badge bg="primary" className="fs-6">
              <FaUsers className="me-1" />
              Total: {companyData?.totalCount || 0} People
            </Badge>
          </div>
        </Col>
      </Row>

      {/* Stats */}
      <Row className="mb-4">
        {["Podium Floor", "2nd Floor", "Tower B"].map((floor) => (
          <Col md={4} key={floor}>
            <Card
              className="h-100 shadow-sm cursor-pointer"
              role="button"
              onClick={() => handleBuildingClick(floor)}
            >
              <Card.Body className="text-center">
                <FaUsers className="fs-1 mb-2 text-primary" />
                <h4 className="text-dark">{companyData?.buildingTotals?.[floor] || 0}</h4>
                <p className="mb-0 text-secondary">{floor} Occupancy (click to view)</p>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>

      {/* Company Table */}
      <Row>
        <Col>
          <Card className="shadow-sm">
            <Card.Header className="bg-light">
              <h4 className="mb-0 text-dark">
                <FaChartBar className="me-2 text-primary" />
                Company-wise Distribution
              </h4>
            </Card.Header>
            <Card.Body className="p-0">
              <div className="table-responsive">
                <Table hover className="mb-0">
                  <thead className="table-light">
                    <tr>
                      <th>Rank</th>
                      <th>Company</th>
                      <th>Total</th>
                      <th>Podium Floor</th>
                      <th>2nd Floor</th>
                      <th>Tower B</th>
                    </tr>
                  </thead>
                  <tbody>
                    {(filteredCompanies || []).map((company, index) => (
                      <tr key={company?.name || index}>
                        <td>
                          <Badge bg={index < 3 ? "warning" : "secondary"}>#{index + 1}</Badge>
                        </td>
                        <td
                          role="button"
                          onClick={() => handleCompanyClick(company)}
                          style={{ cursor: "pointer", textDecoration: "underline", textDecorationColor: "rgba(0,123,255,0.5)" }}
                        >
                          {company?.name}
                        </td>
                        <td>
                          <Badge bg="light" text="dark">{company?.total || 0}</Badge>
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
                      </tr>
                    ))}
                  </tbody>
                  <tfoot>
                    <tr className="fw-bold table-light">
                      <td colSpan={2} className="text-end">Totals:</td>
                      <td><Badge bg="light" text="dark">{companyData?.totalCount || 0}</Badge></td>
                      {["Podium Floor", "2nd Floor", "Tower B"].map((floor) => (
                        <td key={floor}><Badge bg="light" text="dark">{companyData?.buildingTotals?.[floor] || 0}</Badge></td>
                      ))}
                    </tr>
                  </tfoot>
                </Table>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Modal */}
      <Modal show={showModal} onHide={() => setShowModal(false)} size="lg" centered scrollable>
        <Modal.Header closeButton>
          <Modal.Title>{modalTitle}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {modalRows.length > 0 ? (
            <div className="table-responsive">
              <Table striped bordered hover size="sm">
                <thead>
                  <tr>
                    {modalRows[0].company && <th>Company</th>}
                    <th>Sr</th>
                    <th>Name</th>
                    <th>Employee ID</th>
                    <th>Card</th>
                    <th>Personnel Type</th>
                    <th>Primary Location</th>
                    <th>Zone</th>
                  </tr>
                </thead>
                <tbody>
                  {modalRows.map((r, i) => (
                    <tr key={`${r.employeeId || r.idx}-${i}`}>
                      {r.company && <td>{r.company}</td>}
                      <td>{r.idx}</td>
                      <td>{r.name}</td>
                      <td>{r.employeeId || "-"}</td>
                      <td>{r.cardNumber || "-"}</td>
                      <td>{r.personnelType || "-"}</td>
                      <td>{r.primaryLocation || "-"}</td>
                      <td>{r.zone || "-"}</td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </div>
          ) : (
            <div className="text-center text-muted py-4">No records to display.</div>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>Close</Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default CompanySummary;