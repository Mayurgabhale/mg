label: function (item) {
  const idx = item.dataIndex;
  const c = CITY_LIST[idx] || {};

  const total = c.devices
    ? Object.values(c.devices).reduce((a, b) => a + b, 0)
    : 0;

  const camOff = (c.offline && c.offline.camera) || 0;
  const ctrlOff = (c.offline && c.offline.controller) || 0;
  const srvOff = (c.offline && c.offline.server) || 0;
  const archOff = (c.offline && c.offline.archiver) || 0;

  const risk = riskLabels[idx] || "Low";

  return [
    `Total Devices: ${total}`,
    `Risk Level: ${risk}`,
    `Offline Camera: ${camOff}`,
    `Offline Controller: ${ctrlOff}`,
    `Offline Server: ${srvOff}`,
    `Offline Archiver: ${archOff}`
  ];
},
labelTextColor: function (context) {
  const text = context.formattedValue;

  // Make ONLY offline count lines > 0 red
  if (
    (text.includes("Offline Camera") && !text.endsWith(": 0")) ||
    (text.includes("Offline Controller") && !text.endsWith(": 0")) ||
    (text.includes("Offline Server") && !text.endsWith(": 0")) ||
    (text.includes("Offline Archiver") && !text.endsWith(": 0"))
  ) {
    return "red";
  }

  return "#ffffff"; // normal tooltip text color
}