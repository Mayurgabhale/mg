import os
import platform
import subprocess
import re

def is_valid_ip(ip):
    if not isinstance(ip, str):
        return False

    ip = ip.strip()
    pattern = r"^\d{1,3}(\.\d{1,3}){3}$"
    if not re.match(pattern, ip):
        return False

    for p in ip.split("."):
        if not 0 <= int(p) <= 255:
            return False

    return True


def ping(ip):
    """
    Windows + Linux compatible
    Python 3.13 compatible (uses subprocess.run)
    """
    if not ip or not is_valid_ip(ip):
        return "Offline"

    ip = ip.strip()
    param = "-n" if platform.system().lower() == "windows" else "-c"

    result = subprocess.run(
        ["ping", param, "1", ip],
        stdout=subprocess.DEVNULL,
        stderr=subprocess.DEVNULL
    )

    return "Online" if result.returncode == 0 else "Offline"