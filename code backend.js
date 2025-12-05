function calculateDoorSummary(doors, controllers) {
  let total = doors.length;
  let online = 0;
  let offline = 0;

  for (const door of doors) {
    const parent = controllers.find(c => c.ip_address === door.controller_ip);

    if (!parent) {
      offline++;   // controller missing = door offline
      continue;
    }

    if (parent.status === "Online") online++;
    else offline++;
  }

  return { total, online, offline };
}