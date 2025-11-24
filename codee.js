// ✅ Your structure from combinedDevices
const source = dev.device ? dev.device : dev;

const deviceName = source.name || null;
const deviceIP   = source.ip   || null;
const city       = source.city || "Unknown";





const point = {
  x: cityIndexMap[city],
  y: dynamicY,
  name: deviceName,
  ip: deviceIP,
  city: city
};