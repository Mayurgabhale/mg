const showTravelDashboardIcon = false;

{showTravelDashboardIcon && (
  <OverlayTrigger placement="bottom" overlay={<Tooltip id="tooltip-dashboard">Travel Dashboard</Tooltip>}>
    <Nav.Link
      onClick={() => window.open("/travel-dashboard", "_blank", "noopener,noreferrer")}
      className="nav-item-infographic"
    >
      <i className="fa-solid fa-plane fa-fade"></i>
    </Nav.Link>
  </OverlayTrigger>
)}