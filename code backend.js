// reload controller_doors from DB into allData.controller_doors
function reloadControllerDoors() {
  const doors = db.prepare(`
    SELECT d.*, 
           c.controllername AS controllername,
           c.location      AS controller_location,
           c.city          AS controller_city
    FROM controller_doors d
    LEFT JOIN controllers c ON c.ip_address = d.controller_ip
  `).all();

  allData.controller_doors = doors.map(r => ({
    id: r.id,
    controller_ip: r.controller_ip,
    controllername: r.controllername || null,
    door: r.door,
    reader: r.reader,
    location: r.location || r.controller_location || null,
    city: r.city || r.controller_city || null,
    added_by: r.added_by || null,
    added_at: r.added_at || null,
    updated_by: r.updated_by || null,
    updated_at: r.updated_at || null,
  }));
}



...


case "controllers":
  db.prepare(`
    INSERT INTO controllers (controllername, ip_address, location, city, added_by, added_at)
    VALUES (@controllername, @ip_address, @location, @city, @added_by, datetime('now'))
  `).run({
    controllername: norm.controllername || null,
    ip_address: ip,
    location: norm.location || null,
    city: norm.city || null,
    added_by: norm.added_by || "api",
  });

  // --- SAVE DOORS FOR THIS CONTROLLER (if provided) ---
  const doorsToInsert = norm.doors || norm.Doors;
  if (Array.isArray(doorsToInsert) && doorsToInsert.length) {
    const stmt = db.prepare(`
      INSERT INTO controller_doors (controller_ip, door, reader, added_by, added_at)
      VALUES (?, ?, ?, 'api', datetime('now'))
    `);
    for (const d of doorsToInsert) {
      const doorVal = (d && (d.door || d.Door || d.name)) || "";
      const readerVal = (d && (d.reader || d.Reader)) || "";
      stmt.run(ip, doorVal, readerVal);
    }
    // refresh doors cache
    reloadControllerDoors();
  }
  break;
...
...

case "controllers":
  db.prepare(`
    UPDATE controllers SET controllername=@controllername, location=@location, city=@city, updated_by=@updated_by, updated_at=datetime('now')
    WHERE ip_address=@where_ip
  `).run({
    controllername: allData[listName][idx].controllername || null,
    location: allData[listName][idx].location || null,
    city: allData[listName][idx].city || null,
    updated_by: updateFields.updated_by || "api",
    where_ip: oldIp,
  });

  // --- UPDATE DOORS IF PROVIDED ---
  const doorsToUpdate = updateFields.Doors || updateFields.doors;
  if (Array.isArray(doorsToUpdate)) {
    // remove old door rows for this controller
    db.prepare("DELETE FROM controller_doors WHERE controller_ip = ?").run(oldIp);

    const stmt = db.prepare(`
      INSERT INTO controller_doors (controller_ip, door, reader, added_by, added_at)
      VALUES (?, ?, ?, 'api', datetime('now'))
    `);

    for (const d of doorsToUpdate) {
      const doorVal = (d && (d.door || d.Door || d.name)) || "";
      const readerVal = (d && (d.reader || d.Reader)) || "";
      stmt.run(oldIp, doorVal, readerVal);
    }

    // refresh doors cache
    reloadControllerDoors();
  }
  break;

.....
...
....

if (table === "controllers") {
  // remove doors for this controller
  db.prepare("DELETE FROM controller_doors WHERE controller_ip = ?").run(ip);
  // refresh cache
  reloadControllerDoors();
}
db.prepare(`DELETE FROM ${table} WHERE ip_address = ?`).run(ip);