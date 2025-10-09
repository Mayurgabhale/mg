// Determine city for filename
let cityName = '';

if (filteredPartitionKeys.length === 1) {
  const selectedKey = filteredPartitionKeys[0];
  cityName = partitionToDisplay[selectedKey]?.city || '';
}

// Build dynamic filename
const filename = cityName
  ? `Western Union NAMER (${cityName}) Headcount Report - ${format(pickedDate, 'd MMMM yyyy')}.xlsx`
  : `Western Union NAMER Headcount Report - ${format(pickedDate, 'd MMMM yyyy')}.xlsx`;