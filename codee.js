Company-wise Distribution
Rank	Company	Total	Podium Floor	2nd Floor	Tower B
#1	WU Srvcs India Private Ltd	531	310	98	123
#2	WU Technology Engineering Services Private Limited	97	75	2	20
#3	Unknown Company	22	21	1	-
#4	CBRE - CLR Facility Services Pvt.Ltd.	14	8	-	6
#5	Poona Security India Pvt. Ltd	5	2	-	3
#6	Poona Security India Pvt.Ltd	3	3	-	-
#7	CBRE	3	2	-	1
#8	Osource India Pvt Ltd (HCT)	3	-	3	-
#9	Western Union, LLC	2	2	-	-
#10	CBRE (HCT)	2	1	-	1
#11	Vedant Enterprises Pvt. Ltd	1	1	-	-
#12	Tea Point	1	1	-	-
#13	Vedant Enterprises Pvt. Ltd.	1	-	-	1
#14	CBRE - CLR Facility Servises Pvt Ltd.	1	-	-	1
#15	Poona Security India Pvt. Ltd.	1	1	-	-
#16	Osource India Pvt Ltd.	1	1	-	-

know in this one compnay name are different different formt ok 
see WU Srvcs India Private Ltd and this same WU Technology Engineering Services Private Limited
and Poona Security India Pvt. ,Poona Security India Pvt.Ltd, Poona Security India Pvt. Ltd. these are all one 
and if unknow then chek ther per
compnay name is   "CompanyName": null, null then check there "PersonnelType": "Temp Badge",
  then add compnay name like CompanyName: Temp Badge OK LIKE 
FOR COMNAY NAME IS NULL THE THEN CHEKC THER PERSONNEL TYPE OK 
  CLR Facility Services Pvt.Ltd.	27
	Osource India Pvt Ltd	4
  Poona Security India Pvt Ltd	30
	Tea Point	1
	Temp Badge	5
	Vedant Enterprises Pvt. Ltd	5
	Visitor	42
	Western Union	914
*******************'
    


// CompanySummary.jsx
import React, { useState, useMemo } from "react";
import { Container, Row, Col, Card, Table, Badge, Modal, Button, Nav } from "react-bootstrap";
import { FaTrophy, FaMedal, FaChartBar, FaBuilding, FaUsers, FaChartPie } from "react-icons/fa6";
import { FaHouse } from 'react-icons/fa6';
const CompanySummary = ({
  detailsData = {},
}) => {
  const [selectedBuilding, setSelectedBuilding] = useState("all");
  const [showModal, setShowModal] = useState(false);
  const [modalTitle, setModalTitle] = useState("");
  const [modalRows, setModalRows] = useState([]);
  const [activeTab, setActiveTab] = useState("companyAnalytics"); // manage multi-tab

  // --- Helper: map zone to building ---
  const getBuildingFromZone = (zone) => {
    if (!zone) return null;
    const z = String(zone).toLowerCase();
    if (z.includes("red zone") || z.includes("yellow zone") || z.includes("green zone") || z.includes("reception")) return "Podium Floor";
    if (z.includes("2nd")) return "2nd Floor";
    if (z.includes("tower b")) return "Tower B";
    return null;
  };

  // --- Process company data ---
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

  // --- Tab content components ---
  const renderTabContent = () => {
    if (activeTab === "companyAnalytics") {
      return (
        <>
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
        </>
      );
    } else if (activeTab === "futureTab") {
      return (
        <Card className="shadow-sm p-3">
          <h4><FaChartPie className="me-2 text-primary" />Future Tab Placeholder</h4>
          <p className="text-secondary">This area can be used for another dashboard or analytics.</p>
        </Card>
      );
    }
  };

  return (
    <Container fluid className="company-summary-dashboard" style={{ minHeight: "100vh" }}>
      <Row>
        {/* Sidebar */}
        <Col md={2} className="bg-light p-3 shadow-sm" style={{ minHeight: "100vh" }}>
          <h5 className="text-primary mb-4"><FaHouse className="me-2" />Dashboard</h5>
          <Nav className="flex-column">
            <Nav.Link
              active={activeTab === "companyAnalytics"}
              onClick={() => setActiveTab("companyAnalytics")}
            >
              <FaBuilding className="me-2" /> Company Analytics
            </Nav.Link>
            <Nav.Link
              active={activeTab === "futureTab"}
              onClick={() => setActiveTab("futureTab")}
            >
              <FaChartPie className="me-2" /> Future Tab
            </Nav.Link>
          </Nav>
        </Col>

        {/* Main Content */}
        <Col md={10} className="p-4">
          <h2 className="text-dark mb-4">{activeTab === "companyAnalytics" ? "Company Analytics Dashboard" : "Future Tab"}</h2>
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


reAD ALOC BELOW CODE THEN YOU UNDERSTND OK CAREFULLYUM 

// --- company name normalizer ---
  // keep it deterministic and conservative (only maps the families you listed)
  const normalizeCompany = (raw) => {
    if (!raw) return 'Unknown';
    // trim and collapse whitespace
    const orig = String(raw).trim();
    const s = orig
      .toLowerCase()
      // remove punctuation commonly causing variants
      .replace(/[.,()\/\-]/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();

    // Poona / Poona Security family
    if (/\bpoona\b/.test(s) || /\bpoona security\b/.test(s) || /\bpoona security india\b/.test(s)) {
      return 'Poona Security India Pvt Ltd';
    }

    // Western Union family (map many variants to single canonical)
    if (
      /\bwestern union\b/.test(s) ||
      /\bwesternunion\b/.test(s) ||
      /\bwu\b/.test(s) ||           // WU standalone
      /\bwufs\b/.test(s) ||         // WUFS variants
      /\bwu technology\b/.test(s) ||
      /\bwu srvcs\b/.test(s) ||
      /\bwestern union svs\b/.test(s) ||
      /\bwestern union processing\b/.test(s) ||
      /\bwestern union japan\b/.test(s) ||
      /\bwestern union, llc\b/.test(s)
    ) {
      return 'Western Union';
    }

    // Vedant family
    if (/\bvedant\b/.test(s)) {
      return 'Vedant Enterprises Pvt. Ltd';
    }

    // Osource family
    if (/\bosource\b/.test(s)) {
      return 'Osource India Pvt Ltd';
    }

    // CBRE family
    if (/\bcbre\b/.test(s)) {
      return 'CBRE';
    }

    // explicit Unknown canonical
    if (s === 'unknown' || s === '') return 'Unknown';

    // otherwise return the original trimmed string (preserve casing)
    return orig;
  };

  // helper: compute canonical company for a single detail row (same logic used by companyRows)
  const getCanonicalCompany = (r) => {
    const rawCompany = (r.CompanyName || '').toString().trim();
    const pt = (r.PersonnelType || '').toString().trim().toLowerCase();
    const s = rawCompany.toLowerCase();

    // If CompanyName contains CBRE and also mention of CLR or Facility -> CLR canonical
    if (s && /\bcbre\b/.test(s) && (/\bclr\b/.test(s) || /\bfacilit/i.test(s))) {
      return 'CLR Facility Services Pvt.Ltd.';
    }

    // If CompanyName is explicitly CBRE (or normalizes to CBRE)
    // and PersonnelType indicates Property Management -> map to CLR Facility Services
    if (s && (s === 'cbre' || normalizeCompany(rawCompany) === 'CBRE')) {
      if (pt.includes('property') || pt.includes('management') || pt === 'property management') {
        // NEW: map CBRE + Property Management -> CLR Facility Services (single canonical)
        return 'CLR Facility Services Pvt.Ltd.';
      }
      // otherwise keep as CBRE
      return 'CBRE';
    }

    // If CompanyName is blank -> use PersonnelType fallback rules
    if (!rawCompany) {
      if (pt.includes('contractor')) return 'CBRE';
      if (pt.includes('property') || pt.includes('management') || pt === 'property management') {
        // blank company but property-management -> CLR Facility Services (same canonical)
        return 'CLR Facility Services Pvt.Ltd.';
      }
      if (pt === 'employee') return 'Western Union';
      if (pt.includes('visitor')) return 'Visitor';
      if (pt.includes('temp')) return 'Temp Badge';
      return 'Unknown';
    }

    // otherwise use normalizeCompany for other families
    return normalizeCompany(rawCompany);
  };
