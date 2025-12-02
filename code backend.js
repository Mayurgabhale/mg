CREATE TABLE IF NOT EXISTS controller_doors (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  controller_ip TEXT,
  door TEXT,
  reader TEXT,
  location TEXT,
  city TEXT,
  added_by TEXT,
  updated_by TEXT,
  added_at TEXT,
  updated_at TEXT
);



..
// ---------- Controller Doors JSON ----------
const doorsFile = path.join(dataDir, "ControllerDataWithDoorReader.json");
if (fs.existsSync(doorsFile)) {
  const controllerDoors = JSON.parse(fs.readFileSync(doorsFile));

  controllerDoors.forEach(ctrl => {
    ctrl.Doors.forEach(door => {
      db.prepare(`
        INSERT INTO controller_doors 
        (controller_ip, door, reader, location, city, added_by, added_at)
        VALUES (?, ?, ?, ?, ?, ?, datetime('now'))
      `).run(
        ctrl.IP_address,
        door.Door,
        door.Reader,
        ctrl.Location || null,
        ctrl.City || null,
        "system-import"
      );
    });
  });

  console.log("✔ Controller doors imported");
} else {
  console.log("⚠ ControllerDataWithDoorReader.json missing — skipping");
}