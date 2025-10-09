let cityName = '';
if (selectedSummaryPartition) {
  const [, selCity] = selectedSummaryPartition.split('||');
  cityName = selCity || '';
} else if (filterCode) {
  // fallback: get the first city from companyRows for that country
  const firstRow = companyRows.find(r => r.country === codeToCountry[filterCode]);
  cityName = firstRow?.city || '';
}