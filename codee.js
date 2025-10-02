// C:\Users\W0024618\Desktop\swipeData\client\src\components\DashboardLayout.jsx
import React, { useState } from 'react';
import { 
  Container, 
  Row, 
  Col, 
  Nav,
  Card,
  Badge
} from 'react-bootstrap';
import {
  FaBuilding,
  FaChartLine,
  FaUsers,
  FaChartBar,
  FaHistory,
  FaCog,
  FaBars,
  FaTimes
} from 'react-icons/fa';

const DashboardLayout = ({ children, activeTab, onTabChange }) => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  const menuItems = [
    { id: 'company-analytics', label: 'Company Analytics', icon: FaBuilding, badge: null },
    { id: 'occupancy-trends', label: 'Occupancy Trends', icon: FaChartLine, badge: 'Soon' },
    { id: 'employee-insights', label: 'Employee Insights', icon: FaUsers, badge: 'New' },
    { id: 'reports', label: 'Reports & Analytics', icon: FaChartBar, badge: null },
    { id: 'history', label: 'Historical Data', icon: FaHistory, badge: null },
    { id: 'settings', label: 'Dashboard Settings', icon: FaCog, badge: null }
  ];

  return (
    <Container fluid className="dashboard-layout px-0">
      <Row className="g-0">
        {/* Sidebar */}
        <Col xs={sidebarCollapsed ? 1 : 3} lg={sidebarCollapsed ? 1 : 2} className="sidebar-col">
          <div className={`sidebar ${sidebarCollapsed ? 'collapsed' : ''}`}>
            {/* Sidebar Header */}
            <div className="sidebar-header">
              {!sidebarCollapsed && (
                <div className="brand-section">
                  <div className="d-flex align-items-center">
                    <FaBuilding className="brand-icon" />
                    <div className="brand-text">
                      <h5 className="mb-0">WU Analytics</h5>
                      <small className="text-muted">Dashboard Suite</small>
                    </div>
                  </div>
                </div>
              )}
              <button 
                className="sidebar-toggle"
                onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
              >
                {sidebarCollapsed ? <FaBars /> : <FaTimes />}
              </button>
            </div>

            {/* Navigation */}
            <Nav className="sidebar-nav flex-column">
              {menuItems.map((item) => {
                const IconComponent = item.icon;
                const isActive = activeTab === item.id;
                
                return (
                  <Nav.Link
                    key={item.id}
                    className={`nav-item ${isActive ? 'active' : ''}`}
                    onClick={() => onTabChange(item.id)}
                  >
                    <div className="nav-item-content">
                      <IconComponent className="nav-icon" />
                      {!sidebarCollapsed && (
                        <>
                          <span className="nav-label">{item.label}</span>
                          {item.badge && (
                            <Badge bg="primary" className="nav-badge">
                              {item.badge}
                            </Badge>
                          )}
                        </>
                      )}
                    </div>
                    {sidebarCollapsed && (
                      <div className="nav-tooltip">{item.label}</div>
                    )}
                  </Nav.Link>
                );
              })}
            </Nav>

            {/* Sidebar Footer */}
            {!sidebarCollapsed && (
              <div className="sidebar-footer">
                <div className="user-info">
                  <div className="avatar">AD</div>
                  <div className="user-details">
                    <div className="user-name">Admin User</div>
                    <div className="user-role">Administrator</div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </Col>

        {/* Main Content */}
        <Col xs={sidebarCollapsed ? 11 : 9} lg={sidebarCollapsed ? 11 : 10} className="main-content-col">
          <div className="main-content">
            {children}
          </div>
        </Col>
      </Row>
    </Container>
  );
};

export default DashboardLayout;




