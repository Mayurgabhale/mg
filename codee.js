// Determine city name for filename (like APAC logic)
let cityName = '';
if (selectedSummaryPartition) {
  const [selCountry, selCity] = selectedSummaryPartition.split('||');
  cityName = selCity || '';
}

// Build dynamic filename
const filename = cityName
  ? `Western Union LACA (${cityName}) Headcount Report - ${format(pickedDate, 'd MMMM yyyy')}.xlsx`
  : `Western Union LACA Headcount Report - ${format(pickedDate, 'd MMMM yyyy')}.xlsx`;