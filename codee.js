http://localhost:3000/partition/SG.Singapore/details
not disply antthig
APAC Occupancy • SG.Singapore
SG.Singapore

Floor Details
not show chekc also this code doorMap.js

C:\Users\W0024618\Desktop\apac-occupancy-frontend\src\utils\doorMap.js



  "APAC_IN_HYD_2NDFLR_AHU ROOM 1___InDirection": "HYD_2NDFLR",


  "APAC_IN_HYD_2NDFLR_F&A WING SIDE ENTRY 1___InDirection": "HYD_2NDFLR",
  "APAC_IN_HYD_2NDFLR_F&A WING SIDE ENTRY 1___OutDirection": "Out of Office",

  "APAC_IN_HYD_2NDFLR_MAIN LIFT LOBBY ENTRY 2___InDirection": "HYD_2NDFLR",
  "APAC_IN_HYD_2NDFLR_MAIN LIFT LOBBY ENTRY 2___OutDirection": "Out of Office",

  
  //Singapore

  "APAC_SG_11 FLR_BackDR___InDirection":"Singapore",
  "APAC_SG_11 FLR_BackDR___OutDirection":"Out of Office",

  "APAC_SG_11 FLR_Main Door___InDirection":"Singapore",
  "APAC_SG_11 FLR_Main Door___OutDirection:":"Out of Office",

  "APAC_SG_WU_11 FLR_Server Door___InDirection":"Singapore",
  "APAC_SG_WU_11 FLR_Server Door___OutDirection":"Singapore",




};


// 2) zone → floor
const zoneFloorMap = {
  "Red Zone": "Podium Floor",
  "Red Zone - Outer Area": "Podium Floor",
  "Yellow Zone": "Podium Floor",
  "Yellow Zone - Outer Area": "Podium Floor",
  "Reception Area": "Podium Floor",
  "Green Zone": "Podium Floor",
  "Green Zone - Outer Area": "Podium Floor",
  "Orange Zone": "Podium Floor",
  "Orange Zone - Outer Area": "Podium Floor",
  "Assembly Area": "Podium Floor",

  "2nd Floor, Pune": "2nd Floor",
  "2nd Floor, Pune - Outer Area": "2nd Floor",

  "Tower B": "Tower B",
  "Tower B - Outer Area": "Tower B",
  "Tower B GYM": "Tower B",
  "Tower B GYM - Outer Area": "Tower B",

  "Kuala Lumpur": "Kuala Lumpur",

  "6th Floor": "6th Floor",
  "7th Floor": "7th Floor",

  "Tokyo": "Tokyo",
  "Taguig": "Taguig",

  "Out of office": null,
  "HYD_2NDFLR":"Hyderabad",

  "APAC_SG":"Singapore"
};

// 3) URL segment → partitions[] key


const partitionMap = {
  Pune: "APAC_IN_PUN",
  "Quezon City": "APAC_PH_Manila",    // must match your “/partition/Quezon City/details”
  Taguig: "APAC_PI_Manila",
  "Kuala Lumpur": "APAC_MY_KL",
  "JP.Tokyo": "APAC_JPN_Tokyo",  // if your URL is /partition/JP.Tokyo/details
  Tokyo: "APAC_JPN_Tokyo",  // you can even support both
  Hyderabad:"APAC_IN_HYD",
  Singapore:"APAC_SG"
};



// 1) same normalizer as on the backend
function normalizeDoorName(name) {
  return name
    .replace(/[_/]/g, ' ')
    .replace(/[^\w\s-]/g, '')
    .replace(/\bRECPTION\b/gi, 'RECEPTION')
    .replace(/\bENRTY\b|\bENTRTY\b/gi, 'ENTRY')
    .replace(/\b[0-9A-F]{6}\b$/, '')
    .replace(/[\s-]+/g, ' ')
    .toUpperCase()
    .trim();
}

// 2) build a normalized-key → zone lookup
const normalizedDoorZoneMap = Object.entries(doorMap).reduce(
  (acc, [rawKey, zone]) => {
    const [rawDoor, dir] = rawKey.split('___');
    const normKey = `${normalizeDoorName(rawDoor)}___${dir}`;
    acc[normKey] = zone;
    return acc;
  },
  {}
);


export {
  doorMap,
  zoneFloorMap,
  partitionMap,
  normalizeDoorName,
  normalizedDoorZoneMap
};


http://localhost:3007/api/occupancy/live-summary

{
  "success": true,
  "today": {
    "total": 1142,
    "Employee": 960,
    "Contractor": 182
  },
  "realtime": {
    "Pune": {
      "total": 590,
      "Employee": 523,
      "Contractor": 67,
      "floors": {
        "Tower B": 149,
        "Podium Floor": 441
      },
      "zones": {
        "Tower B": 147,
        "Orange Zone": 81,
        "Red Zone": 104,
        "Yellow Zone - Outer Area": 24,
        "Assembly Area": 10,
        "Green Zone": 68,
        "Yellow Zone": 121,
        "Reception Area": 22,
        "Orange Zone - Outer Area": 8,
        "Red Zone - Outer Area": 3,
        "Tower B GYM": 2
      }
    },
    "Quezon City": {
      "total": 120,
      "Employee": 103,
      "Contractor": 17,
      "floors": {
        "6th Floor": 31,
        "7th Floor": 89
      },
      "zones": {
        "6th Floor": 31,
        "7th Floor": 89
      }
    },
    "JP.Tokyo": {
      "total": 11,
      "Employee": 10,
      "Contractor": 1,
      "floors": {
        "Tokyo": 11
      },
      "zones": {
        "Tokyo": 11
      }
    },
    "IN.HYD": {
      "total": 53,
      "Employee": 18,
      "Contractor": 35,
      "floors": {
        "Hyderabad": 53
      },
      "zones": {
        "HYD_2NDFLR": 53
      }
    },
    "MY.Kuala Lumpur": {
      "total": 10,
      "Employee": 9,
      "Contractor": 1,
      "floors": {
        "Kuala Lumpur": 10
      },
      "zones": {
        "Kuala Lumpur": 10
      }
    },
    "Taguig City": {
      "total": 16,
      "Employee": 13,
      "Contractor": 3,
      "floors": {
        "Taguig": 16
      },
      "zones": {
        "Taguig": 16
      }
    },
    "SG.Singapore": {
      "total": 17,
      "Employee": 17,
      "Contractor": 0,
      "floors": {
        "Singapore": 17
      },
      "zones": {
        "Singapore": 17
      }
    }
  },
  "unmapped": [],
  "details": [
    {
      "ObjectName1": "Tewari, Puja",
      "Door": "APAC_IN_PUN_TOWER B_ST6_GYM SIDE DOOR",
      "PersonnelType": "Employee",
      "EmployeeID": "310108",
      "CardNumber": "615581",
      "PartitionName2": "Pune",
      "LocaleMessageTime": "2025-11-06T13:38:31.000Z",
      "Direction": "InDirection",
      "PersonGUID": "49A9FFA2-8593-4AB8-AFEC-0113835A5BF4",
      "CompanyName": "WU Srvcs India Private Ltd",
      "PrimaryLocation": "Pune - Business Bay",
      "Zone": "Tower B",
      "Floor": "Tower B"
    },
     {
      "ObjectName1": "Chu, Lie Onn Doris",
      "Door": "APAC_SG_11 FLR_Main Door",
      "PersonnelType": "Employee",
      "EmployeeID": "312276",
      "CardNumber": "621318",
      "PartitionName2": "SG.Singapore",
      "LocaleMessageTime": "2025-11-06T13:36:07.000Z",
      "Direction": "OutDirection",
      "PersonGUID": "BAF0DD23-2F0D-495A-901E-059590551F02",
      "CompanyName": "Western Union Global Network",
      "PrimaryLocation": "Singapore - WeWork 21 Collyer Quay",
      "Zone": null,
      "Floor": null
    },
    { },
    {
      "ObjectName1": "Ong, Chee Hao",
      "Door": "APAC_SG_11 FLR_Main Door",
      "PersonnelType": "Employee",
      "EmployeeID": "313731",
      "CardNumber": "413417",
      "PartitionName2": "SG.Singapore",
      "LocaleMessageTime": "2025-11-06T16:33:56.000Z",
      "Direction": "InDirection",
      "PersonGUID": "951606E9-0892-4C89-ACC1-41F7CE1BD044",
      "CompanyName": "Western Union Svcs Singapore",
      "PrimaryLocation": "Singapore - WeWork 21 Collyer Quay",
      "Zone": "Singapore",
      "Floor": "Singapore"
    },
    {
      {
      "ObjectName1": "Tandy, Marsheila",
      "Door": "APAC_SG_11 FLR_Main Door",
      "PersonnelType": "Employee",
      "EmployeeID": "327158",
      "CardNumber": "621297",
      "PartitionName2": "SG.Singapore",
      "LocaleMessageTime": "2025-11-06T16:37:44.000Z",
      "Direction": "InDirection",
      "PersonGUID": "F19739A2-5048-4441-86A2-4B8834433190",
      "CompanyName": "Western Union Svcs Singapore",
      "PrimaryLocation": "Singapore - WeWork 21 Collyer Quay",
      "Zone": "Singapore",
      "Floor": "Singapore"
    },
