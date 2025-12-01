(venv) PS C:\Users\W0024618\Desktop\Backend\python-service> uvicorn app:app --reload
INFO:     Will watch for changes in these directories: ['C:\\Users\\W0024618\\Desktop\\Backend\\python-service']
INFO:     Uvicorn running on http://127.0.0.1:8000 (Press CTRL+C to quit)
INFO:     Started reloader process [30896] using StatReload
Process SpawnProcess-1:
Traceback (most recent call last):
  File "C:\Program Files\Python313\Lib\multiprocessing\process.py", line 313, in _bootstrap
    self.run()
    ~~~~~~~~^^
  File "C:\Program Files\Python313\Lib\multiprocessing\process.py", line 108, in run
    self._target(*self._args, **self._kwargs)
    ~~~~~~~~~~~~^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
  File "C:\Users\W0024618\Desktop\Backend\python-service\venv\Lib\site-packages\uvicorn\_subprocess.py", line 80, in subprocess_started
    target(sockets=sockets)
    ~~~~~~^^^^^^^^^^^^^^^^^
  File "C:\Users\W0024618\Desktop\Backend\python-service\venv\Lib\site-packages\uvicorn\server.py", line 67, in run
    return asyncio_run(self.serve(sockets=sockets), loop_factory=self.config.get_loop_factory())
  File "C:\Program Files\Python313\Lib\asyncio\runners.py", line 195, in run
    return runner.run(main)
           ~~~~~~~~~~^^^^^^
  File "C:\Program Files\Python313\Lib\asyncio\runners.py", line 118, in run
    return self._loop.run_until_complete(task)
           ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~^^^^^^
  File "C:\Program Files\Python313\Lib\asyncio\base_events.py", line 725, in run_until_complete
    return future.result()
           ~~~~~~~~~~~~~^^
  File "C:\Users\W0024618\Desktop\Backend\python-service\venv\Lib\site-packages\uvicorn\server.py", line 71, in serve
    await self._serve(sockets)
  File "C:\Users\W0024618\Desktop\Backend\python-service\venv\Lib\site-packages\uvicorn\server.py", line 78, in _serve
    config.load()
    ~~~~~~~~~~~^^
  File "C:\Users\W0024618\Desktop\Backend\python-service\venv\Lib\site-packages\uvicorn\config.py", line 439, in load
    self.loaded_app = import_from_string(self.app)
                      ~~~~~~~~~~~~~~~~~~^^^^^^^^^^
  File "C:\Users\W0024618\Desktop\Backend\python-service\venv\Lib\site-packages\uvicorn\importer.py", line 19, in import_from_string
    module = importlib.import_module(module_str)
  File "C:\Program Files\Python313\Lib\importlib\__init__.py", line 88, in import_module
    return _bootstrap._gcd_import(name[level:], package, level)
           ~~~~~~~~~~~~~~~~~~~~~~^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
  File "<frozen importlib._bootstrap>", line 1387, in _gcd_import
  File "<frozen importlib._bootstrap>", line 1360, in _find_and_load
  File "<frozen importlib._bootstrap>", line 1331, in _find_and_load_unlocked
  File "<frozen importlib._bootstrap>", line 935, in _load_unlocked
  File "<frozen importlib._bootstrap_external>", line 1026, in exec_module
  File "<frozen importlib._bootstrap>", line 488, in _call_with_frames_removed
  File "C:\Users\W0024618\Desktop\Backend\python-service\app.py", line 3, in <module>
    from device_service import add_device, update_device, delete_device, get_all_devices
  File "C:\Users\W0024618\Desktop\Backend\python-service\device_service.py", line 2, in <module>
    from database import get_db
ImportError: cannot import name 'get_db' from 'database' (C:\Users\W0024618\Desktop\Backend\python-service\database.py)

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

C:\Users\W0024618\Desktop\Backend\python-service\database.py empty

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

C:\Users\W0024618\Desktop\Backend\python-service\ping_service.py empty
