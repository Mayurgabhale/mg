const controllerData = JSON.parse(
  fs.readFileSync("./src/data/ControllerDataWithDoorReader.json", "utf8")
);



async function pingDevices() {
  const limit = require("p-limit")(20);

  await Promise.all(
    devices.map(ip =>
      limit(async () => {
        const newStatus = await pingHost(ip);
        if (deviceStatus[ip] !== newStatus) {
          logDeviceChange(ip, newStatus);
        }
        deviceStatus[ip] = newStatus;
      })
    )
  );

  // ✅ Build Controller + Door Status
  buildControllerStatus();

  console.log("Updated device status:", deviceStatus);
}