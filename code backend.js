const summaryData = { ...regionDevices };
delete summaryData.controller_doors;

const summary = calculateSummary(summaryData);
summary.controllers.doors = calculateDoorSummary(regionDevices.controller_doors, regionDevices.controllers);

return { summary, details: regionDevices };