 <Row>

                {/* Sidebar */}
                <Col xs={sidebarOpen ? 2 : 1} className="bg-white shadow-sm p-3 position-sticky" style={{ top: 0, minHeight: "100vh", transition: "width 0.3s" }}>
                    <div className="d-flex justify-content-between align-items-center mb-4">
                        {sidebarOpen && <h5 className="text-primary mb-0"><FaHouse className="me-2" />Dashboard</h5>}
                        <FaBars className="cursor-pointer" onClick={() => setSidebarOpen(!sidebarOpen)} />
                    </div>
                    {sidebarOpen && <div className="mb-4 text-center text-dark fw-bold">{currentTime.toLocaleTimeString()}</div>}
                    <Nav className="flex-column">
                        <Nav.Link
                            active={activeTab === "companyAnalytics"}
                            onClick={() => setActiveTab("companyAnalytics")}
                            className="mb-2 rounded px-2 py-1"
                        >
                            <FaBuilding className="me-2" /> {sidebarOpen && "Company Analytics"}
                        </Nav.Link>
                        <Nav.Link
                            active={activeTab === "futureTab"}
                            onClick={() => setActiveTab("futureTab")}
                            className="mb-2 rounded px-2 py-1"
                        >
                            <FaChartPie className="me-2" /> {sidebarOpen && "Future Analytics"}
                        </Nav.Link>
                    </Nav>
                </Col>

                {/* Main Content */}
                <Col xs={sidebarOpen ? 10 : 11} className="p-4">
                    <h2 className="text-dark mb-4">{activeTab === "companyAnalytics" ? "Company Analytics Dashboard" : "Future Analytics"}</h2>
                    {renderTabContent()}
                </Col>
            </Row>
