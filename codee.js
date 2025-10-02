// In your App.js, update the routes:

// Replace the DashboardHome import with:
const DashboardPage = lazy(() => import('./pages/DashboardPage'));

// Update the route:
<Route path="/" element={
  <DashboardPage
    detailsData={liveData.details}
    personnelBreakdown={liveData.personnelBreakdown}
    zoneBreakdown={liveData.zoneBreakdown}
    floorBreakdown={liveData.floorBreakdown}
  />
} />

// Also update the navbar link for Company Summary:
<Nav.Link as={Link} to="/companysummary" className="nav-item-infographic">
  <FaBuilding className="me-1" />
  Advanced Dashboard
</Nav.Link>