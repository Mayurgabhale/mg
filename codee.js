<Row>
  {/* Sidebar */}
  <Col
    xs={sidebarOpen ? 3 : 1}
    className="position-sticky shadow-sm"
    style={{
      top: 0,
      minHeight: "100vh",
      transition: "width 0.3s",
      background: "#f8f9fa",
      padding: "1rem",
    }}
  >
    {/* Dashboard Header */}
    <div className="d-flex justify-content-between align-items-center mb-4 px-2">
      {sidebarOpen && (
        <h5 className="mb-0 text-primary d-flex align-items-center">
          <FaHouse className="me-2" /> Dashboard
        </h5>
      )}
      <FaBars
        className="cursor-pointer text-secondary"
        onClick={() => setSidebarOpen(!sidebarOpen)}
        style={{ fontSize: "1.3rem" }}
      />
    </div>

    {/* Clock Card */}
    {sidebarOpen && (
      <Card
        className="mb-4 shadow-sm"
        style={{
          borderRadius: "0.8rem",
          background: "linear-gradient(90deg, #3a8dff, #6cc1ff)",
          color: "#fff",
          textAlign: "center",
        }}
      >
        <Card.Body style={{ padding: "0.8rem" }}>
          <div style={{ fontSize: "1rem", fontWeight: "600" }}>Current Time</div>
          <div style={{ fontSize: "1.2rem", fontWeight: "700" }}>
            {currentTime.toLocaleTimeString()}
          </div>
        </Card.Body>
      </Card>
    )}

    {/* Navigation Sections */}
    <div className="mb-3">
      {sidebarOpen && <div className="text-secondary px-2 mb-2 fw-bold small">Analytics</div>}
      <Nav className="flex-column">
        <Nav.Link
          active={activeTab === "companyAnalytics"}
          onClick={() => setActiveTab("companyAnalytics")}
          className={`d-flex align-items-center mb-2 px-3 py-2 rounded shadow-sm ${
            activeTab === "companyAnalytics"
              ? "bg-primary text-white fw-bold"
              : "text-dark bg-white"
          }`}
          style={{ transition: "all 0.2s" }}
          onMouseOver={(e) => (e.currentTarget.style.transform = "scale(1.02)")}
          onMouseOut={(e) => (e.currentTarget.style.transform = "scale(1)")}
        >
          <FaBuilding className="me-2" />
          {sidebarOpen && "Company Analytics"}
        </Nav.Link>

        <Nav.Link
          active={activeTab === "futureTab"}
          onClick={() => setActiveTab("futureTab")}
          className={`d-flex align-items-center mb-2 px-3 py-2 rounded shadow-sm ${
            activeTab === "futureTab"
              ? "bg-primary text-white fw-bold"
              : "text-dark bg-white"
          }`}
          style={{ transition: "all 0.2s" }}
          onMouseOver={(e) => (e.currentTarget.style.transform = "scale(1.02)")}
          onMouseOut={(e) => (e.currentTarget.style.transform = "scale(1)")}
        >
          <FaChartPie className="me-2" />
          {sidebarOpen && "Future Analytics"}
        </Nav.Link>
      </Nav>
    </div>

    {/* Optional Extra Section */}
    {sidebarOpen && (
      <div className="mt-auto">
        <div className="text-secondary px-2 mb-2 fw-bold small">Extras</div>
        <Nav className="flex-column">
          <Nav.Link className="d-flex align-items-center mb-2 px-3 py-2 rounded shadow-sm text-dark bg-white">
            <FaUsers className="me-2" />
            {sidebarOpen && "User Management"}
          </Nav.Link>
        </Nav>
      </div>
    )}
  </Col>

  {/* Main Content */}
  <Col xs={sidebarOpen ? 9 : 11} className="p-4">
    <h2 className="text-dark mb-4">
      {activeTab === "companyAnalytics" ? "Company Analytics Dashboard" : "Future Analytics"}
    </h2>
    {renderTabContent()}
  </Col>
</Row>