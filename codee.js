// detect type: prefer dev.type if present; otherwise derive from rawKey
let type = null;
if (dev && dev.type) {
  type = String(dev.type).toLowerCase();
} else {
  const keyLower = (rawKey || "").toLowerCase();
  if (keyLower.includes("camera")) type = "camera";
  else if (keyLower.includes("controller")) type = "controller";
  else if (keyLower.includes("server")) type = "server";
  else if (keyLower.includes("archiver")) type = "archiver";
  else type = null;
}


const allowedTypes = ['camera','controller','server','archiver'];
if (allowedTypes.includes(type)) {
  cityMap[cityName].devices[type] += 1;
  cityMap[cityName].total += 1;
  cityMap[cityName].devicesList.push(dev);
}