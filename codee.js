Uncaught runtime errors:
×
ERROR
Cannot access 'getBuildingFromZone' before initialization
ReferenceError: Cannot access 'getBuildingFromZone' before initialization
    at http://localhost:3000/static/js/src_components_CompanySummary_jsx.chunk.js:55:28
    at Array.forEach (<anonymous>)
    at http://localhost:3000/static/js/src_components_CompanySummary_jsx.chunk.js:53:23
    at Array.forEach (<anonymous>)
    at http://localhost:3000/static/js/src_components_CompanySummary_jsx.chunk.js:51:32
    at mountMemo (http://localhost:3000/static/js/bundle.js:30346:21)
    at Object.useMemo (http://localhost:3000/static/js/bundle.js:38555:16)
    at exports.useMemo (http://localhost:3000/static/js/bundle.js:74070:32)
    at CompanySummary (http://localhost:3000/static/js/src_components_CompanySummary_jsx.chunk.js:46:69)
    at react-stack-bottom-frame (http://localhost:3000/static/js/bundle.js:39438:18)



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




// C:\Users\W0024618\Desktop\swipeData\employee-ai-insights\controllers\liveOccupancyController.js
const { DateTime } = require('luxon');
const { sql, getPool } = require('../config/db');

const doorZoneMap  = require('../data/doorZoneMap');
const zoneFloorMap = require('../data/zoneFloorMap');
const ertMembers   = require('../data/puneErtMembers.json');

// Track which door→zone keys we've already warned on
const warnedKeys = new Set();

// --- Helpers ---

function getTodayString() {
  return DateTime.now().setZone('Asia/Kolkata').toFormat('yyyy-LL-dd');
}

function normalizeZoneKey(rawDoor, rawDir) {
  let door = String(rawDoor || '').trim();
  door = door.replace(/_[0-9A-F]{2}:[0-9A-F]{2}:[0-9A-F]{2}$/, '');
  door = door.replace(/\s+/g, ' ').toUpperCase();
  const dir = rawDir === 'InDirection' ? 'InDirection' : 'OutDirection';
  return `${door}___${dir}`;
}

function normalizePersonName(raw) {
  let n = String(raw || '').trim();
  if (n.includes(',')) {
    const [last, rest] = n.split(',', 2);
    n = `${rest.trim()} ${last.trim()}`;
  }
  return n.toLowerCase();
}

function mapDoorToZone(rawDoor, rawDir) {
  const key = normalizeZoneKey(rawDoor, rawDir);
  const zone = doorZoneMap[key];
  if (!zone) {
    if (!warnedKeys.has(key)) {
      console.warn('⛔ Unmapped door–direction key:', key);
      warnedKeys.add(key);
    }
    return 'Unknown Zone';
  }
  return zone;
}

// --- Core functions ---

async function fetchNewEvents(since) {
  const pool = await getPool();
  const req  = pool.request();
  req.input('since', sql.DateTime2, since);

  const { recordset } = await req.query(`
    WITH CombinedQuery AS (
      SELECT
        DATEADD(MINUTE, -1 * t1.MessageLocaleOffset, t1.MessageUTC) AS LocaleMessageTime,
        t1.ObjectName1,
        CASE
          WHEN t3.Name IN ('Contractor','Terminated Contractor') THEN t2.Text12
          ELSE CAST(t2.Int1 AS NVARCHAR)
        END AS EmployeeID,
        t1.ObjectIdentity1 AS PersonGUID,
        t3.Name AS PersonnelType,
        COALESCE(
          TRY_CAST(t_xml.XmlMessage AS XML).value('(/LogMessage/CHUID/Card)[1]','varchar(50)'),
          TRY_CAST(t_xml.XmlMessage AS XML).value('(/LogMessage/CHUID)[1]','varchar(50)'),
          sc.value
        ) AS CardNumber,
        t5a.value AS AdmitCode,
        t5d.value AS Direction,
        t1.ObjectName2 AS Door,
        t2.Text4 AS CompanyName,          -- ✅ added
      t2.Text5 AS PrimaryLocation       -- ✅ added
      FROM [ACVSUJournal_00010029].[dbo].[ACVSUJournalLog] t1
      LEFT JOIN [ACVSCore].[Access].[Personnel] t2 ON t1.ObjectIdentity1 = t2.GUID
      LEFT JOIN [ACVSCore].[Access].[PersonnelType] t3 ON t2.PersonnelTypeId = t3.ObjectID
      LEFT JOIN [ACVSUJournal_00010029].[dbo].[ACVSUJournalLogxmlShred] t5a
        ON t1.XmlGUID = t5a.GUID AND t5a.Name = 'AdmitCode'
      LEFT JOIN [ACVSUJournal_00010029].[dbo].[ACVSUJournalLogxmlShred] t5d
        ON t1.XmlGUID = t5d.GUID AND t5d.Value IN ('InDirection','OutDirection')
      LEFT JOIN [ACVSUJournal_00010029].[dbo].[ACVSUJournalLogxml] t_xml
        ON t1.XmlGUID = t_xml.GUID
      LEFT JOIN (
        SELECT GUID, value
        FROM [ACVSUJournal_00010029].[dbo].[ACVSUJournalLogxmlShred]
        WHERE Name IN ('Card','CHUID')
      ) sc ON t1.XmlGUID = sc.GUID
      WHERE
        t1.MessageType = 'CardAdmitted'
        AND t1.PartitionName2 = 'APAC.Default'
        AND DATEADD(MINUTE, -1 * t1.MessageLocaleOffset, t1.MessageUTC) > @since
    )
    SELECT
      LocaleMessageTime,
      CONVERT(VARCHAR(10), LocaleMessageTime, 23) AS Dateonly,
      CONVERT(VARCHAR(8), LocaleMessageTime, 108) AS Swipe_Time,
      EmployeeID,
      PersonGUID,
      ObjectName1,
      PersonnelType,
      CardNumber,
      AdmitCode,
      Direction,
      Door,
      CompanyName,         -- ✅ 
      PrimaryLocation      -- ✅ 
    FROM CombinedQuery
    ORDER BY LocaleMessageTime ASC;
  `);

  return recordset;
}

async function buildOccupancy(allEvents) {
  const current      = {};
  const uniquePeople = new Map();

  for (const evt of allEvents) {
    const {
      EmployeeID, PersonGUID,
      ObjectName1, PersonnelType,
      CardNumber, Dateonly,
      Swipe_Time, Direction, Door
    } = evt;

    const dedupKey = PersonGUID || EmployeeID || CardNumber || ObjectName1;
    const zoneRaw  = mapDoorToZone(Door, Direction);

    if (zoneRaw === 'Unknown Zone') continue;

    const zoneLower = zoneRaw.toLowerCase();

    if (Direction === 'OutDirection') {
      if (zoneLower === 'out of office') {
        uniquePeople.delete(dedupKey);
        delete current[dedupKey];
      } else {
        uniquePeople.set(dedupKey, PersonnelType);
        current[dedupKey] = { Dateonly, Swipe_Time, EmployeeID, ObjectName1, CardNumber, PersonnelType, zone: zoneRaw, door: Door, CompanyName: evt.CompanyName || null,  PrimaryLocation: evt.PrimaryLocation || null  };
      }
      continue;
    }

    if (Direction === 'InDirection') {
      uniquePeople.set(dedupKey, PersonnelType);
      current[dedupKey] = { Dateonly, Swipe_Time, EmployeeID, ObjectName1, CardNumber, PersonnelType, zone: zoneRaw, door: Door, Direction,CompanyName: evt.CompanyName || null, PrimaryLocation: evt.PrimaryLocation || null  };
      continue;
    }

    uniquePeople.delete(dedupKey);
    delete current[dedupKey];
  }

  let employeeCount = 0;
  let contractorCount = 0;
  for (const pt of uniquePeople.values()) {
    if (['Employee','Terminated Personnel'].includes(pt)) employeeCount++;
    else contractorCount++;
  }

  const zoneMap = {};
  for (const emp of Object.values(current)) {
    const zKey = emp.zone.toLowerCase();
    if (zKey === 'out of office') continue;
    zoneMap[emp.zone] = zoneMap[emp.zone] || [];
    zoneMap[emp.zone].push(emp);
  }

  const zoneDetails = Object.fromEntries(
    Object.entries(zoneMap).map(([zone, emps]) => {
      const byType = emps.reduce((acc, e) => {
        acc[e.PersonnelType] = (acc[e.PersonnelType] || 0) + 1;
        return acc;
      }, {});
      return [zone, { total: emps.length, byPersonnelType: byType, employees: emps }];
    })
  );

  const floorMap = {};
  for (const [zone, data] of Object.entries(zoneDetails)) {
    const floor = zoneFloorMap[zone] || 'Unknown Floor';
    floorMap[floor] = floorMap[floor] || { total: 0, byPersonnelType: {} };
    floorMap[floor].total += data.total;
    for (const [pt, c] of Object.entries(data.byPersonnelType)) {
      floorMap[floor].byPersonnelType[pt] = (floorMap[floor].byPersonnelType[pt] || 0) + c;
    }
  }

  const ertStatus = Object.fromEntries(
    Object.entries(ertMembers).map(([role, members]) => {
      const list = members.map(m => {
        const rawName = m.name || m.Name;
        const expected = normalizePersonName(rawName);
        const matchEvt = Object.values(current).find(e => normalizePersonName(e.ObjectName1) === expected);
        return { ...m, present: !!matchEvt, zone: matchEvt ? matchEvt.zone : null };
      });
      return [role, list];
    })
  );

  return {
    asOf: new Date().toISOString(),
    summary: Object.entries(zoneDetails).map(([z,d])=>({ zone: z, count: d.total })),
    zoneBreakdown: Object.entries(zoneDetails).map(([z,d])=>({ zone: z, ...d.byPersonnelType, total: d.total })),
    floorBreakdown: Object.entries(floorMap).map(([f,d])=>({ floor: f, ...d.byPersonnelType, total: d.total })),
    details: zoneMap,
    personnelSummary: { employees: employeeCount, contractors: contractorCount },
    ertStatus,
    personnelBreakdown: (() => {
      const map = new Map();
      for (const pt of uniquePeople.values()) map.set(pt, (map.get(pt)||0)+1);
      return Array.from(map, ([personnelType, count]) => ({ personnelType, count }));
    })()
  };
}

function buildVisitedToday(allEvents, asOf) {
  let today;
  if (asOf) {
    if (typeof asOf === 'string') today = asOf;
    else if (asOf instanceof Date) today = DateTime.fromJSDate(asOf, { zone: 'Asia/Kolkata' }).toFormat('yyyy-LL-dd');
    else if (asOf && typeof asOf.toFormat === 'function') today = asOf.setZone('Asia/Kolkata').toFormat('yyyy-LL-dd');
    else today = DateTime.now().setZone('Asia/Kolkata').toFormat('yyyy-LL-dd');
  } else today = DateTime.now().setZone('Asia/Kolkata').toFormat('yyyy-LL-dd');

  const todayIns = allEvents.filter(evt => evt.Direction === 'InDirection' && evt.Dateonly === today);
  const dedup = new Map();
  for (const e of todayIns) {
    const key = e.PersonGUID;
    const prev = dedup.get(key);
    if (!prev || e.LocaleMessageTime > prev.LocaleMessageTime) dedup.set(key, e);
  }
  const finalList = Array.from(dedup.values());
  const employees = finalList.filter(e => !['Contractor','Terminated Contractor','Temp Badge','Visitor','Property Management'].includes(e.PersonnelType)).length;
  const contractors = finalList.length - employees;
  return { employees, contractors, total: finalList.length };
}


// --- SSE endpoint ---


exports.getLiveOccupancy = async (req, res) => {
  try {
    await getPool();

    res.writeHead(200, {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      'Connection': 'keep-alive',
    });
    res.write('\n');

    let lastSeen = new Date();
    const events = [];

    const push = async () => {
      // fetch only new events since lastSeen
      const fresh = await fetchNewEvents(lastSeen);
      if (fresh.length) {
        lastSeen = new Date();
        events.push(...fresh);
      }

      // build live snapshot
      const occupancy = await buildOccupancy(events);
      const todayStats = buildVisitedToday(events);
      occupancy.totalVisitedToday = todayStats.total;
      occupancy.visitedToday = { ...todayStats };

      // send snapshot every second
      const sid = Date.now();
      res.write(`id: ${sid}\n`);
      res.write(`data: ${JSON.stringify(occupancy)}\n\n`);

      if (typeof res.flush === 'function') res.flush();
    };

    // push immediately, then every 1 second
    await push();
    const timer = setInterval(push, 1000);

    req.on('close', () => clearInterval(timer));
  } catch (err) {
    console.error('Live occupancy SSE error:', err);
    if (!res.headersSent) {
      res.status(500).json({ error: 'Internal Server Error' });
    }
  }
};




// GET /api/occupancy-at-time-pune?date=YYYY-MM-DD&time=HH:MM[:SS]
exports.getPuneSnapshotAtDateTime = async (req, res) => {
  try {
    const { date, time } = req.query;
    if (!date || !time) {
      return res.status(400).json({
        error: 'missing query params: expected ?date=YYYY-MM-DD&time=HH:MM[:SS]'
      });
    }

    // Validate date
    const dateMatch = /^(\d{4})-(\d{2})-(\d{2})$/.exec(date);
    if (!dateMatch) {
      return res.status(400).json({ error: 'invalid "date" format; expected YYYY-MM-DD' });
    }

    // Validate time
    const timeMatch = /^([0-1]\d|2[0-3]):([0-5]\d)(?::([0-5]\d))?$/.exec(time);
    if (!timeMatch) {
      return res.status(400).json({ error: 'invalid "time" format; expected HH:MM or HH:MM:SS' });
    }

    const year   = Number(dateMatch[1]);
    const month  = Number(dateMatch[2]);
    const day    = Number(dateMatch[3]);
    const hour   = Number(timeMatch[1]);
    const minute = Number(timeMatch[2]);
    const second = timeMatch[3] ? Number(timeMatch[3]) : 0;

    // Build Pune-local datetime
    const atDt = DateTime.fromObject(
      { year, month, day, hour, minute, second, millisecond: 0 },
      { zone: 'Asia/Kolkata' }
    );

    if (!atDt.isValid) {
      return res.status(400).json({ error: 'invalid date+time combination' });
    }

    // Convert to UTC for SQL boundary
    const untilUtc = atDt.setZone('utc').toJSDate();

    // -----------------
    // Step 1: fetch events in 24h window ending at atDt
    const pool = await getPool();
    const reqDb = pool.request();
    reqDb.input('until', sql.DateTime2, untilUtc);

    const { recordset } = await reqDb.query(`
      WITH CombinedQuery AS (
        SELECT
          t1.MessageUTC,   -- always UTC
          t1.ObjectName1,
          CASE
            WHEN t3.Name IN ('Contractor','Terminated Contractor') THEN t2.Text12
            ELSE CAST(t2.Int1 AS NVARCHAR)
          END AS EmployeeID,
          t1.ObjectIdentity1 AS PersonGUID,
          t3.Name AS PersonnelType,
          COALESCE(
            TRY_CAST(t_xml.XmlMessage AS XML).value('(/LogMessage/CHUID/Card)[1]','varchar(50)'),
            TRY_CAST(t_xml.XmlMessage AS XML).value('(/LogMessage/CHUID)[1]','varchar(50)'),
            sc.value
          ) AS CardNumber,
          t5a.value AS AdmitCode,
          t5d.value AS Direction,
          t1.ObjectName2 AS Door,
           t2.Text4 AS CompanyName,          -- ✅ added
           t2.Text5 AS PrimaryLocation       -- ✅ added
        FROM [ACVSUJournal_00010029].[dbo].[ACVSUJournalLog] t1
        LEFT JOIN [ACVSCore].[Access].[Personnel]     t2 ON t1.ObjectIdentity1 = t2.GUID
        LEFT JOIN [ACVSCore].[Access].[PersonnelType] t3 ON t2.PersonnelTypeId = t3.ObjectID
        LEFT JOIN [ACVSUJournal_00010029].[dbo].[ACVSUJournalLogxmlShred] t5a
          ON t1.XmlGUID = t5a.GUID AND t5a.Name = 'AdmitCode'
        LEFT JOIN [ACVSUJournal_00010029].[dbo].[ACVSUJournalLogxmlShred] t5d
          ON t1.XmlGUID = t5d.GUID AND t5d.Value IN ('InDirection','OutDirection')
        LEFT JOIN [ACVSUJournal_00010029].[dbo].[ACVSUJournalLogxml] t_xml
          ON t1.XmlGUID = t_xml.GUID
        LEFT JOIN (
          SELECT GUID, value
          FROM [ACVSUJournal_00010029].[dbo].[ACVSUJournalLogxmlShred]
          WHERE Name IN ('Card','CHUID')
        ) sc ON t1.XmlGUID = sc.GUID
        WHERE
          t1.MessageType     = 'CardAdmitted'
          AND t1.PartitionName2 = 'APAC.Default'
          AND t1.MessageUTC <= @until
          AND DATEADD(HOUR, -24, @until) < t1.MessageUTC
      )
      SELECT *
      FROM CombinedQuery
      ORDER BY MessageUTC ASC;
    `);

    // -----------------
    // Step 2: convert UTC → Asia/Kolkata
    const events = recordset.map(e => {
      const local = DateTime.fromJSDate(e.MessageUTC, { zone: 'utc' })
                            .setZone('Asia/Kolkata');
      return {
        ...e,
        LocaleMessageTime: local.toISO(),
        Dateonly: local.toFormat('yyyy-LL-dd'),
        Swipe_Time: local.toFormat('HH:mm:ss'),
      };
    });

    // -----------------
    // Step 3: filter only same Pune date
    const targetDate = atDt.toFormat('yyyy-LL-dd');
    const filtered = events.filter(e => e.Dateonly === targetDate);

    // Step 4: build occupancy snapshot
    const occupancy = await buildOccupancy(filtered);

    // Step 5: visited-today counts aligned to atDt
    // const visitedStats = buildVisitedToday(filtered);
    
    const visitedStats = buildVisitedToday(filtered, atDt);  // this add new code as per function buildVisitedToday change 📝 📝

    // ---- Output timestamps ----
    occupancy.asOfLocal = atDt.toISO(); // Pune-local with offset
    occupancy.asOfUTC   = `${date}T${String(hour).padStart(2,'0')}:${String(minute).padStart(2,'0')}:${String(second).padStart(2,'0')}Z`;

    occupancy.totalVisitedToday = visitedStats.total;
    occupancy.visitedToday = visitedStats;

    return res.json(occupancy);
  } catch (err) {
    console.error('getPuneSnapshotAtDateTime error:', err);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
};
