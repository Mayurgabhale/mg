import json
import pandas as pd
from database import get_db
import os

DATA_DIR = os.path.join(os.path.dirname(__file__), "data")

def save_excel_to_db(file_path, device_type):
    db = get_db()
    df = pd.read_excel(file_path)
    for _, row in df.iterrows():
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
            None
        ))
    db.commit()
    print(f"Saved {device_type} data from {os.path.basename(file_path)}")

# Load Excel files
save_excel_to_db(os.path.join(DATA_DIR, "CameraData.xlsx"), "camera")
save_excel_to_db(os.path.join(DATA_DIR, "ArchiverData.xlsx"), "archiver")
save_excel_to_db(os.path.join(DATA_DIR, "ControllerData.xlsx"), "controller")

# Load Controllers with doors JSON
with open(os.path.join(DATA_DIR, "ControllerDataWithDoorReader.json")) as f:
    controllers_with_doors = json.load(f)
    db = get_db()
    for ctrl in controllers_with_doors:
        db.execute("""
            INSERT OR IGNORE INTO devices
            (type, name, ip_address, location, city, details, hyperlink, remark, doors)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
        """, (
            "controller",
            ctrl.get("controllername"),
            ctrl.get("IP_address"),
            ctrl.get("Location"),
            ctrl.get("City"),
            None,
            None,
            None,
            json.dumps(ctrl.get("Doors")) if ctrl.get("Doors") else None
        ))
    db.commit()
    print("Saved controllers with doors from ControllerDataWithDoorReader.json")