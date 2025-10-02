Here's a more professional and attractive dashboard UI with improved sidebar, clock, and overall design:

```jsx
// CompanySummary.jsx
import React, { useState, useMemo, useEffect } from "react";
import { Container, Row, Col, Card, Table, Badge, Modal, Button, Nav } from "react-bootstrap";
import { FaTrophy, FaMedal, FaChartBar, FaBuilding, FaUsers, FaChartPie, FaBars, FaTimes, FaClock, FaSearch, FaFilter } from "react-icons/fa6";
import { FaHouse } from 'react-icons/fa6';

const CompanySummary = ({
  detailsData = {},
}) => {
  const [selectedBuilding, setSelectedBuilding] = useState("all");
  const [showModal, setShowModal] = useState(false);
  const [modalTitle, setModalTitle] = useState("");
  const [modalRows, setModalRows] = useState([]);
  const [activeTab, setActiveTab] = useState("companyAnalytics");
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [searchTerm, setSearchTerm] = useState("");

  // Real-time clock
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Format time with AM/PM
  const formatTime = (date) => {
    return date.toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit',
      second: '2-digit',
      hour12: true 
    });
  };

  // Format date
  const formatDate = (date) => {
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  // --- Helper: map zone to building ---
  const getBuildingFromZone = (zone) => {
    if (!zone) return null;
    const z = String(zone).toLowerCase();
    if (z.includes("red zone") || z.includes("yellow zone") || z.includes("green zone") || z.includes("reception")) return "Podium Floor";
    if (z.includes("2nd")) return "2nd Floor";
    if (z.includes("tower b")) return "Tower B";
    return null;
  };

  const normalizeCompany = (raw) => {
    if (!raw) return 'Unknown';
    const orig = String(raw).trim();
    const s = orig
      .toLowerCase()
      .replace(/[.,()\/\-]/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();

    if (/\bpoona\b/.test(s) || /\bpoona security\b/.test(s)) return 'Poona Security India Pvt Ltd';
    if (/\bwestern union\b/.test(s) || /\bwu\b/.test(s) || /\bwu srvcs\b/.test(s) || /\bwu technology\b/.test(s)) return 'Western Union';
    if (/\bvedant\b/.test(s)) return 'Vedant Enterprises Pvt. Ltd';
    if (/\bosource\b/.test(s)) return 'Osource India Pvt Ltd';
    if (/\bcbre\b/.test(s)) return 'CBRE';
    if (s === 'unknown' || s === '') return 'Unknown';
    return orig;
  };

  const getCanonicalCompany = (r) => {
    const rawCompany = (r.CompanyName || '').toString().trim();
    const pt = (r.PersonnelType || '').toString().trim().toLowerCase();

    const s = rawCompany.toLowerCase();

    // CBRE + CLR or Facility -> CLR canonical
    if (s && /\bcbre\b/.test(s) && (/\bclr\b/.test(s) || /\bfacilit/i.test(s))) {
      return 'CLR Facility Services Pvt.Ltd.';
    }

    // blank company -> use PersonnelType fallback
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

  // --- Process company data ---
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

  // Filter companies based on search term
  const filteredCompanies = useMemo(() => {
    let companies = companyData?.companies || [];
    
    if (selectedBuilding !== "all") {
      companies = companies.filter((c) => (c.byBuilding?.[selectedBuilding] || 0) > 0);
    }
    
    if (searchTerm) {
      companies = companies.filter((c) => 
        c.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    return companies;
  }, [companyData?.companies, selectedBuilding, searchTerm]);

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

  // Building card colors
  const buildingColors = {
    "Podium Floor": "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
    "2nd Floor": "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)",
    "Tower B": "linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)"
  };

  // Rank badge colors
  const getRankBadge = (index) => {
    if (index === 0) return { bg: "warning", text: "dark", icon: <FaTrophy className="me-1" /> };
    if (index === 1) return { bg: "secondary", text: "light", icon: <FaMedal className="me-1" /> };
    if (index === 2) return { bg: "danger", text: "light", icon: <FaMedal className="me-1" /> };
    return { bg: "light", text: "dark", icon: null };
  };

  // --- Tab content components ---
  const renderTabContent = () => {
    if (activeTab === "companyAnalytics") {
      return (
        <>
          {/* KPI Cards */}
          <Row className="mb-4">
            {["Podium Floor", "2nd Floor", "Tower B"].map((floor) => (
              <Col md={4} key={floor} className="mb-3">
                <Card
                  className="h-100 shadow-lg cursor-pointer border-0 text-white"
                  role="button"
                  onClick={() => handleBuildingClick(floor)}
                  style={{ 
                    background: buildingColors[floor],
                    transition: 'transform 0.3s ease, box-shadow 0.3s ease'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-5px)';
                    e.currentTarget.style.boxShadow = '0 12px 25px rgba(0,0,0,0.2)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = '0 4px 15px rgba(0,0,0,0.1)';
                  }}
                >
                  <Card.Body className="text-center d-flex flex-column justify-content-center">
                    <FaUsers className="fs-1 mb-3 opacity-75" />
                    <h2 className="display-6 fw-bold mb-2">{companyData?.buildingTotals?.[floor] || 0}</h2>
                    <p className="mb-0 fs-6 opacity-90">{floor} Occupancy</p>
                    <small className="opacity-75">Click to view details</small>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>

          {/* Filters and Search */}
          <Row className="mb-3">
            <Col md={8}>
              <div className="d-flex gap-2 flex-wrap">
                <Button
                  variant={selectedBuilding === "all" ? "primary" : "outline-primary"}
                  onClick={() => setSelectedBuilding("all")}
                  size="sm"
                >
                  All Buildings
                </Button>
                {["Podium Floor", "2nd Floor", "Tower B"].map((building) => (
                  <Button
                    key={building}
                    variant={selectedBuilding === building ? "primary" : "outline-primary"}
                    onClick={() => setSelectedBuilding(building)}
                    size="sm"
                  >
                    {building}
                  </Button>
                ))}
              </div>
            </Col>
            <Col md={4}>
              <div className="position-relative">
                <FaSearch className="position-absolute top-50 start-0 translate-middle-y ms-3 text-muted" />
                <input
                  type="text"
                  className="form-control ps-5"
                  placeholder="Search companies..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </Col>
          </Row>

          {/* Company Table */}
          <Row>
            <Col>
              <Card className="shadow-sm border-0">
                <Card.Header className="bg-white border-0 py-3">
                  <div className="d-flex justify-content-between align-items-center">
                    <h4 className="mb-0 text-dark fw-semibold">
                      <FaChartBar className="me-2 text-primary" />
                      Company-wise Distribution
                    </h4>
                    <Badge bg="light" text="dark" className="fs-6">
                      Total: {companyData?.totalCount || 0}
                    </Badge>
                  </div>
                </Card.Header>
                <Card.Body className="p-0">
                  <div className="table-responsive">
                    <Table hover className="mb-0">
                      <thead className="table-light">
                        <tr>
                          <th className="ps-4">Rank</th>
                          <th>Company</th>
                          <th className="text-center">Total</th>
                          <th className="text-center">Podium Floor</th>
                          <th className="text-center">2nd Floor</th>
                          <th className="text-center">Tower B</th>
                        </tr>
                      </thead>
                      <tbody>
                        {(filteredCompanies || []).map((company, index) => {
                          const rankBadge = getRankBadge(index);
                          return (
                            <tr key={company?.name || index} className="align-middle">
                              <td className="ps-4">
                                <Badge bg={rankBadge.bg} text={rankBadge.text} className="fs-6 px-2 py-1">
                                  {rankBadge.icon}#{index + 1}
                                </Badge>
                              </td>
                              <td
                                role="button"
                                onClick={() => handleCompanyClick(company)}
                                className="fw-semibold"
                                style={{ 
                                  cursor: "pointer", 
                                  color: "#0d6efd",
                                  transition: 'color 0.2s ease'
                                }}
                                onMouseEnter={(e) => e.target.style.color = "#0a58ca"}
                                onMouseLeave={(e) => e.target.style.color = "#0d6efd"}
                              >
                                {company?.name}
                              </td>
                              <td className="text-center">
                                <Badge bg="dark" className="fs-6 px-2 py-1">
                                  {company?.total || 0}
                                </Badge>
                              </td>
                              {["Podium Floor", "2nd Floor", "Tower B"].map((floor) => (
                                <td key={floor} className="text-center">
                                  {company?.byBuilding?.[floor] > 0 ? (
                                    <Badge
                                      bg="primary"
                                      role="button"
                                      className="fs-6 px-2 py-1"
                                      style={{ 
                                        cursor: "pointer",
                                        transition: 'transform 0.2s ease'
                                      }}
                                      onClick={() => handleCompanyBuildingClick(company, floor)}
                                      onMouseEnter={(e) => e.target.style.transform = 'scale(1.1)'}
                                      onMouseLeave={(e) => e.target.style.transform = 'scale(1)'}
                                    >
                                      {company?.byBuilding?.[floor]}
                                    </Badge>
                                  ) : (
                                    <span className="text-muted">—</span>
                                  )}
                                </td>
                              ))}
                            </tr>
                          );
                        })}
                      </tbody>
                    </Table>
                    {filteredCompanies.length === 0 && (
                      <div className="text-center py-5 text-muted">
                        <FaSearch className="fs-1 mb-3 opacity-50" />
                        <p className="fs-5">No companies found matching your criteria</p>
                      </div>
                    )}
                  </div>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </>
      );
    } else if (activeTab === "futureTab") {
      return (
        <Card className="shadow-sm border-0 p-4 text-center">
          <FaChartPie className="fs-1 text-primary mb-3 opacity-50" />
          <h4 className="text-dark mb-2">Future Analytics</h4>
          <p className="text-secondary">This area is reserved for future dashboard features and analytics.</p>
        </Card>
      );
    }
  };

  return (
    <Container fluid className="company-summary-dashboard text-dark p-0" style={{ minHeight: "100vh", background: "linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)" }}>
      <Row className="g-0">
        {/* Sidebar */}
        <Col md={sidebarOpen ? 2 : 1} className="bg-dark text-white shadow-lg" style={{ minHeight: "100vh", transition: 'all 0.3s ease' }}>
          <div className="p-3 d-flex flex-column h-100">
            {/* Sidebar Header */}
            <div className="text-center mb-4 border-bottom pb-3">
              {sidebarOpen && (
                <>
                  <div className="bg-primary rounded-circle d-inline-flex align-items-center justify-content-center mb-3" style={{ width: '60px', height: '60px' }}>
                    <FaBuilding className="fs-4 text-white" />
                  </div>
                  <h5 className="text-white mb-1">Security Dashboard</h5>
                  <small className="text-white-50">Occupancy Analytics</small>
                </>
              )}
            </div>

            {/* Clock */}
            <div className="text-center mb-4 p-3 bg-dark rounded border">
              <FaClock className="fs-5 text-primary mb-2" />
              {sidebarOpen && (
                <>
                  <div className="fs-6 fw-bold text-white">{formatTime(currentTime)}</div>
                  <div className="small text-white-50">{formatDate(currentTime)}</div>
                </>
              )}
            </div>

            {/* Navigation */}
            <Nav className="flex-column gap-2">
              <Nav.Link
                active={activeTab === "companyAnalytics"}
                onClick={() => setActiveTab("companyAnalytics")}
                className={`rounded-pill px-3 py-2 text-start ${activeTab === "companyAnalytics" ? 'bg-primary text-white' : 'text-white-50 hover-bg'}`}
                style={{ 
                  transition: 'all 0.3s ease',
                  cursor: 'pointer'
                }}
                onMouseEnter={(e) => !e.target.className.includes('bg-primary') && (e.target.style.backgroundColor = 'rgba(255,255,255,0.1)')}
                onMouseLeave={(e) => !e.target.className.includes('bg-primary') && (e.target.style.backgroundColor = 'transparent')}
              >
                <FaChartBar className="me-2 fs-6" />
                {sidebarOpen && "Company Analytics"}
              </Nav.Link>
              <Nav.Link
                active={activeTab === "futureTab"}
                onClick={() => setActiveTab("futureTab")}
                className={`rounded-pill px-3 py-2 text-start ${activeTab === "futureTab" ? 'bg-primary text-white' : 'text-white-50 hover-bg'}`}
                style={{ 
                  transition: 'all 0.3s ease',
                  cursor: 'pointer'
                }}
                onMouseEnter={(e) => !e.target.className.includes('bg-primary') && (e.target.style.backgroundColor = 'rgba(255,255,255,0.1)')}
                onMouseLeave={(e) => !e.target.className.include