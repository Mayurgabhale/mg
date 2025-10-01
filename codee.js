import React, { useState, useMemo } from 'react';
import { 
  Container, Row, Col, Card, Table, Badge, ProgressBar, Form
} from 'react-bootstrap';
import { 
  FaTrophy, FaMedal, FaChartBar, FaBuilding, FaUsers, FaArrowTrendUp, FaClock
} from 'react-icons/fa6';

const CompanySummary = ({ 
  detailsData = {},
  personnelBreakdown = [],
  zoneBreakdown = []
}) => {
  const [selectedBuilding, setSelectedBuilding] = useState('all');
  const [timeRange, setTimeRange] = useState('today');

  // --- Helper function to determine building from zone ---
  const getBuildingFromZone = (zone) => {
    if (!zone) return 'other';
    const zoneLower = zone.toLowerCase();
    if (zoneLower.includes('podium')) return 'podium';
    if (zoneLower.includes('tower b') || zoneLower.includes('tower_b')) return 'towerB';
    return 'other';
  };

  // --- Process company data from details ---
  const companyData = useMemo(() => {
    const companies = {};
    let totalCount = 0;

    Object.values(detailsData).forEach(zoneEmployees => {
      if (Array.isArray(zoneEmployees)) {
        zoneEmployees.forEach(employee => {
          const companyName = employee.CompanyName || 'Unknown Company';
          const building = getBuildingFromZone(employee.zone);
          
          if (!companies[companyName]) {
            companies[companyName] = {
              name: companyName,
              total: 0,
              byBuilding: { podium: 0, towerB: 0, other: 0 },
              employees: [],
              locations: new Set()
            };
          }

          companies[companyName].total++;
          companies[companyName].byBuilding[building]++;
          companies[companyName].employees.push(employee);
          if (employee.PrimaryLocation) {
            companies[companyName].locations.add(employee.PrimaryLocation);
          }
          totalCount++;
        });
      }
    });

    const companyArray = Object.values(companies)
      .map(company => ({
        ...company,
        locations: Array.from(company.locations),
        percentage: ((company.total / totalCount) * 100).toFixed(1)
      }))
      .sort((a, b) => b.total - a.total);

    return {
      companies: companyArray,
      totalCount,
      buildingTotals: companyArray.reduce((acc, company) => {
        acc.podium += company.byBuilding.podium;
        acc.towerB += company.byBuilding.towerB;
        acc.other += company.byBuilding.other;
        return acc;
      }, { podium: 0, towerB: 0, other: 0 })
    };
  }, [detailsData]);

  // --- Filtered companies based on building ---
  const filteredCompanies = useMemo(() => {
    if (selectedBuilding === 'all') {
      return companyData.companies;
    }
    return companyData.companies.filter(company => 
      company.byBuilding[selectedBuilding] > 0
    );
  }, [companyData.companies, selectedBuilding]);

  // --- Podium winners ---
  const getPodiumWinners = () => {
    const podiumCompanies = companyData.companies
      .filter(company => company.byBuilding.podium > 0)
      .sort((a, b) => b.byBuilding.podium - a.byBuilding.podium)
      .slice(0, 3);
    
    return [
      { ...podiumCompanies[1], position: '1st', icon: FaTrophy, color: 'gold' },
      { ...podiumCompanies[0], position: '2nd', icon: FaMedal, color: 'silver' },
      { ...podiumCompanies[2], position: '3rd', icon: FaMedal, color: '#cd7f32' }
    ].filter(Boolean);
  };

  const podiumWinners = getPodiumWinners();

  // --- Render ---
  return (
    <Container fluid className="company-summary-dashboard">
      {/* Header, filters, podium, stats, table, charts */}
      {/* ...the rest of your JSX remains unchanged ... */}
    </Container>
  );
};

export default CompanySummary;