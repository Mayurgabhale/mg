// Determine city name for filename
let cityName = '';
if (backendFilterKey) {
  const fe = Object.keys(apacPartitionDisplay).find(
    code => apacForwardKey[code] === backendFilterKey || code === backendFilterKey
  );
  cityName = fe ? apacPartitionDisplay[fe].city : backendFilterKey;
}

// Build dynamic filename
const filename = cityName
  ? `Western Union APAC (${cityName}) Headcount Report - ${format(pickedDate, 'd MMMM yyyy')}.xlsx`
  : `Western Union APAC Headcount Report - ${format(pickedDate, 'd MMMM yyyy')}.xlsx`;

// Save file
const buf = await wb.xlsx.writeBuffer();
saveAs(new Blob([buf]), filename);