door and readre is add in controller_doors but locatin and city is not add 
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



function addDevice(type, deviceObj) {
  if (!allData[type]) throw new Error("Invalid device type: " + type);

  // normalize keys to match DB columns
  const norm = {};
  Object.entries(deviceObj || {}).forEach(([k, v]) => {
    norm[normalizeKey(k)] = v;
  });
  norm.history = norm.history || [];

  // derive ip
  const ip = (norm.ip_address || norm.ip || norm.IP_address || "").toString().trim();
  if (!ip) throw new Error("ip_address is required");

  // Determine DB table name mapping
  const tableMap = {
    archivers: "archivers",
    controllers: "controllers",
    cameras: "cameras",
    servers: "servers",
    pcDetails: "pc_details",
    DBDetails: "dbdetails",
  };
  const table = tableMap[type];
  if (!table) throw new Error("Unsupported device type for DB: " + type);

  try {
    switch (table) {
      case "cameras":
        db.prepare(`
          INSERT INTO cameras (cameraname, ip_address, location, city, device_details, hyperlink, remark, added_by, added_at)
          VALUES (@cameraname, @ip_address, @location, @city, @device_details, @hyperlink, @remark, @added_by, datetime('now'))
        `).run({
          cameraname: norm.cameraname || norm.camera_name || null,
          ip_address: ip,
          location: norm.location || null,
          city: norm.city || null,
          device_details: norm.device_details || norm.deviec_details || null,
          hyperlink: norm.hyperlink || null,
          remark: norm.remark || null,
          added_by: norm.added_by || "api",
        });
        break;

      case "archivers":
        db.prepare(`
          INSERT INTO archivers (archivername, ip_address, location, city, added_by, added_at)
          VALUES (@archivername, @ip_address, @location, @city, @added_by, datetime('now'))
        `).run({
          archivername: norm.archivername || null,
          ip_address: ip,
          location: norm.location || null,
          city: norm.city || null,
          added_by: norm.added_by || "api",
        });
        break;

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

        // ⬇️⬇️ for door

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
        // ⬇️⬇️


        break;

      case "servers":
        db.prepare(`
          INSERT INTO servers (servername, ip_address, location, city, added_by, added_at)
          VALUES (@servername, @ip_address, @location, @city, @added_by, datetime('now'))
        `).run({
          servername: norm.servername || null,
          ip_address: ip,
          location: norm.location || null,
          city: norm.city || null,
          added_by: norm.added_by || "api",
        });
        break;

      case "dbdetails":
        db.prepare(`
          INSERT INTO dbdetails (location, city, hostname, ip_address, application, windows_server, added_by, added_at)
          VALUES (@location, @city, @hostname, @ip_address, @application, @windows_server, @added_by, datetime('now'))
        `).run({
          location: norm.location || null,
          city: norm.city || null,
          hostname: norm.hostname || null,
          ip_address: ip,
          application: norm.application || null,
          windows_server: norm.windows_server || null,
          added_by: norm.added_by || "api",
        });
        break;

      case "pc_details":
        db.prepare(`
          INSERT INTO pc_details (hostname, ip_address, location, city, pc_name, added_by, added_at)
          VALUES (@hostname, @ip_address, @location, @city, @pc_name, @added_by, datetime('now'))
        `).run({
          hostname: norm.hostname || null,
          ip_address: ip,
          location: norm.location || null,
          city: norm.city || null,
          pc_name: norm.pc_name || null,
          added_by: norm.added_by || "api",
        });
        break;
    }
  } catch (err) {
    // bubble up DB constraint errors (e.g., duplicate IP)
    throw err;
  }

  // refresh in-memory cache: load the newly inserted row and push to allData
  const insertedRow = db.prepare(`SELECT * FROM ${table} WHERE ip_address = ?`).get(ip);
  const mapped = mapRowToDevice(table, insertedRow);
  allData[type].push(mapped);
  rebuildIpRegionMap();
  return mapped;
}

// Update device (oldIp) with updateFields
function updateDevice(oldIp, updateFields) {
  const found = findInAllData(oldIp);
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
  if (!table) throw new Error("Unsupported device type for update: " + listName);

  // Merge in-memory
  allData[listName][idx] = { ...allData[listName][idx], ...updateFields };
  const ip = (allData[listName][idx].ip_address || allData[listName][idx].IP_address || "").toString().trim();

  try {
    switch (table) {
      case "cameras":
        db.prepare(`
          UPDATE cameras SET cameraname=@cameraname, location=@location, city=@city, device_details=@device_details, hyperlink=@hyperlink, remark=@remark, updated_by=@updated_by, updated_at=datetime('now')
          WHERE ip_address=@where_ip
        `).run({
          cameraname: allData[listName][idx].cameraname || null,
          location: allData[listName][idx].location || null,
          city: allData[listName][idx].city || null,
          device_details: allData[listName][idx].device_details || null,
          hyperlink: allData[listName][idx].hyperlink || null,
          remark: allData[listName][idx].remark || null,
          updated_by: updateFields.updated_by || "api",
          where_ip: oldIp,
        });
        break;

      case "archivers":
        db.prepare(`
          UPDATE archivers SET archivername=@archivername, location=@location, city=@city, updated_by=@updated_by, updated_at=datetime('now')
          WHERE ip_address=@where_ip
        `).run({
          archivername: allData[listName][idx].archivername || null,
          location: allData[listName][idx].location || null,
          city: allData[listName][idx].city || null,
          updated_by: updateFields.updated_by || "api",
          where_ip: oldIp,
        });
        break;

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
        // ⬇️⬇️ for door
        // --- UPDATE DOORS HERE ---
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

      case "servers":
        db.prepare(`
          UPDATE servers SET servername=@servername, location=@location, city=@city, updated_by=@updated_by, updated_at=datetime('now')
          WHERE ip_address=@where_ip
        `).run({
          servername: allData[listName][idx].servername || null,
          location: allData[listName][idx].location || null,
          city: allData[listName][idx].city || null,
          updated_by: updateFields.updated_by || "api",
          where_ip: oldIp,
        });
        break;

      case "dbdetails":
        db.prepare(`
          UPDATE dbdetails SET location=@location, city=@city, hostname=@hostname, application=@application, windows_server=@windows_server, updated_by=@updated_by, updated_at=datetime('now')
          WHERE ip_address=@where_ip
        `).run({
          location: allData[listName][idx].location || null,
          city: allData[listName][idx].city || null,
          hostname: allData[listName][idx].hostname || null,
          application: allData[listName][idx].application || null,
          windows_server: allData[listName][idx].windows_server || null,
          updated_by: updateFields.updated_by || "api",
          where_ip: oldIp,
        });
        break;

      case "pc_details":
        db.prepare(`
          UPDATE pc_details SET hostname=@hostname, location=@location, city=@city, pc_name=@pc_name, updated_by=@updated_by, updated_at=datetime('now')
          WHERE ip_address=@where_ip
        `).run({
          hostname: allData[listName][idx].hostname || null,
          location: allData[listName][idx].location || null,
          city: allData[listName][idx].city || null,
          pc_name: allData[listName][idx].pc_name || null,
          updated_by: updateFields.updated_by || "api",
          where_ip: oldIp,
        });
        break;
    }
  } catch (err) {
    throw err;
  }

  // If IP changed in updateFields, update DB and in-memory
  if (updateFields.ip_address && updateFields.ip_address !== oldIp) {
    const newIp = updateFields.ip_address.toString().trim();
    db.prepare(`UPDATE ${table} SET ip_address = ? WHERE ip_address = ?`).run(newIp, oldIp);
    allData[listName][idx].ip_address = newIp;
    allData[listName][idx].IP_address = newIp;
  }

  rebuildIpRegionMap();
  return allData[listName][idx];
}
