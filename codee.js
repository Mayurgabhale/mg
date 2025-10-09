// ---------- Dynamic Filename Logic ----------
let cityName = '';

// If a summary partition (like "Austria||Vienna") is selected, extract the city
if (selectedSummaryPartition) {
  const [, selCity] = selectedSummaryPartition.split('||');
  cityName = selCity?.trim() || '';
} else if (filteredPartitionKeys?.length === 1) {
  // fallback: if a single partition is in view (from URL param), infer from partitionToDisplay
  const key = filteredPartitionKeys[0];
  const disp = partitionToDisplay[key];
  cityName = disp?.city || '';
}

const filename = cityName
  ? `Western Union EMEA (${cityName}) Headcount Report - ${format(pickedDate, 'd MMMM yyyy')}.xlsx`
  : `Western Union EMEA Headcount Report - ${format(pickedDate, 'd MMMM yyyy')}.xlsx`;