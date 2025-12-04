// --- save doors if controller ---
if (type === "controllers" && Array.isArray(deviceObj.Doors)) {
    const stmt = db.prepare(`
        INSERT INTO controller_doors (controller_ip, door, reader, added_by, added_at)
        VALUES (?, ?, ?, 'api', datetime('now'))
    `);

    for (const d of deviceObj.Doors) {
        stmt.run(ip, d.door, d.reader);
    }
}


.
..
// ----- UPDATE DOORS IF CONTROLLER -----
if (listName === "controllers" && Array.isArray(updateFields.Doors)) {

    // delete old doors
    db.prepare("DELETE FROM controller_doors WHERE controller_ip = ?").run(oldIp);

    // insert new doors
    const stmt = db.prepare(`
        INSERT INTO controller_doors (controller_ip, door, reader, added_by, added_at)
        VALUES (?, ?, ?, 'api', datetime('now'))
    `);

    for (const d of updateFields.Doors) {
        stmt.run(oldIp, d.door, d.reader);
    }
}