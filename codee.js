from datetime import datetime

def build_regions_summary(items: list) -> dict:
    """Group all items by region → city, with live active_now calculation."""
    regions = {}

    for it in items:
        country = (it.get('to_country') or it.get('from_country') or "").strip()
        location = (it.get('to_location') or it.get('from_location') or "").strip()
        region = resolve_region(country, location)
        city = normalize_city(location) or "Unknown"

        # --- Recompute active_now automatically ---
        b, e = it.get("begin_dt"), it.get("end_dt")
        active_now = False
        if b and e:
            try:
                if isinstance(b, str):
                    b = datetime.fromisoformat(b)
                if isinstance(e, str):
                    e = datetime.fromisoformat(e)
                now = datetime.now()
                active_now = b <= now <= e
            except Exception:
                active_now = False

        # --- Initialize region if missing ---
        if region not in regions:
            regions[region] = {
                "region_code": region,
                "total_count": 0,
                "active_count": 0,
                "vip_count": 0,
                "active_vip_count": 0,
                "cities": {}
            }

        reg = regions[region]

        # --- Region-level counters ---
        reg["total_count"] += 1
        if active_now:
            reg["active_count"] += 1
        if it.get("is_vip"):
            reg["vip_count"] += 1
        if active_now and it.get("is_vip"):
            reg["active_vip_count"] += 1

        # --- Initialize city if missing ---
        if city not in reg["cities"]:
            reg["cities"][city] = {
                "city_name": city,
                "total_count": 0,
                "active_count": 0,
                "vip_count": 0,
                "active_vip_count": 0,
                "sample_items": []
            }

        cty = reg["cities"][city]

        # --- City-level counters ---
        cty["total_count"] += 1
        if active_now:
            cty["active_count"] += 1
        if it.get("is_vip"):
            cty["vip_count"] += 1
        if active_now and it.get("is_vip"):
            cty["active_vip_count"] += 1

        # --- Add traveler sample (limit 10) ---
        if len(cty["sample_items"]) < 10:
            cty["sample_items"].append({
                "first_name": it.get("first_name"),
                "last_name": it.get("last_name"),
                "email": it.get("email"),
                "pnr": it.get("pnr"),
                "active_now": active_now,  # ✅ dynamically calculated
                "is_vip": bool(it.get("is_vip")),
                "begin_dt": it.get("begin_dt"),
                "end_dt": it.get("end_dt"),
            })

    # --- Sort cities by traveler count ---
    for reg_data in regions.values():
        reg_data["cities"] = dict(
            sorted(reg_data["cities"].items(), key=lambda kv: -kv[1]["total_count"])
        )

    return regions