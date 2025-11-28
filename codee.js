afterBody: function(context) {
  if (!context || !context.length) return [];

  const dataIndex = context[0].dataIndex;
  const chart = context[0].chart || offlineCityBarChart;
  const details = chart.cityDetails[dataIndex];
  if (!details) return [];

  const off = details.offline;

  return [
    `Risk Level: ${details.risk}`,
    `Offline Cameras: ${off.camera || 0}`,
    `Offline Controllers: ${off.controller || 0}`,
    `Offline Archivers: ${off.archiver || 0}`,
    `Offline Servers: ${off.server || 0}`
  ];
}