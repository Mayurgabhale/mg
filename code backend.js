// Delete device
function deleteDevice(ip) {
  const found = findInAllData(ip);
  if (!found) throw new Error("Device not found");
  const { listName, idx } = found;

  const tableMap = {
    archivers: "archivers",
    controllers: "controllers",
    cameras: "cameras",
    servers: "servers",
    pcDetails: "pc_details",
    DBDetails: "dbdetails",
  };
  const table = tableMap[listName];
  if (!table) throw new Error("Unsupported device type for delete: " + listName);

  // ✨ NEW — if deleting a controller, also delete its doors
  if (table === "controllers") {
    db.prepare("DELETE FROM controller_doors WHERE controller_ip = ?").run(ip);

    // refresh controller_doors in cache
    reloadControllerDoors();
  }

  // delete main device row
  db.prepare(`DELETE FROM ${table} WHERE ip_address = ?`).run(ip);

  // remove from in-memory cache
  allData[listName].splice(idx, 1);

  // rebuild region map
  rebuildIpRegionMap();

  return true;
}