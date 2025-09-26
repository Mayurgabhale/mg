

// page performance improve code here 


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
