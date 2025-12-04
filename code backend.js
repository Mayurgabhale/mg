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