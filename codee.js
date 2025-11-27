// place near top of map.js or a shared utils file
function isDeviceOffline(dev) {
  if (!dev) return false;
  const s = ((dev.status || dev.state || '') + '').toString().trim().toLowerCase();
  if (s === 'offline' || s === 'down') return true;
  if (typeof dev.online === 'boolean' && dev.online === false) return true;
  return false;
}
....



// sum offline counts per type (city.offline built in updateMapData)
const offline = Object.values(city.offline || {}).reduce((acc, v) => acc + (v || 0), 0);