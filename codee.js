right now this 
  {location.pathname !== "/" && (
                <OverlayTrigger placement="bottom" overlay={<Tooltip id="tooltip-dashboard">Travel Dashboard</Tooltip>}>
                  <Nav.Link
                    onClick={() => window.open("/travel-dashboard", "_blank", "noopener,noreferrer")}
                    className="nav-item-infographic"
                  >
                    <i className="fa-solid fa-plane fa-fade"></i>
                  </Nav.Link>
                </OverlayTrigger>
              )}
icons hide onye in dashboard but i opne othe tab in this dipsly this  <OverlayTrigger placement="bottom" overlay={<Tooltip id="tooltip-dashboard">Travel Dashboard</Tooltip>}>
                  <Nav.Link
                    onClick={() => window.open("/travel-dashboard", "_blank", "noopener,noreferrer")}
                    className="nav-item-infographic"
                  >
                    <i className="fa-solid fa-plane fa-fade"></i>
                  </Nav.Link>
                </OverlayTrigger>
but i want hide for all tab.. so how to do this 

  const hideNavbar = location.pathname === "/travel-dashboard";
const isTravelDashboard = location.pathname === "/travel-dashboard";


      {!hideNavbar && (
        <Navbar bg="dark" variant="dark" expand="lg" className="px-3">
          <Navbar.Brand as={Link} to="/" className="wu-brand">{headerText}</Navbar.Brand>
          <Navbar.Toggle aria-controls="main-navbar" />
          <Navbar.Collapse id="main-navbar">
            <Nav className="ms-auto align-items-center gap-2">
              <div className="time-travel-wrapper me-2">
                <TimeTravelControl
                  currentTimestamp={timeTravelTimestamp}
                  onApply={fetchSnapshot}
                  onLive={clearTimeTravel}
                  loading={timeTravelLoading}
                />
              </div>

              <OverlayTrigger placement="bottom" overlay={<Tooltip id="tooltip-dashboard">Dashboard</Tooltip>}>
                <Nav.Link as={Link} to="/" className="nav-item-infographic">
                  <i className="bi bi-house"></i>
                </Nav.Link>
              </OverlayTrigger>

              <OverlayTrigger placement="bottom" overlay={<Tooltip id="tooltip-dashboard">Live Details Page</Tooltip>}>
                <Nav.Link as={Link} to="/details" className="nav-item-infographic">
                  <i className="fa-solid fa-calendar-day"></i>
                </Nav.Link>
              </OverlayTrigger>

              <OverlayTrigger placement="bottom" overlay={<Tooltip id="tooltip-dashboard">ERT Overview</Tooltip>}>
                <Nav.Link as={Link} to="/ert" className="nav-item-infographic">
                  <MdAddAlert className='nav-item-new' />
                </Nav.Link>
              </OverlayTrigger>

              <OverlayTrigger placement="bottom" overlay={<Tooltip id="tooltip-dashboard">Company Summary</Tooltip>}>
                <Nav.Link as={Link} to="/companysummary" className="nav-item-infographic">
                  <FaBuildingCircleCheck className='nav-item-new' />
                </Nav.Link>
              </OverlayTrigger>
              
              {location.pathname !== "/" && (
                <OverlayTrigger placement="bottom" overlay={<Tooltip id="tooltip-dashboard">Travel Dashboard</Tooltip>}>
                  <Nav.Link
                    onClick={() => window.open("/travel-dashboard", "_blank", "noopener,noreferrer")}
                    className="nav-item-infographic"
                  >
                    <i className="fa-solid fa-plane fa-fade"></i>
                  </Nav.Link>
                </OverlayTrigger>
              )}

              <OverlayTrigger placement="bottom" overlay={<Tooltip id="tooltip-dashboard">History</Tooltip>}>
                <Nav.Link href="http://10.199.22.57:3000/partition/Pune/history" className="nav-item-infographic">
                  <i className="bi bi-clock-history"></i>
                </Nav.Link>
              </OverlayTrigger>
            </Nav>
          </Navbar.Collapse>
        </Navbar>
      )}
