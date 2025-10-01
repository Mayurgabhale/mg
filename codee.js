// C:\Users\W0024618\Desktop\swipeData\client\src\components\CompanySummary.jsx
import React, { useState, useMemo } from 'react';
import { 
  Container, 
  Row, 
  Col, 
  Card, 
  Table, 
  Badge,
  ProgressBar,
  Form
} from 'react-bootstrap';
import { 
  FaTrophy, 
  FaMedal, 
  FaChartBar, 
  FaBuilding,
  FaUsers,
  FaArrowTrendUp,
  FaClock
} from 'react-icons/fa6';

const CompanySummary = ({ 
  detailsData = {},
  personnelBreakdown = [],
  zoneBreakdown = []
}) => {
  const [selectedBuilding, setSelectedBuilding] = useState('all');
  const [timeRange, setTimeRange] = useState('today');

  // Process company data from details
  const companyData = useMemo(() => {
    const companies = {};
    let totalCount = 0;

    // Process each zone's employees
    Object.values(detailsData).forEach(zoneEmployees => {
      if (Array.isArray(zoneEmployees)) {
        zoneEmployees.forEach(employee => {
          const companyName = employee.CompanyName || 'Unknown Company';
          const building = getBuildingFromZone(employee.zone);
          
          if (!companies[companyName]) {
            companies[companyName] = {
              name: companyName,
              total: 0,
              byBuilding: { podium: 0, towerB: 0, other: 0 },
              employees: [],
              locations: new Set()
            };
          }

          companies[companyName].total++;
          companies[companyName].byBuilding[building]++;
          companies[companyName].employees.push(employee);
          if (employee.PrimaryLocation) {
            companies[companyName].locations.add(employee.PrimaryLocation);
          }
          totalCount++;
        });
      }
    });

    // Convert to array and sort by count
    const companyArray = Object.values(companies)
      .map(company => ({
        ...company,
        locations: Array.from(company.locations),
        percentage: ((company.total / totalCount) * 100).toFixed(1)
      }))
      .sort((a, b) => b.total - a.total);

    return {
      companies: companyArray,
      totalCount,
      buildingTotals: companyArray.reduce((acc, company) => {
        acc.podium += company.byBuilding.podium;
        acc.towerB += company.byBuilding.towerB;
        acc.other += company.byBuilding.other;
        return acc;
      }, { podium: 0, towerB: 0, other: 0 })
    };
  }, [detailsData]);

  // Helper function to determine building from zone
  const getBuildingFromZone = (zone) => {
    if (!zone) return 'other';
    const zoneLower = zone.toLowerCase();
    if (zoneLower.includes('podium')) return 'podium';
    if (zoneLower.includes('tower b') || zoneLower.includes('tower_b')) return 'towerB';
    return 'other';
  };

  // Filter companies based on selected building
  const filteredCompanies = useMemo(() => {
    if (selectedBuilding === 'all') {
      return companyData.companies;
    }
    return companyData.companies.filter(company => 
      company.byBuilding[selectedBuilding] > 0
    );
  }, [companyData.companies, selectedBuilding]);

  // Get top 3 companies for podium
  const getPodiumWinners = () => {
    const podiumCompanies = companyData.companies
      .filter(company => company.byBuilding.podium > 0)
      .sort((a, b) => b.byBuilding.podium - a.byBuilding.podium)
      .slice(0, 3);
    
    return [
      { ...podiumCompanies[1], position: '1st', icon: FaTrophy, color: 'gold' },
      { ...podiumCompanies[0], position: '2nd', icon: FaMedal, color: 'silver' },
      { ...podiumCompanies[2], position: '3rd', icon: FaMedal, color: '#cd7f32' }
    ].filter(Boolean);
  };

  const podiumWinners = getPodiumWinners();

  return (
    <Container fluid className="company-summary-dashboard">
      {/* Header Section */}
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
              Total: {companyData.totalCount} People
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
              <option value="podium">Podium Only</option>
              <option value="towerB">Tower B Only</option>
              <option value="other">Other Areas</option>
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

      {/* Podium Section */}
      {selectedBuilding === 'all' || selectedBuilding === 'podium' ? (
        <Row className="mb-4">
          <Col>
            <Card className="bg-dark text-light border-warning">
              <Card.Header className="bg-warning text-dark">
                <h4 className="mb-0">
                  <FaTrophy className="me-2" />
                  Podium Leaderboard
                </h4>
              </Card.Header>
              <Card.Body>
                {podiumWinners.length > 0 ? (
                  <div className="podium-container text-center">
                    <Row className="align-items-end justify-content-center">
                      {/* 2nd Place */}
                      {podiumWinners.find(w => w.position === '2nd') && (
                        <Col md={3} className="mb-3">
                          <div className="podium-place second-place">
                            <div className="podium-rank bg-secondary text-light">
                              <FaMedal className="text-silver" />
                              <div>2nd</div>
                            </div>
                            <div className="podium-company-info">
                              <h6 className="mb-1">
                                {podiumWinners.find(w => w.position === '2nd').name}
                              </h6>
                              <Badge bg="silver" className="fs-6">
                                {podiumWinners.find(w => w.position === '2nd').byBuilding.podium}
                              </Badge>
                            </div>
                          </div>
                        </Col>
                      )}

                      {/* 1st Place */}
                      {podiumWinners.find(w => w.position === '1st') && (
                        <Col md={4} className="mb-3">
                          <div className="podium-place first-place">
                            <div className="podium-rank bg-warning text-dark">
                              <FaTrophy className="text-gold" />
                              <div>1st</div>
                            </div>
                            <div className="podium-company-info">
                              <h5 className="mb-1 text-warning">
                                {podiumWinners.find(w => w.position === '1st').name}
                              </h5>
                              <Badge bg="warning" text="dark" className="fs-5">
                                {podiumWinners.find(w => w.position === '1st').byBuilding.podium}
                              </Badge>
                            </div>
                          </div>
                        </Col>
                      )}

                      {/* 3rd Place */}
                      {podiumWinners.find(w => w.position === '3rd') && (
                        <Col md={3} className="mb-3">
                          <div className="podium-place third-place">
                            <div className="podium-rank bg-secondary text-light">
                              <FaMedal className="text-bronze" />
                              <div>3rd</div>
                            </div>
                            <div className="podium-company-info">
                              <h6 className="mb-1">
                                {podiumWinners.find(w => w.position === '3rd').name}
                              </h6>
                              <Badge bg="bronze" className="fs-6">
                                {podiumWinners.find(w => w.position === '3rd').byBuilding.podium}
                              </Badge>
                            </div>
                          </div>
                        </Col>
                      )}
                    </Row>
                  </div>
                ) : (
                  <div className="text-center text-muted py-4">
                    No podium data available
                  </div>
                )}
              </Card.Body>
            </Card>
          </Col>
        </Row>
      ) : null}

      {/* Statistics Cards */}
      <Row className="mb-4">
        <Col md={3}>
          <Card className="bg-dark text-light border-primary h-100">
            <Card.Body className="text-center">
              <FaBuilding className="text-primary fs-1 mb-2" />
              <h4 className="text-primary">{companyData.companies.length}</h4>
              <p className="mb-0">Total Companies</p>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="bg-dark text-light border-success h-100">
            <Card.Body className="text-center">
              <FaUsers className="text-success fs-1 mb-2" />
              <h4 className="text-success">{companyData.buildingTotals.podium}</h4>
              <p className="mb-0">Podium Occupancy</p>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="bg-dark text-light border-info h-100">
            <Card.Body className="text-center">
              <FaChartBar className="text-info fs-1 mb-2" />
              <h4 className="text-info">{companyData.buildingTotals.towerB}</h4>
              <p className="mb-0">Tower B Occupancy</p>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="bg-dark text-light border-warning h-100">
            <Card.Body className="text-center">
              <FaArrowTrendUp className="text-warning fs-1 mb-2" />
              <h4 className="text-warning">{companyData.totalCount}</h4>
              <p className="mb-0">Total Current Presence</p>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Main Company Table */}
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
                  <thead className="bg-gray-800">
                    <tr>
                      <th className="border-secondary">Rank</th>
                      <th className="border-secondary">Company Name</th>
                      <th className="border-secondary text-center">Total</th>
                      <th className="border-secondary text-center">Podium</th>
                      <th className="border-secondary text-center">Tower B</th>
                      <th className="border-secondary text-center">Other</th>
                      <th className="border-secondary text-center">Distribution</th>
                      <th className="border-secondary">Primary Locations</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredCompanies.map((company, index) => (
                      <tr key={company.name} className="border-secondary">
                        <td className="border-secondary">
                          <Badge bg={index < 3 ? 'warning' : 'secondary'}>
                            #{index + 1}
                          </Badge>
                        </td>
                        <td className="border-secondary fw-bold">
                          {company.name}
                        </td>
                        <td className="border-secondary text-center">
                          <Badge bg="light" text="dark" className="fs-6">
                            {company.total}
                          </Badge>
                        </td>
                        <td className="border-secondary text-center">
                          {company.byBuilding.podium > 0 ? (
                            <Badge bg="success">{company.byBuilding.podium}</Badge>
                          ) : (
                            <span className="text-muted">-</span>
                          )}
                        </td>
                        <td className="border-secondary text-center">
                          {company.byBuilding.towerB > 0 ? (
                            <Badge bg="info">{company.byBuilding.towerB}</Badge>
                          ) : (
                            <span className="text-muted">-</span>
                          )}
                        </td>
                        <td className="border-secondary text-center">
                          {company.byBuilding.other > 0 ? (
                            <Badge bg="secondary">{company.byBuilding.other}</Badge>
                          ) : (
                            <span className="text-muted">-</span>
                          )}
                        </td>
                        <td className="border-secondary">
                          <div className="distribution-bar">
                            <ProgressBar className="bg-gray-700">
                              <ProgressBar 
                                now={(company.byBuilding.podium / company.total) * 100}
                                variant="success"
                                label={`${Math.round((company.byBuilding.podium / company.total) * 100)}%`}
                              />
                              <ProgressBar 
                                now={(company.byBuilding.towerB / company.total) * 100}
                                variant="info"
                                label={`${Math.round((company.byBuilding.towerB / company.total) * 100)}%`}
                              />
                            </ProgressBar>
                          </div>
                        </td>
                        <td className="border-secondary">
                          <small>
                            {company.locations.slice(0, 2).join(', ')}
                            {company.locations.length > 2 && '...'}
                          </small>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </div>
              {filteredCompanies.length === 0 && (
                <div className="text-center text-muted py-4">
                  No companies found for the selected filter
                </div>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Building Distribution Chart Section */}
      <Row className="mt-4">
        <Col md={6}>
          <Card className="bg-dark text-light border-success">
            <Card.Header className="bg-success text-dark">
              <h5 className="mb-0">Podium Distribution</h5>
            </Card.Header>
            <Card.Body>
              {companyData.companies
                .filter(company => company.byBuilding.podium > 0)
                .slice(0, 5)
                .map((company, index) => (
                  <div key={company.name} className="mb-3">
                    <div className="d-flex justify-content-between align-items-center mb-1">
                      <span className="small">{company.name}</span>
                      <Badge bg="success">{company.byBuilding.podium}</Badge>
                    </div>
                    <ProgressBar 
                      now={(company.byBuilding.podium / companyData.buildingTotals.podium) * 100}
                      variant="success"
                      className="bg-gray-700"
                    />
                  </div>
                ))
              }
            </Card.Body>
          </Card>
        </Col>
        <Col md={6}>
          <Card className="bg-dark text-light border-info">
            <Card.Header className="bg-info text-dark">
              <h5 className="mb-0">Tower B Distribution</h5>
            </Card.Header>
            <Card.Body>
              {companyData.companies
                .filter(company => company.byBuilding.towerB > 0)
                .slice(0, 5)
                .map((company, index) => (
                  <div key={company.name} className="mb-3">
                    <div className="d-flex justify-content-between align-items-center mb-1">
                      <span className="small">{company.name}</span>
                      <Badge bg="info">{company.byBuilding.towerB}</Badge>
                    </div>
                    <ProgressBar 
                      now={(company.byBuilding.towerB / companyData.buildingTotals.towerB) * 100}
                      variant="info"
                      className="bg-gray-700"
                    />
                  </div>
                ))
              }
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

// Add some custom CSS
const styles = `
.company-summary-dashboard .podium-container {
  min-height: 200px;
}

.company-summary-dashboard .podium-place {
  transition: transform 0.3s ease;
}

.company-summary-dashboard .podium-place:hover {
  transform: translateY(-5px);
}

.company-summary-dashboard .first-place {
  transform: scale(1.1);
}

.company-summary-dashboard .podium-rank {
  padding: 10px;
  border-radius: 8px 8px 0 0;
  text-align: center;
  font-weight: bold;
}

.company-summary-dashboard .podium-company-info {
  padding: 15px;
  background: rgba(255,255,255,0.1);
  border-radius: 0 0 8px 8px;
}

.text-gold { color: #ffd700 !important; }
.text-silver { color: #c0c0c0 !important; }
.text-bronze { color: #cd7f32 !important; }

.bg-bronze {
  background-color: #cd7f32 !important;
  color: white !important;
}

.distribution-bar .progress {
  height: 20px;
  border-radius: 4px;
}

.distribution-bar .progress-bar {
  font-size: 0.7rem;
  font-weight: bold;
}

.bg-gray-700 {
  background-color: #495057 !important;
}

.bg-gray-800 {
  background-color: #343a40 !important;
}
`;

// Add styles to document
const styleSheet = document.createElement("style");
styleSheet.innerText = styles;
document.head.appendChild(styleSheet);

export default CompanySummary;