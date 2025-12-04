Edit Device
Type*

Camera
when i opne anythin Type is not change 
opne serve, controoler and araciver any by dafulat Camera show  thsi is wrong 

Edit Device
Type*

Camera
Name*
APAC_PH_MANILA_ISTAR PRO_01
IP Address*
10.194.2.13
Location*
APAC



// Open edit modal by IP or hostname using cached device data
async function openEditForDeviceFromIP(ipOrHost) {
    if (!latestDetails || !latestDetails.details) {
        await fetchData(currentRegion); // Ensure devices are loaded
    }

    let found = null;

    // Search all device lists in latestDetails
    for (const list of Object.values(latestDetails.details)) {
        const m = (list || []).find(d => 
            (d.ip_address || d.IP_address || "").trim() === ipOrHost ||
            (d.hostname || d.HostName || "").trim() === ipOrHost
        );
        if (m) {
            found = m;
            break;
        }
    }

    if (!found) {
        alert("Device not found");
        return;
    }

    // Detect type for modal
    found._type_for_ui = detectTypeFromDeviceObj(found);

    // Open modal in edit mode
    showDeviceModal("edit", found);
}

// Detect device type from object
function detectTypeFromDeviceObj(obj) {
    if (obj.cameraname) return "camera";
    if (obj.controllername) return "controller";
    if (obj.archivername) return "archiver";
    if (obj.servername) return "server";
    if (obj.hostname && obj.is_pc_details) return "pcdetails";
    if (obj.hostname && obj.is_db_details) return "DBDetails";
    return "camera"; // fallback
}
