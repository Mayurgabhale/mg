 case "pc_details":
      dev.hostname = row.hostname || null;
      dev.ip_address = row.ip_address || null;
      dev.IP_address = row.ip_address || null;
      dev.location = row.location || null;
      dev.city = row.city || null;
      dev.pc_name = row.pc_name || null;
      dev.added_by = row.added_by || null;      // ✅ ADD THIS
      dev.updated_by = row.updated_by || null;  // ✅ ADD THIS
      break;
