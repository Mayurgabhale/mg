import json
from database import get_db

def add_device(device):
    db = get_db()
    db.execute("""
        INSERT INTO devices (type, name, ip_address, location, city, details, hyperlink, remark, person_name, doors)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    """, (
        device["type"],
        device.get("name"),
        device.get("ip_address"),
        device.get("location"),
        device.get("city"),
        device.get("details"),
        device.get("hyperlink"),
        device.get("remark"),
        device.get("person_name"),
        json.dumps(device.get("doors")) if device.get("doors") else None
    ))
    db.commit()

def update_device(ip, updates):
    db = get_db()
    set_clause = []
    params = []
    for key, value in updates.items():
        if key == "doors" and value is not None:
            value = json.dumps(value)
        set_clause.append(f"{key} = ?")
        params.append(value)
    params.append(ip)
    db.execute(f"UPDATE devices SET {', '.join(set_clause)} WHERE ip_address = ?", params)
    db.commit()

def delete_device(ip):
    db = get_db()
    db.execute("DELETE FROM devices WHERE ip_address = ?", (ip,))
    db.commit()

def get_all_devices():
    db = get_db()
    rows = db.execute("SELECT * FROM devices").fetchall()
    result = []
    for row in rows:
        row_dict = dict(row)
        if row_dict.get("doors"):
            row_dict["doors"] = json.loads(row_dict["doors"])
        result.append(row_dict)
    return result