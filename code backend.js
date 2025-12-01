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