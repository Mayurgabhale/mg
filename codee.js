 <OverlayTrigger placement="bottom" overlay={<Tooltip id="tooltip-dashboard">Dashboard</Tooltip>}>
                        <Nav.Link as={Link} to="/" className="nav-item-infographic"><i className="bi bi-house"></i></Nav.Link>
</OverlayTrigger>
   
 <OverlayTrigger placement="bottom" overlay={<Tooltip id="tooltip-dashboard">Live Detais Page</Tooltip>}>
            <Nav.Link as={Link} to="/details" className="nav-item-infographic"><i className="fa-solid fa-calendar-day"></i></Nav.Link> 
</OverlayTrigger>
   
 <OverlayTrigger placement="bottom" overlay={<Tooltip id="tooltip-dashboard">ERT Overview</Tooltip>}>
            <Nav.Link as={Link} to="/ert" className="nav-item-infographic"> <MdAddAlert /> </Nav.Link>
</OverlayTrigger>
   
 <OverlayTrigger placement="bottom" overlay={<Tooltip id="tooltip-dashboard">Company Summary</Tooltip>}>
            <Nav.Link as={Link} to="/companysummary" className="nav-item-infographic"><FaBuildingCircleCheck /></Nav.Link>
</OverlayTrigger>
   
 <OverlayTrigger placement="bottom" overlay={<Tooltip id="tooltip-dashboard">History</Tooltip>}>
                       <Nav.Link href="http://10.199.22.57:3000/partition/Pune/history" className="nav-item-infographic"><i className="bi bi-clock-history"></i></Nav.Link>
</OverlayTrigger>

