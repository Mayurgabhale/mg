def build_regions_summary(items: list) -> dict:
    """Group all items by region → city, with live active_now calculation."""
    regions = {}

    for it in items:
        country = (it.get('to_country') or it.get('from_country') or "").strip()
        location = (it.get('to_location') or it.get('from_location') or "").strip()
        region = resolve_region(country, location)
        city = normalize_city(location) or "Unknown"

        # --- parse begin/end robustly ---
        b_raw, e_raw = it.get("begin_dt"), it.get("end_dt")
        b_dt, b_aware = _parse_dt_for_compare(b_raw)
        e_dt, e_aware = _parse_dt_for_compare(e_raw)

        # --- Active_now logic ---
        active_now = False
        try:
            # If we have valid begin/end → compute normally
            if b_dt and e_dt:
                if b_aware or e_aware:
                    if not b_aware:
                        b_dt = b_dt.replace(tzinfo=timezone.utc)
                    if not e_aware:
                        e_dt = e_dt.replace(tzinfo=timezone.utc)
                    now_utc = datetime.utcnow().replace(tzinfo=timezone.utc)
                    active_now = (b_dt <= now_utc <= e_dt)
                else:
                    now_naive = datetime.utcnow()
                    active_now = (b_dt <= now_naive <= e_dt)
            else:
                # ✅ No valid begin/end — assume currently active
                active_now = True
        except Exception:
            active_now = True  # fallback safe: assume active

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

        # --- Append all travelers ---
        cty["sample_items"].append({
            "first_name": it.get("first_name"),
            "last_name": it.get("last_name"),
            "email": it.get("email"),
            "pnr": it.get("pnr"),
            "active_now": bool(active_now),
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