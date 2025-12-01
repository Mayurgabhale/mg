 import os
import platform
import subprocess
import re

# -------------------------
# Validate IP (fix for 10.00.1.11 issue)
# -------------------------
def is_valid_ip(ip):
    """
    Validate IPv4 format: 0-255.0-255.0-255.0-255
    """
    if not isinstance(ip, str):
        return False

    ip = ip.strip()

    pattern = r"^\d{1,3}(\.\d{1,3}){3}$"
    if not re.match(pattern, ip):
        return False

    # Ensure each block is 0-255
    parts = ip.split(".")
    for p in parts:
        if not 0 <= int(p) <= 255:
            return False

    return True


# -------------------------
# Ping Service
# -------------------------
def ping(ip):
    """
    Returns Online or Offline.
    First validates IP, then pings only once.
    """

    if not ip or not is_valid_ip(ip):
        return "Offline"   # Invalid IP format → always Offline

    ip = ip.strip()

    param = "-n" if platform.system().lower() == "windows" else "-c"

    try:
        subprocess.check_output(
            ["ping", param, "1", ip],
            stderr=subprocess.DEVNULL,
            stdout=subprocess.DEVNULL
        )
        return "Online"
    except subprocess.CalledProcessError:
        return "Offline"