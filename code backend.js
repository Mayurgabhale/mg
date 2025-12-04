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

  db.prepare(`DELETE FROM ${table} WHERE ip_address = ?`).run(ip);
  allData[listName].splice(idx, 1);
  rebuildIpRegionMap();
  return true;
}
above is my 
-----
function deleteDevice(type, ip) {
  const table = mapTypeToTable(type);

  // If deleting a controller → also delete its doors
  if (table === "controllers") {
    db.prepare("DELETE FROM controller_doors WHERE controller_ip = ?").run(ip);

    // Refresh cached controller_doors for frontend
    reloadControllerDoors();
  }

  // Now delete main device
  db.prepare(`DELETE FROM ${table} WHERE ip_address = ?`).run(ip);

  // Refresh full DB cache
  loadDbData();

  return { success: true };
}
