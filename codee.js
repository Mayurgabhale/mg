<Row>
  {/* Sidebar */}
  <Col
    xs={sidebarOpen ? 2 : 1}
    className="position-sticky shadow-sm"
    style={{
      top: 0,
      minHeight: "100vh",
      transition: "width 0.3s",
      background: "linear-gradient(to bottom, #3a8dff, #6cc1ff)",
      color: "#fff",
      padding: "1.5rem 0.5rem",
    }}
  >
    {/* Header */}
    <div className="d-flex justify-content-between align-items-center mb-4 px-2">
      {sidebarOpen && (
        <h5 className="mb-0 d-flex align-items-center">
          <FaHouse className="me-2" /> Dashboard
        </h5>
      )}
      <FaBars
        className="cursor-pointer"
        onClick={() => setSidebarOpen(!sidebarOpen)}
        style={{ fontSize: "1.2rem" }}
      />
    </div>

    {/* Clock */}
    {sidebarOpen && (
      <div
        className="text-center mb-4"
        style={{
          fontSize: "1.1rem",
          fontWeight: "600",
          background: "rgba(255,255,255,0.15)",
          borderRadius: "0.5rem",
          padding: "0.5rem",
        }}
      >
        {currentTime.toLocaleTimeString()}
      </div>
    )}

    {/* Navigation */}
    <Nav className="flex-column">
      <Nav.Link
        active={activeTab === "companyAnalytics"}
        onClick={() => setActiveTab("companyAnalytics")}
        className={`d-flex align-items-center mb-2 px-3 py-2 rounded ${
          activeTab === "companyAnalytics" ? "bg-white text-primary fw-bold" : "text-white"
        }`}
        style={{ transition: "all 0.2s" }}
        onMouseOver={(e) => (e.currentTarget.style.backgroundColor = "rgba(255,255,255,0.2)")}
        onMouseOut={(e) =>
          (e.currentTarget.style.backgroundColor =
            activeTab === "companyAnalytics" ? "white" : "transparent")
        }
      >
        <FaBuilding className="me-2" />
        {sidebarOpen && "Company Analytics"}
      </Nav.Link>

      <Nav.Link
        active={activeTab === "futureTab"}
        onClick={() => setActiveTab("futureTab")}
        className={`d-flex align-items-center mb-2 px-3 py-2 rounded ${
          activeTab === "futureTab" ? "bg-white text-primary fw-bold" : "text-white"
        }`}
        style={{ transition: "all 0.2s" }}
        onMouseOver={(e) => (e.currentTarget.style.backgroundColor = "rgba(255,255,255,0.2)")}
        onMouseOut={(e) =>
          (e.currentTarget.style.backgroundColor =
            activeTab === "futureTab" ? "white" : "transparent")
        }
      >
        <FaChartPie className="me-2" />
        {sidebarOpen && "Future Analytics"}
      </Nav.Link>
    </Nav>
  </Col>

  {/* Main Content */}
  <Col xs={sidebarOpen ? 10 : 11} className="p-4">
    <h2 className="text-dark mb-4">
      {activeTab === "companyAnalytics" ? "Company Analytics Dashboard" : "Future Analytics"}
    </h2>
    {renderTabContent()}
  </Col>
</Row>