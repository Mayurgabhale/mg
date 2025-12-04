const stmt = db.prepare(`
  INSERT INTO controller_doors (controller_ip, door, reader, location, city, added_by, added_at)
  VALUES (?, ?, ?, ?, ?, 'api', datetime('now'))
`);

for (const d of doorsToInsert) {
  const doorVal = (d && (d.door || d.Door || d.name)) || "";
  const readerVal = (d && (d.reader || d.Reader)) || "";
  const locVal = norm.location || null;
  const cityVal = norm.city || null;

  stmt.run(ip, doorVal, readerVal, locVal, cityVal);
}



....
if (Array.isArray(doorsToUpdate)) {

  db.prepare("DELETE FROM controller_doors WHERE controller_ip = ?").run(oldIp);

  const stmt = db.prepare(`
    INSERT INTO controller_doors (controller_ip, door, reader, location, city, added_by, added_at)
    VALUES (?, ?, ?, ?, ?, 'api', datetime('now'))
  `);

  const locVal = allData[listName][idx].location || null;
  const cityVal = allData[listName][idx].city || null;

  for (const d of doorsToUpdate) {
    const doorVal = (d && (d.door || d.Door || d.name)) || "";
    const readerVal = (d && (d.reader || d.Reader)) || "";
    stmt.run(oldIp, doorVal, readerVal, locVal, cityVal);
  }

  reloadControllerDoors();
}