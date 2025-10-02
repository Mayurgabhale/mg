// C:\Users\W0024618\Desktop\swipeData\client\src\pages\DashboardPage.jsx
import React, { useState } from 'react';
import DashboardLayout from '../components/DashboardLayout';
import CompanyAnalytics from '../components/CompanyAnalytics';
import ComingSoon from '../components/ComingSoon';

const DashboardPage = ({ 
  detailsData = {},
  personnelBreakdown = [],
  zoneBreakdown = [],
  floorBreakdown = []
}) => {
  const [activeTab, setActiveTab] = useState('company-analytics');

  const renderActiveTab = () => {
    switch (activeTab) {
      case 'company-analytics':
        return (
          <CompanyAnalytics
            detailsData={detailsData}
            personnelBreakdown={personnelBreakdown}
            zoneBreakdown={zoneBreakdown}
            floorBreakdown={floorBreakdown}
          />
        );
      case 'occupancy-trends':
      case 'employee-insights':
      case 'reports':
      case 'history':
      case 'settings':
        return <ComingSoon tabName={activeTab} />;
      default:
        return <CompanyAnalytics
          detailsData={detailsData}
          personnelBreakdown={personnelBreakdown}
          zoneBreakdown={zoneBreakdown}
          floorBreakdown={floorBreakdown}
        />;
    }
  };

  return (
    <DashboardLayout activeTab={activeTab} onTabChange={setActiveTab}>
      {renderActiveTab()}
    </DashboardLayout>
  );
};

export default DashboardPage;