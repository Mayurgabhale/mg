function mapRowToDevice(table, row) {
  if (!row) return null;
  const dev = {};

  switch (table) {
    case "cameras":
      dev.cameraname = row.cameraname || row.camera_name || null;
      dev.ip_address = row.ip_address || null;
      dev.location = row.location || null;
      dev.city = row.city || null;
      dev.device_details = row.device_details || row.deviec_details || null;
      dev.hyperlink = row.hyperlink || null;
      dev.remark = row.remark || null;
      dev.added_by = row.added_by || null;      // ✅ ADD THIS
      dev.updated_by = row.updated_by || null;  // ✅ ADD THIS
      break;

    case "archivers":
      dev.archivername = row.archivername || null;
      dev.ip_address = row.ip_address || null;
      dev.location = row.location || null;
      dev.city = row.city || null;
      dev.added_by = row.added_by || null;      // ✅ ADD THIS
      dev.updated_by = row.updated_by || null;  // ✅ ADD THIS
      break;

    case "controllers":
      dev.controllername = row.controllername || null;
      dev.ip_address = row.ip_address || null;
      dev.location = row.location || null;
      dev.city = row.city || null;
      dev.added_by = row.added_by || null;      // ✅ ADD THIS
      dev.updated_by = row.updated_by || null;  // ✅ ADD THIS
      break;

    case "servers":
      dev.servername = row.servername || null;
      dev.ip_address = row.ip_address || null;
      dev.location = row.location || null;
      dev.city = row.city || null;
      dev.added_by = row.added_by || null;      // ✅ ADD THIS
      dev.updated_by = row.updated_by || null;  // ✅ ADD THIS
      break;

    case "pc_details":
      dev.hostname = row.hostname || null;
      dev.ip_address = row.ip_address || null;
      dev.location = row.location || null;
      dev.city = row.city || null;
      dev.pc_name = row.pc_name || null;
      dev.added_by = row.added_by || null;      // ✅ ADD THIS
      dev.updated_by = row.updated_by || null;  // ✅ ADD THIS
      break;

    case "dbdetails":
      dev.location = row.location || null;
      dev.city = row.city || null;
      dev.hostname = row.hostname || null;
      dev.ip_address = row.ip_address || null;
      dev.application = row.application || null;
      dev.windows_server = row.windows_server || null;
      dev.added_by = row.added_by || null;      // ✅ ADD THIS
      dev.updated_by = row.updated_by || null;  // ✅ ADD THIS
      break;

    default:
      Object.keys(row).forEach(k => {
        dev[normalizeKey(k)] = row[k];
      });
  }

  ...
  return dev;
}