def build_regions_summary(items: list) -> dict:
    """Group items by region → city with consistent active_now calculation.

    Rules:
      - Parse begin/end via _to_utc_dt_for_active (returns UTC-aware datetime or None)
      - Only mark active when BOTH begin and end successfully parsed and now_utc falls between them
      - If either date is missing/unparseable => NOT active (False)
    """
    regions = {}
    now_utc = datetime.now(timezone.utc)

    for it in items:
        country = (it.get('to_country') or it.get('from_country') or "").strip()
        location = (it.get('to_location') or it.get('from_location') or "").strip()
        region = resolve_region(country, location)
        city = normalize_city(location) or "Unknown"

        # support multiple field names
        b_raw = it.get("begin_date") or it.get("begin_dt") or it.get("BEGIN_DT")
        e_raw = it.get("end_date")   or it.get("end_dt")   or it.get("END_DT")

        # parse to UTC-aware datetimes (or None)
        b_utc = _to_utc_dt_for_active(b_raw)
        e_utc = _to_utc_dt_for_active(e_raw)

        # active only if both parsed and now is between them
        active_now = False
        try:
            if b_utc is not None and e_utc is not None:
                active_now = (b_utc <= now_utc <= e_utc)
            else:
                # IMPORTANT: DO NOT assume active if dates are missing/unparseable
                active_now = False
        except Exception:
            active_now = False

        # --- build region/city containers if missing ---
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

        reg["total_count"] += 1
        if active_now:
            reg["active_count"] += 1
        if it.get("is_vip"):
            reg["vip_count"] += 1
        if active_now and it.get("is_vip"):
            reg["active_vip_count"] += 1

        # city
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

        cty["total_count"] += 1
        if active_now:
            cty["active_count"] += 1
        if it.get("is_vip"):
            cty["vip_count"] += 1
        if active_now and it.get("is_vip"):
            cty["active_vip_count"] += 1

        cty["sample_items"].append({
            "first_name": it.get("first_name"),
            "last_name": it.get("last_name"),
            "email": it.get("email"),
            "pnr": it.get("pnr"),
            "active_now": bool(active_now),
            "is_vip": bool(it.get("is_vip")),
            "begin_dt": it.get("begin_dt") or it.get("begin_date"),
            "end_dt": it.get("end_dt") or it.get("end_date"),
        })

    # sort cities by traveller count
    for reg_data in regions.values():
        reg_data["cities"] = dict(
            sorted(reg_data["cities"].items(), key=lambda kv: -kv[1]["total_count"])
        )

    return regions