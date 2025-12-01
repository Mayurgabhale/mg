[notice] A new release of pip is available: 25.1.1 -> 25.3
[notice] To update, run: python.exe -m pip install --upgrade pip
(venv) PS C:\Users\W0024618\Desktop\Backend\python-service> python import_devices.py               
Traceback (most recent call last):
  File "C:\Users\W0024618\Desktop\Backend\python-service\import_devices.py", line 48, in <module>
    save_excel_to_db(os.path.join(DATA_DIR, "CameraData.xlsx"), "camera")
    ~~~~~~~~~~~~~~~~^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
  File "C:\Users\W0024618\Desktop\Backend\python-service\import_devices.py", line 12, in save_excel_to_db
    df = pd.read_excel(file_path)
  File "C:\Users\W0024618\Desktop\Backend\python-service\venv\Lib\site-packages\pandas\io\excel\_base.py", line 495, in read_excel
    io = ExcelFile(
        io,
    ...<2 lines>...
        engine_kwargs=engine_kwargs,
    )
  File "C:\Users\W0024618\Desktop\Backend\python-service\venv\Lib\site-packages\pandas\io\excel\_base.py", line 1550, in __init__
    ext = inspect_excel_format(
        content_or_path=path_or_buffer, storage_options=storage_options
    )
  File "C:\Users\W0024618\Desktop\Backend\python-service\venv\Lib\site-packages\pandas\io\excel\_base.py", line 1402, in inspect_excel_format
    with get_handle(
         ~~~~~~~~~~^
        content_or_path, "rb", storage_options=storage_options, is_text=False
        ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
    ) as handle:
    ^
  File "C:\Users\W0024618\Desktop\Backend\python-service\venv\Lib\site-packages\pandas\io\common.py", line 882, in get_handle
    handle = open(handle, ioargs.mode)
FileNotFoundError: [Errno 2] No such file or directory: 'C:\\Users\\W0024618\\Desktop\\Backend\\python-service\\data\\CameraData.xlsx'
(venv) PS C:\Users\W0024618\Desktop\Backend\python-service> 

########
    C:\Users\W0024618\Desktop\Backend\src\data\CameraData.xlsx
    C:\Users\W0024618\Desktop\Backend\src\data\cameras.json
PS C:\Users\W0024618\Desktop\Backend\src\data> dir


    Directory: C:\Users\W0024618\Desktop\Backend\src\data


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


PS C:\Users\W0024618\Desktop\Backend\src\data> 

    see this 
    
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
