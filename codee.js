// --- Process company data ---
const companyData = useMemo(() => {
    const companies = {};
    let totalCount = 0;
    const buildingTotals = { 'Podium Floor': 0, '2nd Floor': 0, 'Tower B': 0 };

    Object.values(detailsData || {}).forEach(zoneEmployees => {
        if (Array.isArray(zoneEmployees)) {
            zoneEmployees.forEach(employee => {
                const companyName = employee?.CompanyName || 'Unknown Company';
                const building = getBuildingFromZone(employee?.zone);

                if (!building) return; // ignore unrecognized zones

                if (!companies[companyName]) {
                    companies[companyName] = {
                        name: companyName,
                        total: 0,
                        byBuilding: { 'Podium Floor': 0, '2nd Floor': 0, 'Tower B': 0 },
                        employees: [],
                        locations: new Set()
                    };
                }

                // Update company totals
                companies[companyName].total++;
                companies[companyName].byBuilding[building]++;
                companies[companyName].employees.push(employee);
                if (employee?.PrimaryLocation) {
                    companies[companyName].locations.add(employee.PrimaryLocation);
                }

                // Update overall totals
                totalCount++;
                buildingTotals[building]++;
            });
        }
    });

    const companyArray = Object.values(companies)
        .map(company => ({
            ...company,
            locations: Array.from(company.locations || []),
            percentage: totalCount > 0 ? ((company.total / totalCount) * 100).toFixed(1) : '0.0'
        }))
        .sort((a, b) => (b.total || 0) - (a.total || 0));

    return {
        companies: companyArray,
        totalCount,
        buildingTotals
    };
}, [detailsData]);