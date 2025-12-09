afterBody: function (context) {
    if (!context || !context.length) return [];

    const dataIndex = context[0].dataIndex;
    const chart = context[0].chart || offlineCityBarChart;
    const details = chart.cityDetails[dataIndex];
    if (!details) return [];

    const off = details.offline;

    const lines = [];

    if (off.camera > 0) lines.push(`Offline Cameras: ${off.camera}`);
    if (off.controller > 0) lines.push(`Offline Controllers: ${off.controller}`);
    if (off.archiver > 0) lines.push(`Offline Archivers: ${off.archiver}`);
    if (off.server > 0) lines.push(`Offline Servers: ${off.server}`);

    return lines;
}