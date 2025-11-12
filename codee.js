# ✅ Append all travelers (no limit)
cty["sample_items"].append({
    "first_name": it.get("first_name"),
    "last_name": it.get("last_name"),
    "email": it.get("email"),
    "pnr": it.get("pnr"),
    "active_now": it.get("active_now"),
    "is_vip": bool(it.get("is_vip")),
    "begin_dt": it.get("begin_dt"),
    "end_dt": it.get("end_dt"),
})