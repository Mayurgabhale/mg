tooltip: {
  callbacks: {
    title: function (items) {
      return labels[items[0].dataIndex];
    },

    label: function (item) {
      const idx = item.dataIndex;
      const c = CITY_LIST[idx] || {};

      const total = c.devices
        ? Object.values(c.devices).reduce((a, b) => a + b, 0)
        : 0;

      const camOff  = (c.offline && c.offline.camera) || 0;
      const ctrlOff = (c.offline && c.offline.controller) || 0;
      const srvOff  = (c.offline && c.offline.server) || 0;
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
      const idx = context.dataIndex;
      const c = CITY_LIST[idx] || {};

      const camOff  = (c.offline && c.offline.camera) || 0;
      const ctrlOff = (c.offline && c.offline.controller) || 0;
      const srvOff  = (c.offline && c.offline.server) || 0;
      const archOff = (c.offline && c.offline.archiver) || 0;

      // Return color for EACH line (because you returned multiple lines)
      return [
        "#ffffff", // Total Devices
        "#ffffff", // Risk Level
        camOff  > 0 ? "red" : "#ffffff",
        ctrlOff > 0 ? "red" : "#ffffff",
        srvOff  > 0 ? "red" : "#ffffff",
        archOff > 0 ? "red" : "#ffffff"
      ];
    }
  }
}