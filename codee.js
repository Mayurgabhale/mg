++++"floorBreakdown"++++
"floorBreakdown":[{"floor":"Podium Floor","Property Management":4,"Contractor":8,"Temp Badge":1,"total":13},{"floor":"Tower B","Property Management":2,"total":2}],"details":{"Red Zone":[{"Dateonly":"2025-10-02","Swipe_Time":"07:48:26","EmployeeID":"0","ObjectName1":"Maurya, Jitendra","CardNumber":"414293","PersonnelType":"Property Management","zone":"Red Zone","door":"APAC_IN_PUN_PODIUM_ST 1-DOOR 1 (RED)","Direction":"InDirection","CompanyName":"Poona Security India Pvt. Ltd","PrimaryLocation":"Business Bay - Pune"},{"Dateonly":"2025-10-02","Swipe_Time":"07:20:26","EmployeeID":"90762427","ObjectName1":"Gaikwad, Neil","CardNumber":"615827","PersonnelType":"Contractor","zone":"Red Zone","door":"APAC_IN_PUN_PODIUM_RED_RECREATION AREA FIRE EXIT 1-DOOR NEW","Direction":"InDirection","CompanyName":"Poona Security India Pvt. Ltd","PrimaryLocation":"Pune - Business Bay"},{"Dateonly":"2025-10-02","Swipe_Time":"07:34:59","EmployeeID":"0","ObjectName1":"Maurya, Anil","CardNumber":"410377","PersonnelType":"Property Management","zone":"Red Zone","door":"APAC_IN_PUN_PODIUM_RED_RECEPTION
  "floorBreakdown": [
    {
      "floor": "Podium Floor",
      "Employee": 498,
      "Property Management": 15,
      "Contractor": 11,
      "Visitor": 19,
      "Temp Badge": 4,
      "total": 547
    },
    {
      "floor": "Tower B",
      "Property Management": 11,
      "Employee": 128,
      "Contractor": 2,
      "total": 141
    },
    {
      "floor": "2nd Floor",
      "Employee": 95,
      "Visitor": 1,
      "Contractor": 3,
      "Property Management": 1,
      "total": 100
    }
  ],
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                             

  see bove not zone floorbreakdown ok use                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                            
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                             
       use this floorBreakdown                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                             

// CompanySummary.jsx
import React, { useState, useMemo } from 'react';
import {
  Container, Row, Col, Card, Table, Badge, ProgressBar, Form
} from 'react-bootstrap';
import {
  FaTrophy, FaMedal, FaChartBar, FaBuilding, FaUsers, FaArrowTrendUp, FaClock
} from 'react-icons/fa6';

const CompanySummary = ({
  detailsData = {},
  personnelBreakdown = [],
  zoneBreakdown = []
}) => {
  const [selectedBuilding, setSelectedBuilding] = useState('all');
  const [timeRange, setTimeRange] = useState('today');

  // --- Normalize building from zone ---
  const getBuildingFromZone = (zone) => {
    if (!zone) return null;
    const z = String(zone).toLowerCase();
    if (z.includes('podium')) return 'Podium Floor';
    if (z.includes('2nd')) return '2nd Floor';
    if (z.includes('tower b')) return 'Tower B';
    return null; // ignore anything else
  };

  // --- Process company data ---
  const companyData = useMemo(() => {
    const companies = {};
    let totalCount = 0;

    Object.values(detailsData || {}).forEach(zoneEmployees => {
      if (Array.isArray(zoneEmployees)) {
        zoneEmployees.forEach(employee => {
          const companyName = employee?.CompanyName || 'Unknown Company';
          const building = getBuildingFromZone(employee?.zone);

          if (!building) return; // ignore unrecognized zones

          if (!companies[companyName]) {
            companies[companyName] = {
              name: companyName,
              total: 0,
              byBuilding: { 'Podium Floor': 0, '2nd Floor': 0, 'Tower B': 0 },
              employees: [],
              locations: new Set()
            };
          }

          companies[companyName].total++;
          companies[companyName].byBuilding[building] =
            (companies[companyName].byBuilding[building] || 0) + 1;

          companies[companyName].employees.push(employee);
          if (employee?.PrimaryLocation) {
            companies[companyName].locations.add(employee.PrimaryLocation);
          }
          totalCount++;
        });
      }
    });

    const companyArray = Object.values(companies)
      .map(company => ({
        ...company,
        locations: Array.from(company.locations || []),
        percentage: totalCount > 0 ? ((company.total / totalCount) * 100).toFixed(1) : '0.0'
      }))
      .sort((a, b) => (b.total || 0) - (a.total || 0));

    const buildingTotals = companyArray.reduce((acc, company) => {
      acc['Podium Floor'] += (company.byBuilding?.['Podium Floor'] || 0);
      acc['2nd Floor'] += (company.byBuilding?.['2nd Floor'] || 0);
      acc['Tower B'] += (company.byBuilding?.['Tower B'] || 0);
      return acc;
    }, { 'Podium Floor': 0, '2nd Floor': 0, 'Tower B': 0 });

    return {
      companies: companyArray,
      totalCount,
      buildingTotals
    };
  }, [detailsData]);

  // --- Filtered companies ---
  const filteredCompanies = useMemo(() => {
    const comps = companyData?.companies || [];
    if (selectedBuilding === 'all') return comps;
    return comps.filter(company => (company.byBuilding?.[selectedBuilding] || 0) > 0);
  }, [companyData?.companies, selectedBuilding]);

  // --- Podium winners (only for Podium Floor) ---
  const getPodiumWinners = () => {
    const podiumCompanies = (companyData?.companies || [])
      .filter(c => (c.byBuilding?.['Podium Floor'] || 0) > 0)
      .sort((a, b) => (b.byBuilding?.['Podium Floor'] || 0) - (a.byBuilding?.['Podium Floor'] || 0))
      .reverse()
      .slice(0, 3);

    return podiumCompanies.map((c, idx) => ({
      name: c?.name || 'Unknown',
      count: c?.byBuilding?.['Podium Floor'] || 0,
      position: idx === 0 ? '1st' : idx === 1 ? '2nd' : '3rd',
      icon: idx === 0 ? FaTrophy : FaMedal,
      color: idx === 0 ? 'gold' : idx === 1 ? 'silver' : '#cd7f32'
    }));
  };

  const podiumWinners = getPodiumWinners();

  // small util
  const safePercent = (num, denom) => (denom > 0 ? (num / denom) * 100 : 0);

  return (
    <Container fluid className="company-summary-dashboard">
      {/* Header */}
      <Row className="mb-4">
        <Col>
          <div className="d-flex justify-content-between align-items-center">
            <div>
              <h2 className="text-warning mb-1">
                <FaBuilding className="me-2" />
                Company Analytics Dashboard
              </h2>
              <p className="text-light mb-0">
                Real-time company presence and distribution analysis
              </p>
            </div>
            <Badge bg="warning" text="dark" className="fs-6">
              <FaUsers className="me-1" />
              Total: {companyData?.totalCount || 0} People
            </Badge>
          </div>
        </Col>
      </Row>

      {/* Filters */}
      <Row className="mb-4">
        <Col md={6}>
          <Form.Group>
            <Form.Label className="text-light">
              <FaBuilding className="me-2" />
              Filter by Building
            </Form.Label>
            <Form.Select
              value={selectedBuilding}
              onChange={(e) => setSelectedBuilding(e.target.value)}
              className="bg-dark text-light border-secondary"
            >
              <option value="all">All Buildings</option>
              <option value="Podium Floor">Podium Floor</option>
              <option value="2nd Floor">2nd Floor</option>
              <option value="Tower B">Tower B</option>
            </Form.Select>
          </Form.Group>
        </Col>
        <Col md={6}>
          <Form.Group>
            <Form.Label className="text-light">
              <FaClock className="me-2" />
              Time Range
            </Form.Label>
            <Form.Select
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value)}
              className="bg-dark text-light border-secondary"
            >
              <option value="today">Live - Today</option>
              <option value="week">This Week</option>
              <option value="month">This Month</option>
            </Form.Select>
          </Form.Group>
        </Col>
      </Row>

      {/* Podium Leaderboard */}
      {(selectedBuilding === 'all' || selectedBuilding === 'Podium Floor') && (
        <Row className="mb-4">
          <Col>
            <Card className="bg-dark text-light border-warning">
              <Card.Header className="bg-warning text-dark">
                <h4 className="mb-0">
                  <FaTrophy className="me-2" />
                  Podium Floor Leaderboard
                </h4>
              </Card.Header>
              <Card.Body>
                {podiumWinners.length > 0 ? (
                  <Row className="align-items-end justify-content-center text-center">
                    {podiumWinners.map(w => (
                      <Col md={3} key={w.position} className="mb-3">
                        <div>
                          <div className="mb-2">
                            <w.icon style={{ color: w.color, fontSize: '2rem' }} />
                            <div>{w.position}</div>
                          </div>
                          <h6 className="mb-1">{w.name}</h6>
                          <Badge bg="secondary">{w.count}</Badge>
                        </div>
                      </Col>
                    ))}
                  </Row>
                ) : (
                  <div className="text-center text-muted py-4">
                    No podium data available
                  </div>
                )}
              </Card.Body>
            </Card>
          </Col>
        </Row>
      )}

      {/* Stats */}
      <Row className="mb-4">
        <Col md={4}>
          <Card className="bg-dark text-light border-success h-100">
            <Card.Body className="text-center">
              <FaUsers className="text-success fs-1 mb-2" />
              <h4 className="text-success">{companyData?.buildingTotals?.['Podium Floor'] || 0}</h4>
              <p className="mb-0">Podium Floor Occupancy</p>
            </Card.Body>
          </Card>
        </Col>
        <Col md={4}>
          <Card className="bg-dark text-light border-info h-100">
            <Card.Body className="text-center">
              <FaUsers className="text-info fs-1 mb-2" />
              <h4 className="text-info">{companyData?.buildingTotals?.['2nd Floor'] || 0}</h4>
              <p className="mb-0">2nd Floor Occupancy</p>
            </Card.Body>
          </Card>
        </Col>
        <Col md={4}>
          <Card className="bg-dark text-light border-warning h-100">
            <Card.Body className="text-center">
              <FaUsers className="text-warning fs-1 mb-2" />
              <h4 className="text-warning">{companyData?.buildingTotals?.['Tower B'] || 0}</h4>
              <p className="mb-0">Tower B Occupancy</p>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Company Table */}
      <Row>
        <Col>
          <Card className="bg-dark text-light border-secondary">
            <Card.Header className="bg-secondary text-dark">
              <h4 className="mb-0">
                <FaChartBar className="me-2" />
                Company-wise Distribution
              </h4>
            </Card.Header>
            <Card.Body className="p-0">
              <div className="table-responsive">
                <Table hover variant="dark" className="mb-0">
                  <thead>
                    <tr>
                      <th>Rank</th>
                      <th>Company</th>
                      <th>Total</th>
                      <th>Podium Floor</th>
                      <th>2nd Floor</th>
                      <th>Tower B</th>
                      <th>Distribution</th>
                      <th>Primary Locations</th>
                    </tr>
                  </thead>
                  <tbody>
                    {(filteredCompanies || []).map((company, index) => {
                      const podiumCount = company?.byBuilding?.['Podium Floor'] || 0;
                      const secondFloorCount = company?.byBuilding?.['2nd Floor'] || 0;
                      const towerBCount = company?.byBuilding?.['Tower B'] || 0;
                      const total = company?.total || 1;

                      return (
                        <tr key={company?.name || index}>
                          <td>
                            <Badge bg={index < 3 ? 'warning' : 'secondary'}>
                              #{index + 1}
                            </Badge>
                          </td>
                          <td>{company?.name}</td>
                          <td><Badge bg="light" text="dark">{company?.total || 0}</Badge></td>
                          <td>{podiumCount > 0 ? <Badge bg="success">{podiumCount}</Badge> : '-'}</td>
                          <td>{secondFloorCount > 0 ? <Badge bg="info">{secondFloorCount}</Badge> : '-'}</td>
                          <td>{towerBCount > 0 ? <Badge bg="warning">{towerBCount}</Badge> : '-'}</td>
                          <td>
                            <ProgressBar className="bg-gray-700">
                              {['Podium Floor', '2nd Floor', 'Tower B'].map(floor => (
                                <ProgressBar
                                  key={floor}
                                  now={safePercent(company?.byBuilding?.[floor], total)}
                                  variant={floor === '2nd Floor' ? 'info' : floor === 'Tower B' ? 'warning' : 'success'}
                                  label={company?.byBuilding?.[floor] > 0 ? `${company.byBuilding[floor]}` : ''}
                                />
                              ))}
                            </ProgressBar>
                          </td>
                          <td>
                            <small>
                              {(company?.locations || []).slice(0, 2).join(', ')}
                              {(company?.locations || []).length > 2 && '...'}
                            </small>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </Table>
              </div>
              {(filteredCompanies || []).length === 0 && (
                <div className="text-center text-muted py-4">
                  No companies found for the selected filter
                </div>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default CompanySummary;
