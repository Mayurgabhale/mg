// Example React useEffect in CompanySummary.js
import { useEffect } from "react";

const sendDailyReportData = async () => {
    await fetch("http://localhost:5001/api/dailyReport/saveCompanyData", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
            filteredCompanies, 
            buildingTotals: companyData.buildingTotals,
            totalCount: companyData.totalCount
        }),
    });
    console.log("Data sent to backend for daily report");
};

// Call this whenever companyData or filteredCompanies updates
useEffect(() => {
    if (filteredCompanies?.length) {
        sendDailyReportData();
    }
}, [filteredCompanies, companyData]);