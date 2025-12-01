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