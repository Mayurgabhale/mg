// In your App.js, add the import and route:

// Add this import with other lazy imports
const CompanySummary = lazy(() => import('./components/CompanySummary'));

// Add this Nav.Link in the navbar (replace the duplicate ERT Overview)
<Nav.Link as={Link} to="/companysummary" className="nav-item-infographic">
  <FaBuilding className="me-1" />
  Company Summary
</Nav.Link>

// Add this route in the Routes section
<Route path="/companysummary" element={
  <CompanySummary
    detailsData={liveData.details}
    personnelBreakdown={liveData.personnelBreakdown}
    zoneBreakdown={liveData.zoneBreakdown}
  />
} />