<OverlayTrigger
  placement="bottom"
  overlay={<Tooltip id="tooltip-dashboard">Dashboard Hub</Tooltip>}
>
  <Nav.Link
    href="http://10.199.22.57:3014/"
    className="nav-item-infographic nav-dashboard-hub"
  >
    <i className="fa-solid fa-house"></i>
  </Nav.Link>
</OverlayTrigger>



.nav-dashboard-hub {
  color: #ffc107 !important;
  margin-right: 12px;
}

.nav-dashboard-hub:hover {
  color: #ffdd33 !important; /* lighter hover color */
}