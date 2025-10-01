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

  // --- Helper function to determine building from zone ---
  const getBuildingFromZone = (zone) => {
    if (!zone) return 'other';
    const zoneLower = String(zone).toLowerCase();
    if (zoneLower.includes('podium')) return 'podium';
    if (zoneLower.includes('tower b') || zoneLower.includes('tower_b')) return 'towerB';
    return 'other';
  };

  // --- Process company data from details ---
  const companyData = useMemo(() => {
    const companies = {};
    let totalCount = 0;

    Object.values(detailsData || {}).forEach(zoneEmployees => {
      if (Array.isArray(zoneEmployees)) {
        zoneEmployees.forEach(employee => {
          const companyName = employee?.CompanyName || 'Unknown Company';
          const building = getBuildingFromZone(employee?.zone) || 'other';

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
          // ensure key exists and increment safely
          const bb = companies[companyName].byBuilding;
          bb[building] = (bb[building] || 0) + 1;

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
      acc.podium += (company.byBuilding?.podium || 0);
      acc.towerB += (company.byBuilding?.towerB || 0);
      acc.other += (company.byBuilding?.other || 0);
      return acc;
    }, { podium: 0, towerB: 0, other: 0 });

    return {
      companies: companyArray,
      totalCount,
      buildingTotals
    };
  }, [detailsData]);

  // --- Filtered companies based on building ---
  const filteredCompanies = useMemo(() => {
    const comps = companyData?.companies || [];
    if (selectedBuilding === 'all') return comps;
    return comps.filter(company => (company.byBuilding?.[selectedBuilding] || 0) > 0);
  }, [companyData?.companies, selectedBuilding]);

  // --- Podium winners (fixed ordering and guarded accesses) ---
  const getPodiumWinners = () => {
    const podiumCompanies = (companyData?.companies || [])
      .filter(c => (c.byBuilding?.podium || 0) > 0)
      .sort((a, b) => (b.byBuilding?.podium || 0) - (a.byBuilding?.podium || 0))
      .slice(0, 3);

    // Build safe winner objects: index 0 => 1st, 1 => 2nd, 2 => 3rd
    const winners = podiumCompanies.map((c, idx) => ({
      name: c?.name || 'Unknown',
      byBuilding: c?.byBuilding || { podium: 0, towerB: 0, other: 0 },
      total: c?.total || 0,
      position: idx === 0 ? '1st' : idx === 1 ? '2nd' : '3rd',
      icon: idx === 0 ? FaTrophy : FaMedal,
      color: idx === 0 ? 'gold' : idx === 1 ? 'silver' : '#cd7f32'
    }));

    return winners;
  };

  const podiumWinners = getPodiumWinners();

  // small util for safe percentage math
  const safePercent = (num, denom) => (denom > 0 ? (num / denom) * 100 : 0);

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
      {(selectedBuilding === 'all' || selectedBuilding === 'podium') && (
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
                                {podiumWinners.find(w => w.position === '2nd')?.name}
                              </h6>
                              <Badge bg="secondary" className="fs-6">
                                {podiumWinners.find(w => w.position === '2nd')?.byBuilding?.podium || 0}
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
                                {podiumWinners.find(w => w.position === '1st')?.name}
                              </h5>
                              <Badge bg="warning" text="dark" className="fs-5">
                                {podiumWinners.find(w => w.position === '1st')?.byBuilding?.podium || 0}
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
                                {podiumWinners.find(w => w.position === '3rd')?.name}
                              </h6>
                              <Badge bg="secondary" className="fs-6">
                                {podiumWinners.find(w => w.position === '3rd')?.byBuilding?.podium || 0}
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
      )}

      {/* Statistics Cards */}
      <Row className="mb-4">
        <Col md={3}>
          <Card className="bg-dark text-light border-primary h-100">
            <Card.Body className="text-center">
              <FaBuilding className="text-primary fs-1 mb-2" />
              <h4 className="text-primary">{(companyData?.companies || []).length}</h4>
              <p className="mb-0">Total Companies</p>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="bg-dark text-light border-success h-100">
            <Card.Body className="text-center">
              <FaUsers className="text-success fs-1 mb-2" />
              <h4 className="text-success">{companyData?.buildingTotals?.podium || 0}</h4>
              <p className="mb-0">Podium Occupancy</p>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="bg-dark text-light border-info h-100">
            <Card.Body className="text-center">
              <FaChartBar className="text-info fs-1 mb-2" />
              <h4 className="text-info">{companyData?.buildingTotals?.towerB || 0}</h4>
              <p className="mb-0">Tower B Occupancy</p>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="bg-dark text-light border-warning h-100">
            <Card.Body className="text-center">
              <FaArrowTrendUp className="text-warning fs-1 mb-2" />
              <h4 className="text-warning">{companyData?.totalCount || 0}</h4>
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
                    {(filteredCompanies || []).map((company, index) => {
                      const podiumCount = company?.byBuilding?.podium || 0;
                      const towerBCount = company?.byBuilding?.towerB || 0;
                      const otherCount = company?.byBuilding?.other || 0;
                      const total = company?.total || 1; // avoid divide by zero

                      return (
                        <tr key={company?.name || index} className="border-secondary">
                          <td className="border-secondary">
                            <Badge bg={index < 3 ? 'warning' : 'secondary'}>
                              #{index + 1}
                            </Badge>
                          </td>
                          <td className="border-secondary fw-bold">
                            {company?.name || 'Unknown'}
                          </td>
                          <td className="border-secondary text-center">
                            <Badge bg="light" text="dark" className="fs-6">
                              {company?.total || 0}
                            </Badge>
                          </td>
                          <td className="border-secondary text-center">
                            {podiumCount > 0 ? (
                              <Badge bg="success">{podiumCount}</Badge>
                            ) : (
                              <span className="text-muted">-</span>
                            )}
                          </td>
                          <td className="border-secondary text-center">
                            {towerBCount > 0 ? (
                              <Badge bg="info">{towerBCount}</Badge>
                            ) : (
                              <span className="text-muted">-</span>
                            )}
                          </td>
                          <td className="border-secondary text-center">
                            {otherCount > 0 ? (
                              <Badge bg="secondary">{otherCount}</Badge>
                            ) : (
                              <span className="text-muted">-</span>
                            )}
                          </td>
                          <td className="border-secondary">
                            <div className="distribution-bar">
                              <ProgressBar className="bg-gray-700">
                                <ProgressBar
                                  now={safePercent(podiumCount, total)}
                                  variant="success"
                                  label={`${Math.round(safePercent(podiumCount, total))}%`}
                                />
                                <ProgressBar
                                  now={safePercent(towerBCount, total)}
                                  variant="info"
                                  label={`${Math.round(safePercent(towerBCount, total))}%`}
                                />
                              </ProgressBar>
                            </div>
                          </td>
                          <td className="border-secondary">
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

      {/* Building Distribution Chart Section */}
      <Row className="mt-4">
        <Col md={6}>
          <Card className="bg-dark text-light border-success">
            <Card.Header className="bg-success text-dark">
              <h5 className="mb-0">Podium Distribution</h5>
            </Card.Header>
            <Card.Body>
              {(companyData?.companies || [])
                .filter(company => (company?.byBuilding?.podium || 0) > 0)
                .slice(0, 5)
                .map((company) => (
                  <div key={company?.name || Math.random()} className="mb-3">
                    <div className="d-flex justify-content-between align-items-center mb-1">
                      <span className="small">{company?.name}</span>
                      <Badge bg="success">{company?.byBuilding?.podium || 0}</Badge>
                    </div>
                    <ProgressBar
                      now={safePercent(company?.byBuilding?.podium || 0, companyData?.buildingTotals?.podium || 1)}
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
              {(companyData?.companies || [])
                .filter(company => (company?.byBuilding?.towerB || 0) > 0)
                .slice(0, 5)
                .map((company) => (
                  <div key={company?.name || Math.random()} className="mb-3">
                    <div className="d-flex justify-content-between align-items-center mb-1">
                      <span className="small">{company?.name}</span>
                      <Badge bg="info">{company?.byBuilding?.towerB || 0}</Badge>
                    </div>
                    <ProgressBar
                      now={safePercent(company?.byBuilding?.towerB || 0, companyData?.buildingTotals?.towerB || 1)}
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

export default CompanySummary;