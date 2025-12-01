
src\data\~$CameraData.xlsx
For Camera --- 
cameraname 	Ip_address	Location	City	Deviec_details 	hyperlink	Remark
HYD_2FLR_B WING PASSAGE CAM 1 - 10.200.3.41- 136	10.200.3.41	APAC	HYDERABAD	axis	http://10.200.3.41/camera/index.html	
HYD_2FLR_B WING PASSAGE CAM 2 - 10.200.3.2 - 121	10.200.3.2 	APAC	HYDERABAD	FLIR		
10.192.3.244	APAC	Japan Tokyo	Verkada	https://wu.command.verkada.com/cameras/b0fc7895-87d6-4f0c-9667-ed821cedd5ca/	
10.128.202.136	EMEA	Austria, Vienna	FLIR		Not accessible 
-------------------------

  src\data\~$ArchiverData.xlsx
For Archiver ---
archivername	Ip_address	Location	City
Archiver Manila	10.193.132.8	APAC	Taguig City
Archiver Taguig City Philippines	10.194.2.190	APAC	Taguig City

---------------------
  src\data\~$ControllerData.xlsx
For Controller ---
controllername	IP_address	Location	City
IN-PUN-2NDFLR-ISTAR PRO	10.199.13.10	APAC	Pune 2nd Floor
IN-PUN-PODIUM-ISTAR PRO-01	10.199.8.20	APAC	Pune Podium
-----------------------
  src\data\~$ServerData.xlsx
For Server ---
  servername 	IP_address	Location	City
Master Server 	40.38.133.60	NAMER	Denver Colorado
NAMER Server 	14.58.108.01	NAMER	Denver Colorado

-----------------------------

  src\data\~$DBDetails.xlsx
for DBDetails --
Location	City	HostName	Ip_address	Application	Windows Server
NAMER	Denver	SRVWUDEN0890v	10.58.118.22	CCURE MAS SQL DB	Windows Server 2019 Standard
NAMER	Denver	SRVWUDEN0190V	10.58.118.20	CCURE MAS APP	Windows Server 2016 Standard
-------------------------

  src\data\~$PCDetails.xlsx
For PCDetails ---
HostName	Ip_address	Location	City	PC Name
WKSWUPUN4501	WKSWUPUN4501	APAC	Pune Podium	Screen 03
WKSPUN-392353	WKSPUN-392353	APAC	Pune Podium	Screen 04

C:\Users\W0024618\Desktop\Backend\src\data\ControllerDataWithDoorReader.json
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
    {
        "controllername": "IN-PUN-PODIUM-ISTAR PRO-01",
        "IP_address": "10.199.8.20",
        "Location": "APAC",
        "City": "Pune Podium",
        "Doors": [
            {
                "Door": "APAC_IN-PUN-PODIUM-RED-RECREATION AREA FIRE EXIT 1-DOOR",
                "Reader": ""
            },

data base format for each device like this. and also,
   how is update device that persona name also, in edit device detaisl ok 
