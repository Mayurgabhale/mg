on this time the occupancy can you show 0.
yes 
http://localhost:3005/api/occupancy/time-travel?date=2025-11-05&time=00:00:00
{
  "success": true,
  "scope": "EMEA",
  "asOfLocal": "2025-11-05T00:00:00.000+00:00",
  "asOfUTC": "2025-11-05T00:00:00.000Z",
  "snapshot": {
    "total": 890,
    "Employee": 842,
    "Contractor": 48,
    "byPartition": {
      "AUT.Vienna": {
        "total": 57,
        "Employee": 47,
        "Contractor": 10
      },
      "DU.Abu Dhab": {
        "total": 40,
        "Employee": 39,
        "Contractor": 1
      },
      "IE.Dublin": {
        "total": 38,
        "Employee": 34,
        "Contractor": 4
      },
      "IT.Rome": {
        "total": 36,
        "Employee": 34,
        "Contractor": 2
      },
      "LT.Vilnius": {
        "total": 587,
        "Employee": 561,
        "Contractor": 26
      },
      "MA.Casablanca": {
        "total": 33,
        "Employee": 32,
        "Contractor": 1
      },
      "RU.Moscow": {
        "total": 1,
        "Employee": 1,
        "Contractor": 0
      },
      "UK.London": {
        "total": 33,
        "Employee": 32,
        "Contractor": 1
      },
      "ES.Madrid": {
        "total": 65,
        "Employee": 62,
        "Contractor": 3
      }
    }
  },
  "details": [
    {
      "MessageUTC": "2025-11-04T09:22:31.000Z",
      "ObjectName1": "Pietrzak, Danuta Anna",
      "Door": "EMEA_AUT_VIENNA_ICON_11FLR_Reception to WUIB Restrict",
      "PartitionName2": "AUT.Vienna",
      "PersonGUID": "D73A83A8-12A6-4DDF-BAFB-E3198AF0284E",
      "PersonnelType": "Property Management",
      "Direction": "InDirection",
      "LocaleMessageTime": "2025-11-04T09:22:31.000+00:00"
    },
    {
      "MessageUTC": "2025-11-04T11:25:55.000Z",
      "ObjectName1": "Vrapi, Ervis",
      "Door": "EMEA_AUT_VIENNA_ICON_11FLR_WUIB Restricted Main Entrance 2 Door",
      "PartitionName2": "AUT.Vienna",
      "PersonGUID": "C27620A0-0AA6-4483-B8A1-F2641BA9759A",
      "PersonnelType": "Employee",
      "Direction": "InDirection",
      "LocaleMessageTime": "2025-11-04T11:25:55.000+00:00"
    },
    {
      "MessageUTC": "2025-11-04T13:12:57.000Z",
      "ObjectName1": "Mayer, Christoph",
      "Door": "EMEA_AUT_VIENNA_ICON_11FLR_WUPSIL to WUIB Kitchen Door",
      "PartitionName2": "AUT.Vienna",
      "PersonGUID": "D17D5240-AF93-452F-9678-C0494BCB6EFC",
      "PersonnelType": "Employee",
      "Direction": "InDirection",
      "LocaleMessageTime": "2025-11-04T13:12:57.000+00:00"
    },
    {
      "MessageUTC": "2025-11-04T13:14:24.000Z",
      "ObjectName1": "Jasiunaite Ozgur, Julija",
      "Door": "EMEA_AUT_VIENNA_ICON_11FLR_WUIB Restricted Main Entrance 2 Door",
      "PartitionName2": "AUT.Vienna",
      "PersonGUID": "67CCF39E-5252-436E-A0B4-2E637FB1FBD4",
      "PersonnelType": "Employee",
      "Direction": "InDirection",
      "LocaleMessageTime": "2025-11-04T13:14:24.000+00:00"
    },
    {
