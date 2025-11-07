excle file format 
C:\Users\W0024618\Desktop\Backend\src\data\controllerWithdoor.xlsx
in this excle file like this format ok 
controllername	         IP_address	                                    Door 	                                      reader
	    blank                   blank                  APAC_IN_PUN_2NDFLR_IDF ROOM_10:05:86 Restricted Door	         in:1
      blank                   blank              		 APAC_IN_PUN_2NDFLR_UPS/ELEC ROOM Restricted Door_10:05:FE	     in:1
      blank                   blank            	  	 APAC_IN_PUN_2NDFLR_RECPTION TO WORKSTATION DOOR_10:05:4B	     in:1
IN-PUN-2NDFLR-ISTAR PRO	    10.199.13.10             APAC_IN_PUN_2NDFLR_RECPTION TO WORKSTATION DOOR_10:05:4B	     out:1
    blank                     blank         		     APAC_IN_PUN_2NDFLR_LIFTLOBBY TO RECEPTION EMTRY DOOR_10:05:74  in:1
    blank                     blank         		     APAC_IN_PUN_2NDFLR_LIFTLOBBY TO WORKSTATION DOOR_10:05:F0	    blank            


C:\Users\W0024618\Desktop\Backend\src\data\~$ControllerData.xlsx
in this not any blank ok 
controllername	IP_address	Location	City
IN-PUN-2NDFLR-ISTAR PRO	10.199.13.10	APAC	Pune 2nd Floor
IN-PUN-PODIUM-ISTAR PRO-01	10.199.8.20	APAC	Pune Podium
IN-PUN-PODIUM-ISTAR PRO-02	10.199.8.21	APAC	Pune Podium

so how to do this 

// Required packages
// Run this first if not installed:
// npm install xlsx fs path

const XLSX = require("xlsx");
const fs = require("fs");
const path = require("path");

// File paths
const controllerDataPath = "C:\\Users\\W0024618\\Desktop\\Backend\\src\\data\\ControllerData.xlsx";
const controllerWithDoorPath = "C:\\Users\\W0024618\\Desktop\\Backend\\src\\data\\controllerWithdoor.xlsx";
const outputJsonPath = "C:\\Users\\W0024618\\Desktop\\Backend\\src\\data\\ControllerDataWithDoorReader.json";

// Helper function to read Excel file
function readExcel(filePath) {
  const workbook = XLSX.readFile(filePath);
  const sheetName = workbook.SheetNames[0];
  return XLSX.utils.sheet_to_json(workbook.Sheets[sheetName]);
}

// Read both Excel files
const controllerData = readExcel(controllerDataPath);
const doorDataRaw = readExcel(controllerWithDoorPath);

// Forward fill controllername and IP_address in doorData
let lastController = "";
let lastIP = "";
const doorData = doorDataRaw.map(row => {
  if (row.controllername) lastController = row.controllername;
  if (row.IP_address) lastIP = row.IP_address;
  return {
    controllername: lastController,
    IP_address: lastIP,
    Door: row.Door || "",
    reader: row.reader || ""
  };
});

// Merge controller data and door mapping
const result = [];

controllerData.forEach(ctrl => {
  const matchingDoors = doorData.filter(
    d => d.controllername === ctrl.controllername && d.IP_address === ctrl.IP_address
  );

  const doorsList = matchingDoors.map(d => ({
    Door: d.Door.trim(),
    Reader: d.reader ? d.reader.trim() : ""
  }));

  result.push({
    controllername: ctrl.controllername,
    IP_address: ctrl.IP_address,
    Location: ctrl.Location,
    City: ctrl.City,
    Doors: doorsList
  });
});

// Write to JSON file
fs.writeFileSync(outputJsonPath, JSON.stringify(result, null, 4), "utf8");

console.log("✅ JSON file created successfully at:");
console.log(outputJsonPath);


door and reder are not add  "Doors": []
        "reader":[]
this is empty 
chceck why....           

[
    {
        "controllername": "IN-PUN-2NDFLR-ISTAR PRO",
        "IP_address": "10.199.13.10",
        "Location": "APAC",
        "City": "Pune 2nd Floor",
        "Doors": []
        "reader":[]
    },
i want like this 
  
-------------
C:\Users\W0024618\Desktop\Backend\src\data\ControllerDataWithDoorReader.json
[
    {
        "controllername": "IN-PUN-2NDFLR-ISTAR PRO",
        "IP_address": "10.199.13.10",
        "Location": "APAC",
        "City": "Pune 2nd Floor",
        "Doors": []
    },
    {
        "controllername": "IN-PUN-PODIUM-ISTAR PRO-01",
        "IP_address": "10.199.8.20",
        "Location": "APAC",
        "City": "Pune Podium",
        "Doors": []
    },
    {
        "controllername": "IN-PUN-PODIUM-ISTAR PRO-02",
        "IP_address": "10.199.8.21",
        "Location": "APAC",
        "City": "Pune Podium",
        "Doors": []
    },
    {
        "controllername": "IN-PUN-PODIUM-ISTAR PRO-03",
        "IP_address": "10.199.10.15",
        "Location": "APAC",
        "City": "Pune Podium",
        "Doors": []
    },
