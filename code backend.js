const summaryData = { ...allData };
delete summaryData.controller_doors;

const summary = calculateSummary(summaryData);
summary.controllers.doors = calculateDoorSummary(allData.controller_doors, allData.controllers);

return { summary, details: allData };