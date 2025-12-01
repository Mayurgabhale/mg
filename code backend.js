http://127.0.0.1:8000/devices
 "id": 341,
    "type": "camera",
    "name": "HYD_3FLR_A WING PASSAGE CAM 3",
    "ip_address": "10.00.1.11",
    "location": "APAC",
    "city": "HYDERABAD",
    "details": "FLIR",
    "hyperlink": "http://10.200.3.55/camera/index.html",
    "remark": "",
    "person_name": "mayur gabhale",
    "doors": null,
    "status": "Online"
  }
]


this status is wrong, piceasue this ip address wrong i am write this ip ony testin purpose ok 


C:\Users\W0024618\Desktop\Backend\python-service\app.py

from fastapi import FastAPI
from device_service import add_device, update_device, delete_device, get_all_devices
from ping_service import ping

app = FastAPI()

@app.get("/devices")
def list_devices():
    devices = get_all_devices()
    for d in devices:
        d["status"] = ping(d["ip_address"])
    return devices

@app.post("/devices")
def create_device(device: dict):
    add_device(device)
    return {"message": "Device added"}

@app.put("/devices/{ip}")
def edit_device(ip: str, updates: dict):
    update_device(ip, updates)
    return {"message": "Device updated"}

@app.delete("/devices/{ip}")
def remove_device(ip: str):
    delete_device(ip)
    return {"message": "Device deleted"}

-------
    C:\Users\W0024618\Desktop\Backend\python-service\database.py
import sqlite3

def get_db():
    conn = sqlite3.connect("devices.db")
    conn.row_factory = sqlite3.Row
    return conn

def create_tables():
    db = get_db()
    db.execute("""
    CREATE TABLE IF NOT EXISTS devices (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        type TEXT NOT NULL,
        name TEXT,
        ip_address TEXT UNIQUE,
        location TEXT,
        city TEXT,
        details TEXT,
        hyperlink TEXT,
        remark TEXT,
        person_name TEXT,
        doors TEXT
    )
    """)
    db.commit()

# Run once to ensure tables exist
create_tables()


C:\Users\W0024618\Desktop\Backend\python-service\device_service.py
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
C:\Users\W0024618\Desktop\Backend\python-service\models.py
import sqlite3

def get_db():
    conn = sqlite3.connect("devices.db")
    conn.row_factory = sqlite3.Row
    return conn

def create_tables():
    db = get_db()
    db.execute("""
    CREATE TABLE IF NOT EXISTS devices (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        type TEXT NOT NULL,
        name TEXT,
        ip_address TEXT UNIQUE,
        location TEXT,
        city TEXT,
        details TEXT,
        hyperlink TEXT,
        remark TEXT,
        person_name TEXT,
        doors TEXT
    )
    """)
    db.commit()

create_tables()

C:\Users\W0024618\Desktop\Backend\python-service\ping_service.py

import os
import platform
import subprocess

def ping(ip):
    """
    Ping a device, return 'Online' or 'Offline'
    """
    param = "-n" if platform.system().lower()=="windows" else "-c"
    try:
        output = subprocess.check_output(["ping", param, "1", ip], stderr=subprocess.DEVNULL)
        return "Online"
    except subprocess.CalledProcessError:
        return "Offline"
