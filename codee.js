// CompanySummary.jsx
import React, { useState, useMemo } from 'react';
import {
  Container, Row, Col, Card, Table, Badge, ProgressBar, Form
} from 'react-bootstrap';
import {
  FaTrophy, FaMedal, FaChartBar, FaBuilding, FaUsers, FaArrowTrendUp, FaClock
} from 'react-icons/fa6';

const CompanySummary = ({ detailsData = {} }) => {
  const [selectedBuilding, setSelectedBuilding] = useState('all');
  const [timeRange, setTimeRange] = useState('today');

  // --- Helper function to determine building from zone ---
  const getBuildingFromZone = (zone) => {
    if (!zone) return null;
    if (zone.includes('Podium Floor')) return 'Podium Floor';
    if (zone.includes('2nd Floor')) return '2nd Floor';
    if (zone.includes('Tower B')) return 'Tower B';
    return null; // ignore anything else
  };

  // --- Process company data from details ---
  const companyData = useMemo(() => {
    const companies = {};
    let totalCount = 0;

    Object.values(detailsData || {}).forEach(zoneEmployees => {
      if (Array.isArray(zoneEmployees)) {
        zoneEmployees.forEach(employee => {
          const companyName = employee?.CompanyName || 'Unknown Company';
          const building = getBuildingFromZone(employee?.zone);
          if (!building) return; // ignore employees outside the 3 floors

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
          companies[companyName].byBuilding[building]++;
          companies[companyName].employees.push(employee);
          if (employee?.PrimaryLocation) companies[companyName].locations.add(employee.PrimaryLocation);
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
      acc['Podium Floor'] += company.byBuilding['Podium Floor'];
      acc['2nd Floor'] += company.byBuilding['2nd Floor'];
      acc['Tower B'] += company.byBuilding['Tower B'];
      return acc;
    }, { 'Podium Floor': 0, '2nd Floor': 0, 'Tower B': 0 });

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

  // --- Podium winners (Podium Floor only) ---
  const getPodiumWinners = () => {
    const podiumCompanies = (companyData?.companies || [])
      .filter(c => (c.byBuilding?.['Podium Floor'] || 0) > 0)
      .sort((a, b) => (b.byBuilding?.['Podium Floor'] || 0) - (a.byBuilding?.['Podium Floor'] || 0))
      .slice(0, 3);

    return podiumCompanies.map((c, idx) => ({
      name: c?.name || 'Unknown',
      byBuilding: c?.byBuilding,
      total: c?.total || 0,
      position: idx === 0 ? '1st' : idx === 1 ? '2nd' : '3rd',
      icon: idx === 0 ? FaTrophy : FaMedal,
      color: idx === 0 ? 'gold' : idx === 1 ? 'silver' : '#cd7f32'
    }));
  };

  const podiumWinners = getPodiumWinners();

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

      {/* Podium Section */}
      {(selectedBuilding === 'all' || selectedBuilding === 'Podium Floor') && (
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
                      {['2nd', '1st', '3rd'].map(pos => {
                        const winner = podiumWinners.find(w => w.position === pos);
                        if (!winner) return null;
                        const colSize = pos === '1st' ? 4 : 3;
                        const bg = pos === '1st' ? 'warning' : 'secondary';
                        return (
                          <Col md={colSize} className="mb-3" key={pos}>
                            <div className={`podium-place ${pos.toLowerCase()}-place`}>
                              <div className={`podium-rank bg-${bg} text-dark`}>
                                {winner.icon({ className: `text-${bg === 'warning' ? 'gold' : pos === '2nd' ? 'silver' : 'bronze'}` })}
                                <div>{pos}</div>
                              </div>
                              <div className="podium-company-info">
                                <h6 className="mb-1">{winner.name}</h6>
                                <Badge bg={bg}>{winner.byBuilding['Podium Floor'] || 0}</Badge>
                              </div>
                            </div>
                          </Col>
                        );
                      })}
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
        {['Podium Floor', '2nd Floor', 'Tower B'].map((floor, idx) => (
          <Col md={3} key={floor}>
            <Card className="bg-dark text-light border-primary h-100">
              <Card.Body className="text-center">
                <FaBuilding className={`text-${['primary','info','success'][idx]} fs-1 mb-2`} />
                <h4 className={`text-${['primary','info','success'][idx]}`}>{companyData?.buildingTotals?.[floor] || 0}</h4>
                <p className="mb-0">{floor} Occupancy</p>
              </Card.Body>
            </Card>
          </Col>
        ))}
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
                      {['Podium Floor', '2nd Floor', 'Tower B'].map(floor => (
                        <th className="border-secondary text-center" key={floor}>{floor}</th>
                      ))}
                      <th className="border-secondary text-center">Distribution</th>
                      <th className="border-secondary">Primary Locations</th>
                    </tr>
                  </thead>
                  <tbody>
                    {(filteredCompanies || []).map((company, index) => {
                      const total = company?.total || 1;
                      return (
                        <tr key={company?.name || index} className="border-secondary">
                          <td className="border-secondary">
                            <Badge bg={index < 3 ? 'warning' : 'secondary'}>#{index + 1}</Badge>
                          </td>
                          <td className="border-secondary fw-bold">{company?.name}</td>
                          <td className="border-secondary text-center">
                            <Badge bg="light" text="dark" className="fs-6">{company?.total || 0}</Badge>
                          </td>
                          {['Podium Floor', '2nd Floor', 'Tower B'].map(floor => (
                            <td className="border-secondary text-center" key={floor}>
                              {company?.byBuilding?.[floor] > 0 ? (
                                <Badge bg={floor === '2nd Floor' ? 'info' : floor === 'Tower B' ? 'success' : 'success'}>
                                  {company.byBuilding[floor]}
                                </Badge>
                              ) : <span className="text-muted">-</span>}
                            </td>
                          ))}
                          <td className="border-secondary">
                            <ProgressBar className="bg-gray-700">
                              {['Podium Floor','2nd Floor','Tower B'].map(floor => (
                                <ProgressBar
                                  key={floor}
                                  now={safePercent(company?.byBuilding?.[floor], total)}
                                  variant={floor === '2nd Floor' ? 'info' : floor === 'Tower B' ? 'success' : 'success'}
                                />
                              ))}
                            </ProgressBar>
                          </td>
                          <td className="border-secondary">
                            <small>{(company?.locations || []).slice(0,2).join(', ')}{(company?.locations || []).length > 2 ? '...' : ''}</small>
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