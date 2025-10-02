 Company Distribution
Rank	Company	Podium Floor	2nd Floor	Tower B	Total
1	Western Union	468	84	115	667
2	Visitor	18	1	-	19
3	CLR Facility Services Pvt.Ltd.	12	-	6	18
4	Poona Security India Pvt Ltd	8	1	3	12
5	Temp Badge	4	-	-	4
6	CBRE	2	1	1	4
7	Osource India Pvt Ltd	2	2	-	4
8	Vedant Enterprises Pvt. Ltd	1	-	1	2
9	Tea Point	1	-	-	1

in table add total : Podium Floor total, 2nd Floor totla , 	Tower B totalm and all totals ok 


import React, { useState, useMemo, useEffect } from "react";
import { Container, Row, Col, Card, Table, Badge, Modal, Button, Nav, Collapse } from "react-bootstrap";
import { FaBuilding, FaUsers, FaChartBar, FaChartPie, FaHouse, FaBars } from 'react-icons/fa6';

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

  const getBuildingFromZone = (zone) => {
    if (!zone) return null;
    const z = String(zone).toLowerCase();
    if (z.includes("red zone") || z.includes("yellow zone") || z.includes("green zone") || z.includes("reception") || z.includes("reception area") || z.includes("orange zone") 
        || z.includes("east outdoor area") || z.includes("west outdoor area") || z.includes("assembly area")  ) return "Podium Floor";
    if (z.includes("2nd")) return "2nd Floor";
    if (z.includes("tower b")) return "Tower B";
    return null;
  };
//   || z.includes(" "))

  const normalizeCompany = (raw) => {
    if (!raw) return 'Unknown';
    const orig = String(raw).trim();
    const s = orig.toLowerCase().replace(/[.,()\/\-]/g, ' ').replace(/\s+/g, ' ').trim();
    if (/\bpoona\b/.test(s) || /\bpoona security\b/.test(s)) return 'Poona Security India Pvt Ltd';
    if (/\bwestern union\b/.test(s) || /\bwu\b/.test(s)) return 'Western Union';
    if (/\bvedant\b/.test(s)) return 'Vedant Enterprises Pvt. Ltd';
    if (/\bosource\b/.test(s)) return 'Osource India Pvt Ltd';
    if (/\bcbre\b/.test(s)) return 'CBRE';
    return orig || 'Unknown';
  };

  const getCanonicalCompany = (r) => {
    const rawCompany = (r.CompanyName || '').toString().trim();
    const pt = (r.PersonnelType || '').toString().trim().toLowerCase();
    const s = rawCompany.toLowerCase();
    if (s && /\bcbre\b/.test(s) && (/\bclr\b/.test(s) || /\bfacilit/i.test(s))) return 'CLR Facility Services Pvt.Ltd.';
    if (!rawCompany) {
      if (pt.includes('contractor')) return 'CBRE';
      if (pt.includes('property') || pt.includes('management')) return 'CLR Facility Services Pvt.Ltd.';
      if (pt === 'employee') return 'Western Union';
      if (pt.includes('visitor')) return 'Visitor';
      if (pt.includes('temp')) return 'Temp Badge';
      return 'Unknown';
    }
    return normalizeCompany(rawCompany);
  };

  const companyData = useMemo(() => {
    const companies = {};
    let totalCount = 0;
    const buildingTotals = { "Podium Floor": 0, "2nd Floor": 0, "Tower B": 0 };

    Object.values(detailsData || {}).forEach((zoneEmployees) => {
      if (Array.isArray(zoneEmployees)) {
        zoneEmployees.forEach((employee) => {
          const companyName = getCanonicalCompany(employee);
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

  const renderTabContent = () => {
    if (activeTab === "companyAnalytics") {
      return (
        <>
          <Row className="mb-4">
            {["Podium Floor", "2nd Floor", "Tower B"].map((floor, idx) => (
              <Col md={4} key={floor} className="mb-3">
                <Card
                  className="h-100 shadow-sm border-0 cursor-pointer"
                  style={{ background: `linear-gradient(135deg, #3a8dff, #6cc1ff)`, color: "#fff", transition: "transform 0.2s" }}
                  onClick={() => handleBuildingClick(floor)}
                  onMouseOver={e => e.currentTarget.style.transform = "scale(1.05)"}
                  onMouseOut={e => e.currentTarget.style.transform = "scale(1)"}
                >
                  <Card.Body className="text-center py-5">
                    <FaUsers className="fs-1 mb-2" />
                    <h3>{companyData?.buildingTotals?.[floor] || 0}</h3>
                    <p className="mb-0">{floor} Occupancy</p>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>

          <Row>
            <Col>
              <Card className="shadow-sm border-0">
                <Card.Header className="bg-primary text-white">
                  <h5 className="mb-0"><FaChartBar className="me-2" /> Company Distribution</h5>
                </Card.Header>
                <Card.Body className="p-0">
                  <div className="table-responsive">
                    
                    <Table hover className="mb-0">
                      <thead className="table-light">
                        <tr>
                          <th>Rank</th>
                          <th>Company</th>
                          <th>Podium Floor</th>
                          <th>2nd Floor</th>
                          <th>Tower B</th>
                          <th>Total</th>
                        </tr>
                      </thead>
                      <tbody>
                        {(filteredCompanies || []).map((company, index) => (
                          <tr key={company?.name || index}>
                            <td>
                              <Badge bg={index < 3 ? "warning" : "secondary"}>{index + 1}</Badge>
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
                             <td><Badge bg="light" text="dark">{company?.total || 0}</Badge></td>
                          </tr>
                        ))}
                      </tbody>
                    </Table>
                  </div>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </>
      );
    } else if (activeTab === "futureTab") {
      return (
        <Card className="shadow-sm p-4 border-0">
          <h5><FaChartPie className="me-2 text-primary" /> Future Analytics</h5>
          <p className="text-secondary">This area is reserved for future analytics and dashboard metrics.</p>
        </Card>
      );
    }
  };

  return (
    <Container fluid style={{ minHeight: "100vh", background: "#f0f4f8" }}>
      <Row>
        {/* Sidebar */}
        <Col xs={sidebarOpen ? 2 : 1} className="bg-white shadow-sm p-3 position-sticky" style={{ top: 0, minHeight: "100vh", transition: "width 0.3s" }}>
          <div className="d-flex justify-content-between align-items-center mb-4">
            {sidebarOpen && <h5 className="text-primary mb-0"><FaHouse className="me-2" />Dashboard</h5>}
            <FaBars className="cursor-pointer" onClick={() => setSidebarOpen(!sidebarOpen)} />
          </div>
          {sidebarOpen && <div className="mb-4 text-center text-dark fw-bold">{currentTime.toLocaleTimeString()}</div>}
          <Nav className="flex-column">
            <Nav.Link
              active={activeTab === "companyAnalytics"}
              onClick={() => setActiveTab("companyAnalytics")}
              className="mb-2 rounded px-2 py-1"
            >
              <FaBuilding className="me-2" /> {sidebarOpen && "Company Analytics"}
            </Nav.Link>
            <Nav.Link
              active={activeTab === "futureTab"}
              onClick={() => setActiveTab("futureTab")}
              className="mb-2 rounded px-2 py-1"
            >
              <FaChartPie className="me-2" /> {sidebarOpen && "Future Analytics"}
            </Nav.Link>
          </Nav>
        </Col>

        {/* Main Content */}
        <Col xs={sidebarOpen ? 10 : 11} className="p-4">
          <h2 className="text-dark mb-4">{activeTab === "companyAnalytics" ? "Company Analytics Dashboard" : "Future Analytics"}</h2>
          {renderTabContent()}
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
