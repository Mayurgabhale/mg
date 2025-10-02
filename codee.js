in this only Tower B Occupancy are disply other are not disply, ok, 
  i give you other code, more your referensce ok. in bottom side check alos this 

0
Podium Floor Occupancy

0
2nd Floor Occupancy

2
Tower B Occupancy
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
          if (!building) return; // 

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
*********** CHECK THIS CODE FOR YOUR REFERENCE ******************
  

// src/components/FloorOccupancyChart.jsx
import React from 'react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Cell,
  LabelList,
  Legend,
  Customized
} from 'recharts';
import { Card } from 'react-bootstrap';
import {
  FaSearch,
  FaStar,
  FaEnvelope,
  FaChartBar,
  FaUsers
} from 'react-icons/fa';
import floorCapacities from '../constants/floorCapacities';

/*
  COLOR PALETTE: distinct gradient pairs for each cylinder (repeats if more floors)
*/
const CYLINDER_COLORS = [
  ['#BEE9FF', '#4DB8FF'], // light -> mid blue
  ['#0B4F8C', '#2F80ED'], // dark -> lighter blue
  ['#F27FA6', '#B93F72'], // pink shades
  ['#FFB84D', '#F26B00'], // orange shades
  ['#C6F28B', '#4DB646']  // green shades
];

/*
  ICONS: map icons per cylinder (repeats if more floors)
*/
const CYLINDER_ICONS = [FaUsers, FaStar, FaEnvelope, FaChartBar, FaSearch];

export default function FloorOccupancyChart({ data = [] }) {
  if (!data.length) {
    return (
      <Card body className="bg-dark text-white">
        No floor data available
      </Card>
    );
  }

  // -------------------------------
  // YOUR LOGIC: enrichment, totals,
  // sorting — left exactly as you had it
  // -------------------------------
  const enriched = data.map((floorObj) => {
    const { floor, total: liveCount } = floorObj;
    const capacity = floorCapacities[floor] ?? 0;
    const usedPct = capacity > 0
      ? ((liveCount / capacity) * 100).toFixed(1)
      : '0.0';
    return {
      ...floorObj,           // includes breakdown fields: employees, contractors, etc.
      capacity,
      liveCount,
      usedPct: Number(usedPct),
      label: `${liveCount}/${capacity}`
    };
  });

  // 2) Compute “Pune Office Total” across all floors
  const totalLive = enriched.reduce((sum, f) => sum + f.liveCount, 0);
  const totalCap = enriched.reduce((sum, f) => sum + f.capacity, 0);
  const totalUsedPct = totalCap > 0
    ? ((totalLive / totalCap) * 100).toFixed(1)
    : '0.0';

  const totalEntry = {
    floor: 'Pune Office Total',
    liveCount: totalLive,
    capacity: totalCap,
    usedPct: Number(totalUsedPct),
    label: `${totalLive}/${totalCap}`
  };

  // 3) Sort floors by liveCount descending, then prepend “Pune Office Total”
  const sortedFloors = [...enriched].sort((a, b) => b.liveCount - a.liveCount);
  const chartData = [totalEntry, ...sortedFloors];

  // 4) Determine the maximum capacity to set Y-axis domain
  const maxCapacity = Math.max(...chartData.map(f => f.capacity)) || 0;
  // NEW: determine maximum live count (used to scale the Y axis so bars appear taller)
  const maxLive = Math.max(...chartData.map(f => f.liveCount)) || 0;
  // compute a display max slightly above maxLive for breathing room and round to nearest 10
  const yDomainMax = Math.ceil((maxLive * 1.15 || maxCapacity) / 10) * 10;

  // 5) Custom tooltip to show raw counts, percentages, and breakdown (left intact)
  const renderTooltip = ({ active, payload }) => {
    if (!active || !payload?.length) return null;
    const floorObj = payload[0].payload;
    const { liveCount, capacity, usedPct } = floorObj;

    const breakdownEntries = Object.entries(floorObj).filter(
      ([key]) =>
        !['floor', 'liveCount', 'capacity', 'usedPct', 'label'].includes(key)
    );

    return (
      <div
        style={{
          backgroundColor: '#1a1a1a',
          color: '#FFD100',
          border: '1px solid var(--wu-yellow)',
          borderRadius: 4,
          padding: '0.75rem',
          minWidth: 200
        }}
      >
        <div style={{ marginBottom: 4, fontSize: '1rem' }}>
          <strong>Floor: {floorObj.floor}</strong>
        </div>
        <div style={{ marginBottom: 6, fontWeight: 'bold', fontSize: '0.9rem' }}>
          Live: {liveCount} / {capacity} ({usedPct}%)
        </div>
        {breakdownEntries.map(([type, value]) => (
          <div
            key={type}
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              marginTop: 2,
              color: '#fff',
              fontSize: '0.85rem'
            }}
          >
            <span style={{ opacity: 0.8 }}>
              {type.charAt(0).toUpperCase() + type.slice(1)}
            </span>
            <span style={{ fontWeight: 'bold' }}>{value}</span>
          </div>
        ))}
      </div>
    );
  };

  // -------------------------------
  // Cylinder shape (single cylinder per floor)
  // Recharts calls this with props: x, y, width, height, payload, etc.
  // We derive the index by matching payload.floor in chartData.
  // -------------------------------
// REPLACE CylinderShape with this
const CylinderShape = (props) => {
  const { x, y, width, height, payload } = props;
  const floorName = payload && payload.floor;
  const idx = chartData.findIndex(d => d.floor === floorName);
  const fill = `url(#cyl-grad-${idx})`;

  const cx = x + width / 2;
  const topRy = Math.max(8, width * 0.12);
  const bottomRy = Math.max(10, width * 0.14);
  const bottomY = y + height;

  // centered label (live/cap) — large and bold
  const centerLabel = payload && payload.label ? payload.label : '';

  return (
    <g>
      {/* shadow under the cylinder */}
      <ellipse
        cx={cx}
        cy={bottomY + bottomRy * 0.9}
        rx={width * 0.62}
        ry={bottomRy * 0.45}
        fill="rgba(0,0,0,0.25)"
      />

      {/* cylinder body */}
      <rect
        x={x}
        y={y}
        width={width}
        height={height}
        rx={12}
        ry={12}
        fill={fill}
        stroke="rgba(255,255,255,0.06)"
        strokeWidth={1}
      />

      {/* top ellipse */}
      {/* <ellipse
        cx={cx}
        cy={y}
        rx={width / 2}
        ry={topRy}
        fill={fill}
        stroke="rgba(255,255,255,0.12)"
        strokeWidth={1}
      /> */}

      {/* bottom ellipse for 3D look */}
      <ellipse
        cx={cx}
        cy={bottomY}
        rx={width / 2}
        ry={bottomRy}
        fill="rgba(255,255,255,0.03)"
      />

      {/* big centered count (live/cap) */}
      {centerLabel && (
        <text
          x={cx}
          // vertically center: use middle of cylinder body
          y={y + height / 2 + 8} 
          textAnchor="middle"
          fontSize={Math.max(12, Math.round(width * 0.18))}
          fontWeight="600"
          fill="#ffffff"
        >
          {centerLabel}
        </text>
      )}
    </g>
  );
};
  // -------------------------------
  // Curve overlay that passes exactly through the top centers of the bars
  // Customized component receives xAxisMap and yAxisMap we can use for exact pixel coords
  // -------------------------------
 // REPLACE your existing CurveOverlay/InfographicCurve with this simplified version
const CurveOverlay = ({ width, height, xAxisMap, yAxisMap }) => {
  const xKey = Object.keys(xAxisMap || {})[0];
  const yKey = Object.keys(yAxisMap || {})[0];

  if (!xKey || !yKey) return null;

  const xScale = xAxisMap[xKey].scale;
  const yScale = yAxisMap[yKey].scale;

  const points = chartData.map((d) => {
    const x = xScale(d.floor) + (xScale.bandwidth ? xScale.bandwidth() / 2 : 0);
    const y = yScale(d.liveCount);
    return { x, y };
  });

  if (points.length < 2) return null;

  // build smooth path
  let path = `M ${points[0].x} ${points[0].y}`;
  for (let i = 1; i < points.length; i++) {
    const prev = points[i - 1];
    const cur = points[i];
    const midX = (prev.x + cur.x) / 2;
    const midY = (prev.y + cur.y) / 2;
    path += ` Q ${prev.x} ${prev.y} ${midX} ${midY}`;
  }
  const last = points[points.length - 1];
  path += ` T ${last.x} ${last.y}`;

  return (
    <g>
      {/* faint grey helper line */}
      <path d={path} fill="none" stroke="#cccccc" strokeWidth={2} strokeOpacity={0.6} />
      {/* bright accent line on top */}
      <path d={path} fill="none" stroke="#FFD100" strokeWidth={3} strokeOpacity={0.9} strokeLinecap="round" />
    </g>
  );
};
  return (
    <Card className="mb- shadow-sm border" style={{ borderColor: 'var(--wu-yellow)' }}>
      <Card.Header className="bg-dark text-warning text-center fw-bold" style={{ borderBottom: '2px solid var(--wu-yellow)', fontSize: '1.2rem' }}>
        Western Union-Pune Headcount against Occupancy
      </Card.Header>

      {/* NEW: increase chart container height so cylinders can be taller */}
      <Card.Body style={{ height: '50vh', padding: 0, backgroundColor: 'var(--wu-gray-dark)' }}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={chartData}
            // NEW: more top margin so the curve + markers have space
            margin={{ top: 10, right: 24, left: 20, bottom: 40 }}
            // keep category gap but you can tweak to control cylinder spacing
            barCategoryGap="18%"
          >
            {/* define per-cylinder gradients */}
            <defs>
              {chartData.map((_, idx) => {
                const [c1, c2] = CYLINDER_COLORS[idx % CYLINDER_COLORS.length];
                return (
                  <linearGradient id={`cyl-grad-${idx}`} key={`cyl-grad-${idx}`} x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor={c1} stopOpacity={1} />
                    <stop offset="100%" stopColor={c2} stopOpacity={1} />
                  </linearGradient>
                );
              })}
            </defs>

            {/* <CartesianGrid stroke="#444" strokeDasharray="3 3" /> */}
            <XAxis
              dataKey="floor"
              tick={{ fontSize: 12, fill: '#fff' }}
              interval={0}
              height={80}
            />
            {/* NEW: use yDomainMax (derived from maxLive) to make bars visually larger */}
            <YAxis
              tick={{ fontSize: 13, fill: '#fff' }}
              domain={[0, yDomainMax]}
            />
            <Tooltip content={renderTooltip} />
            <Legend
              verticalAlign="top"
              align="center"
              wrapperStyle={{ color: '#fff', paddingBottom: 8 }}
              payload={[
                { value: 'Live HeadCount', type: 'square', color: '#4DB8FF' }
              ]}
            />

            <Bar dataKey="liveCount" barSize={140} shape={<CylinderShape />}>
              {chartData.map((d, idx) => (
                <Cell key={`cyl-cell-${idx}`} fill={`url(#cyl-grad-${idx})`} />
              ))}
              <LabelList
                dataKey="liveCount"
                position="top"
                formatter={(val) => val}
                style={{ fill: '#fff', fontSize: 15, fontWeight: '800' }}
              />
            </Bar>
            {/* overlay: curve passing through top-centers */}
            <Customized component={(props) => <CurveOverlay {...props} />} />
          </BarChart>
        </ResponsiveContainer>
      </Card.Body>
    </Card>
  );
}


--------------
  
// src/pages/DashboardHome.jsx
import React, { useMemo, lazy, Suspense, useDeferredValue } from 'react';
import { Container, Row, Col } from 'react-bootstrap';

import SummaryCards from '../components/SummaryCards';
import LoadingSpinner from '../components/LoadingSpinner';

// lazy-load charts (prefetch so browser can warm the chunk after idle)
const FloorOccupancyChart = lazy(() => import(
  /* webpackChunkName: "floor-chart", webpackPrefetch: true */ '../components/FloorOccupancyChart'
));
const SummaryChart = lazy(() => import(
  /* webpackChunkName: "summary-chart", webpackPrefetch: true */ '../components/SummaryChart'
));
const PersonnelDonutChart = lazy(() => import(
  /* webpackChunkName: "personnel-donut", webpackPrefetch: true */ '../components/PersonnelDonutChart'
));

/**
 * DashboardHome
 * - Always render SummaryCards immediately (fast first meaningful paint)
 * - Defer heavy chart rendering with useDeferredValue + Suspense fallbacks
 * - Memoize chart data so children only get new props when the source changes
 */
function DashboardHome({
  summaryData = [],
  detailsData,
  floorData = [],
  zoneBreakdown,
  personnelBreakdown = [],
  totalVisitedToday = 0,
  personnelSummary = { employees: 0, contractors: 0 },
  visitedToday = {},
  ertStatus
}) {
  // small cheap derived numbers shown in SummaryCards (fast)
  const employees = personnelSummary?.employees ?? 0;
  const contractors = personnelSummary?.contractors ?? 0;
  const totalOccupancy = employees + contractors;

  // memoize chart input transforms (cheap => prevents child re-render unless source changes)
  const chartData = useMemo(() => {
    return (personnelBreakdown || []).map(({ personnelType, count }) => ({ personnelType, count }));
  }, [personnelBreakdown]);

  // useDeferredValue prevents urgent UI (summary cards) from being blocked by chart updates
  const deferredChartData = useDeferredValue(chartData);
  const deferredFloorData = useDeferredValue(floorData || []);
  const deferredSummary = useDeferredValue(summaryData || []);

  // NOTE: Do NOT block entire page on charts. Always show summary cards immediately.
  // Charts will show loading placeholders until their lazy chunks and data are ready.

  return (
    <Container fluid className="py-4">
      {/* Summary: first meaningful paint (always show with minimal compute) */}
      <SummaryCards
        totalOccupancy={totalOccupancy}
        employeeCount={employees}
        contractorCount={contractors}
        totalVisitedToday={totalVisitedToday}
        employeesVisitedToday={visitedToday?.employees ?? 0}
        contractorsVisitedToday={visitedToday?.contractors ?? 0}
      />

      {/* Charts row — lazy rendered with Suspense fallback */}
      <Row className="g-4" style={{ marginTop: 12 }}>
        <Col md={4} style={{ minHeight: 300 }}>
          <Suspense fallback={<div style={{height: '100%', display:'flex', alignItems:'center', justifyContent:'center'}}><LoadingSpinner message="Loading chart…" small /></div>}>
            <FloorOccupancyChart data={deferredFloorData} />
          </Suspense>
        </Col>

        <Col md={4} style={{ minHeight: 300 }}>
          <Suspense fallback={<div style={{height: '100%', display:'flex', alignItems:'center', justifyContent:'center'}}><LoadingSpinner message="Loading chart…" small /></div>}>
            <SummaryChart summary={deferredSummary} />
          </Suspense>
        </Col>

        <Col md={4} style={{ minHeight: 300 }}>
          <Suspense fallback={<div style={{height: '100%', display:'flex', alignItems:'center', justifyContent:'center'}}><LoadingSpinner message="Loading chart…" small /></div>}>
            <PersonnelDonutChart data={deferredChartData} />
          </Suspense>
        </Col>
      </Row>

     
{/* Footer — always at the bottom */}
<footer style={{
  backgroundColor: '#000',
  color: '#FFC72C',
  padding: '1.5rem 0',
  textAlign: 'center',
  borderTop: '2px solid #FFC72C',
  fontSize: '0.95rem',
  lineHeight: '1.6',
  minHeight: 120,
  // position: 'fixed',   // fix at bottom
  left: 0,             // full width
  bottom: 0,
  width: '100%',
  zIndex: 1000         // ensures it’s on top of other content
}}>
  <div>
    <strong>Global Security Operations Center</strong><br />
    Live HeadCount against Occupancy dashboard for Western Union Pune — Real-time occupancy, floor activity, and personnel insights.
  </div>
  <div style={{ marginTop: '0.75rem' }}>
    Contact us:&nbsp;
    <a href="mailto:GSOC-GlobalSecurityOperationCenter.SharedMailbox@westernunion.com"
       style={{ color: '#FFC72C', textDecoration: 'underline' }}>
      GSOC Mail
    </a>&nbsp;|&nbsp;
    Landline:&nbsp;<span style={{ color: '#FFC72C' }}>+91-020-67632394</span>
  </div>
</footer>

    </Container>
  );
}

export default React.memo(DashboardHome);

CHEKC THOS TWO FILES THEN YOU UNDERSNTADN 
