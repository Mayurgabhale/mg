in this i want ot add alos 
"Location": "APAC",
        "City": "Pune 2nd Floor",
  thus two ok 
function buildControllerStatus() {
  fullStatus = controllerData.map(controller => {
    const ip = controller.IP_address.trim();
    const status = deviceStatus[ip] || "Unknown";

    // If controller offline, mark all doors offline too
    const doors = controller.Doors.map(d => ({
      ...d,
      status: status === "Online" ? "Online" : "Offline",
    }));

    return {
      controllername: controller.controllername,
      IP_address: ip,
      controllerStatus: status,
      Doors: doors,
    };
  });
}


[
    {
        "controllername": "IN-PUN-2NDFLR-ISTAR PRO",
        "IP_address": "10.199.13.10",
        "Location": "APAC",
        "City": "Pune 2nd Floor",
        "Doors": [
            {
                "Door": "APAC_IN_PUN_2NDFLR_IDF ROOM_10:05:86 Restricted Door",
                "Reader": "in:1"
            },
            {
                "Door": "APAC_IN_PUN_2NDFLR_UPS/ELEC ROOM Restricted Door_10:05:FE",
                "Reader": "in:1"
            },
            {
                "Door": "APAC_IN_PUN_2NDFLR_RECPTION TO WORKSTATION DOOR_10:05:4B",
                "Reader": "in:1"
            },
            {
                "Door": "APAC_IN_PUN_2NDFLR_RECPTION TO WORKSTATION DOOR_10:05:4B",
                "Reader": "out:1"
            },
            {
                "Door": "APAC_IN_PUN_2NDFLR_LIFTLOBBY TO RECEPTION EMTRY DOOR_10:05:74",
                "Reader": "in:1"
            },
            {
                "Door": "APAC_IN_PUN_2NDFLR_LIFTLOBBY TO WORKSTATION DOOR_10:05:F0",
                "Reader": ""
            }
        ]
    },
