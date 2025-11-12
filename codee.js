# recompute active_now dynamically
b, e = it.get("begin_dt"), it.get("end_dt")
active_now = False
if b and e:
    try:
        if isinstance(b, str): b = datetime.fromisoformat(b)
        if isinstance(e, str): e = datetime.fromisoformat(e)
        now_local = datetime.now(tz=SERVER_TZ)
        active_now = b <= now_local <= e
    except Exception:
        active_now = False

if active_now:
    reg["active_count"] += 1