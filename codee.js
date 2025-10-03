// Send daily report data to backend
const sendDailyReportData = async () => {
    try {
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
    } catch (err) {
        console.error("Failed to send daily report data:", err);
    }
};



useEffect(() => {
    if (filteredCompanies?.length) {
        sendDailyReportData();
    }
}, [filteredCompanies, companyData]);