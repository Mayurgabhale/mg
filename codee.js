// CompanySummary.jsx
import React, { useState, useMemo } from 'react';
import {
  Container, Row, Col, Card, Table, Badge, ProgressBar, Form
} from 'react-bootstrap';
import {
  FaTrophy, FaMedal, FaChartBar, FaBuilding, FaUsers, FaClock
} from 'react-icons/fa6';

const CompanySummary = ({
  detailsData = {},
  personnelBreakdown = [],
  zoneBreakdown = [],
  floorBreakdown = []   // <-- NEW
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

    // ✅ Use floorBreakdown to build totals instead of recalculating
    const buildingTotals = floorBreakdown.reduce((acc, floor) => {
      acc[floor.floor] = floor.total || 0;
      return acc;
    }, { 'Podium Floor': 0, '2nd Floor': 0, 'Tower B': 0 });

    return {
      companies: companyArray,
      totalCount,
      buildingTotals
    };
  }, [detailsData, floorBreakdown]);

  // --- Filtered companies ---
  const filteredCompanies = useMemo(() => {
    const comps = companyData?.companies || [];
    if (selectedBuilding === 'all') return comps;
    return comps.filter(company => (company.byBuilding?.[selectedBuilding] || 0) > 0);
  }, [companyData?.companies, selectedBuilding]);

  // --- Podium winners ---
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

  // util
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

      {/* Company Table (unchanged) */}
      {/* ... keep your existing company table code here ... */}
    </Container>
  );
};

export default CompanySummary;