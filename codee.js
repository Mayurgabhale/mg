const deviceName =
  dev.name ||
  dev.device?.name ||
  dev.details?.name ||
  null;

const deviceIP =
  dev.ip ||
  dev.device?.ip ||
  dev.details?.ip ||
  dev.card?.dataset?.ip ||
  null;

const point = {
  x: cityIndexMap[city],
  y: dynamicY,
  name: deviceName,
  ip: deviceIP,
  city: city
};





tooltip: {
  callbacks: {
    label: (ctx) => {
      const d = ctx.raw;
      const lines = [];

      if (d.name && d.name !== "Unknown") {
        lines.push(`Name: ${d.name}`);
      }

      if (d.ip && d.ip !== "N/A" && d.ip !== "null") {
        lines.push(`IP: ${d.ip}`);
      }

      lines.push(`City: ${d.city}`);

      return lines;
    }
  }
}