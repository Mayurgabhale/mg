// C:\Users\W0024618\Desktop\swipeData\client\src\components\CompanyAnalytics.jsx
import React, { useState, useMemo } from 'react';
import {
  Container, Row, Col, Card, Table, Badge, Modal, Button,
  Form, ProgressBar
} from 'react-bootstrap';
import {
  FaTrophy, FaMedal, FaChartBar, FaBuilding, FaUsers,
  FaArrowTrendUp, FaSearch, FaFilter
} from 'react-icons/fa6';

const CompanyAnalytics = ({
  detailsData = {},
  personnelBreakdown = [],
  zoneBreakdown = [],
  floorBreakdown = []
}) => {
  const [selectedBuilding, setSelectedBuilding] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [modalTitle, setModalTitle] = useState('');
  const [modalRows, setModalRows] = useState([]);

  // Process company data
  const companyData = useMemo(() => {
    const companies = {};
    let totalCount = 0;
    const buildingTotals = { 'Podium Floor': 0, '2nd Floor': 0, 'Tower B': 0 };

    Object.values(detailsData || {}).forEach(zoneEmployees => {
      if (Array.isArray(zoneEmployees)) {
        zoneEmployees.forEach(employee => {
          const companyName = employee?.CompanyName || 'Unknown Company';
          const building = getBuildingFromZone(employee?.zone);

          if (!building) return;

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
          if (employee?.PrimaryLocation) {
            companies[companyName].locations.add(employee.PrimaryLocation);
          }

          totalCount++;
          buildingTotals[building]++;
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

    return {
      companies: companyArray,
      totalCount,
      buildingTotals
    };
  }, [detailsData]);

  const getBuildingFromZone = (zone) => {
    if (!zone) return null;
    const z = String(zone).toLowerCase();

    if (z.includes('podium')) return 'Podium Floor';
    if (z.includes('2nd')) return '2nd Floor';
    if (z.includes('tower b')) return 'Tower B';

    return null;
  };

  // Filter companies
  const filteredCompanies = useMemo(() => {
    let comps = companyData?.companies || [];
    
    // Filter by building
    if (selectedBuilding !== 'all') {
      comps = comps.filter(company => (company.byBuilding?.[selectedBuilding] || 0) > 0);
    }
    
    // Filter by search term
    if (searchTerm) {
      comps = comps.filter(company => 
        company.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    return comps;
  }, [companyData?.companies, selectedBuilding, searchTerm]);

  // Podium winners
  const getPodiumWinners = () => {
    const podiumCompanies = (companyData?.companies || [])
      .filter(c => (c.byBuilding?.['Podium Floor'] || 0) > 0)
      .sort((a, b) => (b.byBuilding?.['Podium Floor'] || 0) - (a.byBuilding?.['Podium Floor'] || 0))
      .slice(0, 3);

    return podiumCompanies.map((c, idx) => ({
      name: c?.name || 'Unknown',
      count: c?.byBuilding?.['Podium Floor'] || 0,
      position: idx === 0 ? '1st' : idx === 1 ? '2nd' : '3rd',
      color: idx === 0 ? 'warning' : idx === 1 ? 'secondary' : 'danger'
    }));
  };

  const podiumWinners = getPodiumWinners();

  // Modal functions
  const openModalWithRows = (title, rows = []) => {
    setModalTitle(title || '');
    setModalRows(rows || []);
    setShowModal(true);
  };

  const handleCompanyClick = (company) => {
    const rows = (company?.employees || []).map((r, i) => ({
      idx: i + 1,
      name: r?.ObjectName1 || r?.Name || '—',
      employeeId: r?.EmployeeID || '',
      cardNumber: r?.CardNumber || '',
      personnelType: r?.PersonnelType || '',
      primaryLocation: r?.PrimaryLocation || '',
      zone: r?.zone || ''
    }));
    openModalWithRows(company?.name || 'Company Details', rows);
  };

  const handleBuildingClick = (buildingName) => {
    const allEmployees = [];
    (companyData?.companies || []).forEach(c => {
      (c.employees || []).forEach(r => {
        const b = getBuildingFromZone(r?.zone);
        if (b === buildingName) {
          allEmployees.push({
            name: r?.ObjectName1 || r?.Name || '—',
            employeeId: r?.EmployeeID || '',
            cardNumber: r?.CardNumber || '',
            personnelType: r?.PersonnelType || '',
            primaryLocation: r?.PrimaryLocation || '',
            company: r?.CompanyName || 'Unknown Company',
            zone: r?.zone || ''
          });
        }
      });
    });

    allEmployees.sort((a, b) => {
      if ((a.company || '') !== (b.company || '')) return (a.company || '').localeCompare(b.company || '');
      return (a.name || '').localeCompare(b.name || '');
    });

    const rows = allEmployees.map((r, i) => ({
      idx: i + 1,
      name: r.name,
      employeeId: r.employeeId,
      cardNumber: r.cardNumber,
      personnelType: r.personnelType,
      primaryLocation: r.primaryLocation,
      company: r.company,
      zone: r.zone
    }));

    openModalWithRows(`${buildingName} — Occupants`, rows);
  };

  const handleCompanyBuildingClick = (company, buildingName) => {
    const rows = (company?.employees || [])
      .filter(r => getBuildingFromZone(r?.zone) === buildingName)
      .map((r, i) => ({
        idx: i + 1,
        name: r?.ObjectName1 || r?.Name || '—',
        employeeId: r?.EmployeeID || '',
        cardNumber: r?.CardNumber || '',
        personnelType: r?.PersonnelType || '',
        primaryLocation: r?.PrimaryLocation || '',
        zone: r?.zone || ''
      }));

    openModalWithRows(`${company?.name || 'Company'} — ${buildingName}`, rows);
  };

  return (
    <Container fluid className="company-analytics-page">
      {/* Page Header */}
      <Row className="mb-4">
        <Col>
          <div className="page-header">
            <div>
              <h2 className="text-primary mb-2">
                <FaBuilding className="me-3" />
                Company Analytics Dashboard
              </h2>
              <p className="text-muted mb-0">
                Comprehensive analysis of company presence and distribution across facilities
              </p>
            </div>
            <Badge bg="primary" className="fs-6 px-3 py-2">
              <FaUsers className="me-2" />
              Total: {companyData?.totalCount || 0} People
            </Badge>
          </div>
        </Col>
      </Row>

      {/* Filters and Search */}
      <Row className="mb-4">
        <Col md={6}>
          <Card className="filter-card">
            <Card.Body>
              <div className="d-flex align-items-center">
                <FaFilter className="text-muted me-2" />
                <Form.Select 
                  value={selectedBuilding}
                  onChange={(e) => setSelectedBuilding(e.target.value)}
                  className="me-3"
                >
                  <option value="all">All Buildings</option>
                  <option value="Podium Floor">Podium Floor</option>
                  <option value="2nd Floor">2nd Floor</option>
                  <option value="Tower B">Tower B</option>
                </Form.Select>
                <div className="search-box">
                  <FaSearch className="search-icon" />
                  <Form.Control
                    type="text"
                    placeholder="Search companies..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              </div>
            </Card.Body>
          </Card>
        </Col>
        <Col md={6}>
          <Row>
            <Col>
              <Card className="stat-card h-100">
                <Card.Body className="text-center">
                  <FaBuilding className="text-primary fs-1 mb-2" />
                  <h4 className="text-primary">{companyData?.companies?.length || 0}</h4>
                  <p className="text-muted mb-0">Active Companies</p>
                </Card.Body>
              </Card>
            </Col>
            <Col>
              <Card className="stat-card h-100">
                <Card.Body className="text-center">
                  <FaArrowTrendUp className="text-success fs-1 mb-2" />
                  <h4 className="text-success">{companyData?.totalCount || 0}</h4>
                  <p className="text-muted mb-0">Total Presence</p>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Col>
      </Row>

      {/* Building Statistics */}
      <Row className="mb-4">
        <Col md={4}>
          <Card 
            className="building-card podium-card h-100 clickable"
            onClick={() => handleBuildingClick('Podium Floor')}
          >
            <Card.Body>
              <div className="d-flex justify-content-between align-items-start mb-3">
                <div>
                  <h6 className="card-label">PODIUM FLOOR</h6>
                  <h3 className="text-primary mb-0">{companyData?.buildingTotals?.['Podium Floor'] || 0}</h3>
                </div>
                <FaUsers className="text-primary fs-3" />
              </div>
              <p className="text-muted mb-0">Current occupancy</p>
            </Card.Body>
          </Card>
        </Col>
        <Col md={4}>
          <Card 
            className="building-card second-floor-card h-100 clickable"
            onClick={() => handleBuildingClick('2nd Floor')}
          >
            <Card.Body>
              <div className="d-flex justify-content-between align-items-start mb-3">
                <div>
                  <h6 className="card-label">2ND FLOOR</h6>
                  <h3 className="text-info mb-0">{companyData?.buildingTotals?.['2nd Floor'] || 0}</h3>
                </div>
                <FaUsers className="text-info fs-3" />
              </div>
              <p className="text-muted mb-0">Current occupancy</p>
            </Card.Body>
          </Card>
        </Col>
        <Col md={4}>
          <Card 
            className="building-card tower-b-card h-100 clickable"
            onClick={() => handleBuildingClick('Tower B')}
          >
            <Card.Body>
              <div className="d-flex justify-content-between align-items-start mb-3">
                <div>
                  <h6 className="card-label">TOWER B</h6>
                  <h3 className="text-warning mb-0">{companyData?.buildingTotals?.['Tower B'] || 0}</h3>
                </div>
                <FaUsers className="text-warning fs-3" />
              </div>
              <p className="text-muted mb-0">Current occupancy</p>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Podium Leaderboard */}
      {podiumWinners.length > 0 && (
        <Row className="mb-4">
          <Col>
            <Card className="leaderboard-card">
              <Card.Header className="bg-primary text-white">
                <h5 className="mb-0">
                  <FaTrophy className="me-2" />
                  Podium Floor Leaderboard
                </h5>
              </Card.Header>
              <Card.Body>
                <Row className="text-center">
                  {podiumWinners.map((winner, index) => (
                    <Col md={4} key={index}>
                      <div className={`podium-item ${winner.position.toLowerCase()}`}>
                        <div className={`podium-badge bg-${winner.color} text-white`}>
                          {winner.position === '1st' ? <FaTrophy /> : <FaMedal />}
                        </div>
                        <h6 className="company-name">{winner.name}</h6>
                        <Badge bg={winner.color} className="fs-6">
                          {winner.count} people
                        </Badge>
                      </div>
                    </Col>
                  ))}
                </Row>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      )}

      {/* Company Table */}
      <Row>
        <Col>
          <Card className="data-card">
            <Card.Header className="bg-light">
              <h5 className="mb-0">
                <FaChartBar className="me-2" />
                Company Distribution Overview
              </h5>
            </Card.Header>
            <Card.Body className="p-0">
              <div className="table-responsive">
                <Table hover className="mb-0">
                  <thead className="table-light">
                    <tr>
                      <th>Rank</th>
                      <th>Company Name</th>
                      <th className="text-center">Total</th>
                      <th className="text-center">Podium Floor</th>
                      <th className="text-center">2nd Floor</th>
                      <th className="text-center">Tower B</th>
                      <th className="text-center">Distribution</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredCompanies.map((company, index) => {
                      const podiumCount = company?.byBuilding?.['Podium Floor'] || 0;
                      const secondFloorCount = company?.byBuilding?.['2nd Floor'] || 0;
                      const towerBCount = company?.byBuilding?.['Tower B'] || 0;
                      const total = company?.total || 0;

                      return (
                        <tr key={company?.name || index}>
                          <td>
                            <Badge bg={index < 3 ? 'primary' : 'light'} text={index < 3 ? 'white' : 'dark'}>
                              #{index + 1}
                            </Badge>
                          </td>
                          <td>
                            <span 
                              className="company-name clickable"
                              onClick={() => handleCompanyClick(company)}
                            >
                              {company?.name}
                            </span>
                          </td>
                          <td className="text-center">
                            <Badge bg="dark" className="fs-6">
                              {total}
                            </Badge>
                          </td>
                          <td className="text-center">
                            {podiumCount > 0 ? (
                              <Badge
                                bg="primary"
                                className="clickable fs-6"
                                onClick={() => handleCompanyBuildingClick(company, 'Podium Floor')}
                              >
                                {podiumCount}
                              </Badge>
                            ) : '-'}
                          </td>
                          <td className="text-center">
                            {secondFloorCount > 0 ? (
                              <Badge
                                bg="info"
                                className="clickable fs-6"
                                onClick={() => handleCompanyBuildingClick(company, '2nd Floor')}
                              >
                                {secondFloorCount}
                              </Badge>
                            ) : '-'}
                          </td>
                          <td className="text-center">
                            {towerBCount > 0 ? (
                              <Badge
                                bg="warning"
                                className="clickable fs-6"
                                onClick={() => handleCompanyBuildingClick(company, 'Tower B')}
                              >
                                {towerBCount}
                              </Badge>
                            ) : '-'}
                          </td>
                          <td>
                            <ProgressBar className="distribution-bar">
                              <ProgressBar 
                                now={(podiumCount / total) * 100}
                                variant="primary"
                                label={podiumCount > 0 ? `${Math.round((podiumCount / total) * 100)}%` : ''}
                              />
                              <ProgressBar 
                                now={(secondFloorCount / total) * 100}
                                variant="info"
                                label={secondFloorCount > 0 ? `${Math.round((secondFloorCount / total) * 100)}%` : ''}
                              />
                              <ProgressBar 
                                now={(towerBCount / total) * 100}
                                variant="warning"
                                label={towerBCount > 0 ? `${Math.round((towerBCount / total) * 100)}%` : ''}
                              />
                            </ProgressBar>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </Table>
              </div>
              {filteredCompanies.length === 0 && (
                <div className="text-center text-muted py-5">
                  <FaBuilding className="fs-1 mb-3" />
                  <h5>No companies found</h5>
                  <p>Try adjusting your filters or search terms</p>
                </div>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Modal */}
      <Modal show={showModal} onHide={() => setShowModal(false)} size="xl" scrollable>
        <Modal.Header closeButton className="bg-light">
          <Modal.Title>{modalTitle}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {modalRows.length > 0 ? (
            <Table striped hover>
              <thead className="table-light">
                <tr>
                  {modalRows[0]?.company && <th>Company</th>}
                  <th>#</th>
                  <th>Name</th>
                  <th>Employee ID</th>
                  <th>Card Number</th>
                  <th>Type</th>
                  <th>Location</th>
                  <th>Zone</th>
                </tr>
              </thead>
              <tbody>
                {modalRows.map((row, index) => (
                  <tr key={index}>
                    {row.company && <td>{row.company}</td>}
                    <td>{row.idx}</td>
                    <td className="fw-semibold">{row.name}</td>
                    <td>{row.employeeId || '-'}</td>
                    <td>{row.cardNumber || '-'}</td>
                    <td>
                      <Badge bg="light" text="dark" className="text-xs">
                        {row.personnelType || '-'}
                      </Badge>
                    </td>
                    <td>{row.primaryLocation || '-'}</td>
                    <td>
                      <small className="text-muted">{row.zone || '-'}</small>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          ) : (
            <div className="text-center py-4 text-muted">
              No data available
            </div>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="primary" onClick={() => setShowModal(false)}>
        