tooltip: {
  callbacks: {
    title: function (items) {
      return labels[items[0].dataIndex];
    },

    // Return ONE line at a time instead of array
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

      // Store lines in order
      const lines = [
        `Total Devices: ${total}`,
        `Risk Level: ${risk}`,
        `Offline Camera: ${camOff}`,
        `Offline Controller: ${ctrlOff}`,
        `Offline Server: ${srvOff}`,
        `Offline Archiver: ${archOff}`
      ];

      return lines[item.dataIndex % lines.length];
    },

    labelTextColor: function (context) {
      const text = context.formattedValue;

      // Only make Offline lines red when count > 0
      if (text.includes("Offline")) {
        const value = parseInt(text.split(":")[1].trim());
        if (value > 0) {
          return "red";
        }
      }

      return "#ffffff"; // normal for others
    }
  }
}