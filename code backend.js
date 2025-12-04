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
  break;



....

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

        // --- SAVE DOORS HERE ---
        if (Array.isArray(norm.Doors)) {
          const stmt = db.prepare(`
            INSERT INTO controller_doors (controller_ip, door, reader, added_by, added_at)
            VALUES (?, ?, ?, 'api', datetime('now'))
          `);

          for (const d of norm.Doors) {
            stmt.run(ip, d.door, d.reader);
          }
        }

        break;


....
..

.
..
.



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

        // --- UPDATE DOORS HERE ---
        if (Array.isArray(updateFields.Doors)) {
          // delete old door list
          db.prepare("DELETE FROM controller_doors WHERE controller_ip = ?").run(oldIp);

          const stmt = db.prepare(`
            INSERT INTO controller_doors (controller_ip, door, reader, added_by, added_at)
            VALUES (?, ?, ?, 'api', datetime('now'))
          `);

          for (const d of updateFields.Doors) {
            stmt.run(oldIp, d.door, d.reader);
          }
        }

        break;