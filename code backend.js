ok, i am do this 
    
PS C:\Users\W0024618\Desktop\Backend\python-service\data> dir


    Directory: C:\Users\W0024618\Desktop\Backend\python-service\data


Mode                 LastWriteTime         Length Name
----                 -------------         ------ ----
-a----         7/31/2025   9:53 PM          17446 ArchiverData.xlsx
-a----         12/1/2025  12:39 PM           3809 archivers.json
-a----         12/1/2025  10:30 AM        3400706 CameraData.xlsx
-a----         12/1/2025  12:39 PM          41143 cameras.json
-a----         11/7/2025   3:24 PM          13383 ControllerData.xlsx
-a----         11/7/2025   3:54 PM         103000 ControllerDataWithDoorReader.json
-a----         12/1/2025  12:39 PM          13219 controllers.json
-a----         11/7/2025   3:06 PM          54171 controllerWithdoor.xlsx
-a----         12/1/2025  12:39 PM           2604 DBDetails.json
-a----         8/25/2025   1:13 PM          11071 DBDetails.xlsx
-a----         12/1/2025  12:39 PM           3432 pcDetails.json
-a----         8/26/2025   3:49 PM          11131 PCDetails.xlsx
-a----         8/25/2025   4:10 PM          10730 ServerData.xlsx
-a----         12/1/2025  12:39 PM            855 servers.json


PS C:\Users\W0024618\Desktop\Backend\python-service\data> 



    C:\Users\W0024618\Desktop\Backend\python-service\import_devices.py
import json
import pandas as pd
from database import get_db
import os

DATA_DIR = os.path.join(os.path.dirname(__file__), "data")

def save_excel_to_db(file_path, device_type, doors_json=None):
    db = get_db()
    
    # read Excel
    df = pd.read_excel(file_path)
    
    for _, row in df.iterrows():
        # normalize columns
        name = row.get("cameraname") or row.get("archivername") or row.get("controllername") or row.get("servername") or row.get("hostname")
        ip = row.get("Ip_address") or row.get("IP_address")
        location = row.get("Location")
        city = row.get("City")
        details = row.get("Deviec_details") or row.get("Application") or None
        hyperlink = row.get("hyperlink") if "hyperlink" in row else None
        remark = row.get("Remark") if "Remark" in row else None
        
        db.execute("""
            INSERT OR IGNORE INTO devices
            (type, name, ip_address, location, city, details, hyperlink, remark, doors)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
        """, (
            device_type,
            name,
            ip,
            location,
            city,
            details,
            hyperlink,
            remark,
            json.dumps(doors_json) if doors_json else None
        ))
    
    db.commit()
    print(f"Saved {device_type} data from {os.path.basename(file_path)}")





# Example: load all Excel files
save_excel_to_db(os.path.join(DATA_DIR, "CameraData.xlsx"), "camera")
save_excel_to_db(os.path.join(DATA_DIR, "ArchiverData.xlsx"), "archiver")
save_excel_to_db(os.path.join(DATA_DIR, "ControllerData.xlsx"), "controller")

# For Controllers with doors (JSON)
with open(os.path.join(DATA_DIR, "ControllerDataWithDoorReader.json")) as f:
    controllers_with_doors = json.load(f)
    for ctrl in controllers_with_doors:
        save_excel_to_db(None, "controller", doors_json=ctrl.get("Doors"))
