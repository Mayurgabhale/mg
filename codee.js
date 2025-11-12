from datetime import datetime, timezone

def _parse_dt_for_compare(val):
    """Parse datetime-like value for comparison.
    Returns (dt, aware) where dt is either:
      - timezone-aware in UTC (if original had tzinfo)
      - naive UTC-based datetime (if original was naive)
    """
    if val is None:
        return None, None
    if isinstance(val, datetime):
        dt = val
    else:
        try:
            dt = date_parser.parse(str(val))
        except Exception:
            return None, None

    if dt.tzinfo is not None:
        # convert to UTC-aware
        return dt.astimezone(timezone.utc), True
    else:
        # naive — interpret as UTC-equivalent naive for comparison
        # use datetime.utcnow() (naive) for comparison
        return dt, False


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

        # Decide comparison mode:
        # - if either side is timezone-aware, compare in UTC-aware mode
        # - otherwise compare naive with datetime.utcnow()
        active_now = False
        try:
            if b_dt and e_dt:
                if b_aware or e_aware:
                    # make both aware UTC datetimes (if one side naive, treat it as UTC)
                    if not b_aware:
                        b_dt = b_dt.replace(tzinfo=timezone.utc)
                    if not e_aware:
                        e_dt = e_dt.replace(tzinfo=timezone.utc)
                    now_utc = datetime.utcnow().replace(tzinfo=timezone.utc)
                    active_now = (b_dt <= now_utc <= e_dt)
                else:
                    # naive comparison using UTC-equivalent naive
                    now_naive = datetime.utcnow()
                    active_now = (b_dt <= now_naive <= e_dt)
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

        # --- Append all travelers (no limit) ---
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



@router.get("/regions/{region_code}")
def get_region(region_code: str):
    """Get details for a specific region. Rebuilds region summary to ensure active counts are fresh."""
    # Ensure we have items (either cache or db)
    if previous_data.get("items"):
        items = previous_data["items"]
    else:
        db = SessionLocal()
        rows = db.query(DailyTravel).order_by(DailyTravel.id.asc()).all()
        db.close()
        if not rows:
            raise HTTPException(status_code=404, detail="No travel data available.")
        items = [{k: v for k, v in r.__dict__.items() if k != "_sa_instance_state"} for r in rows]
        previous_data["items"] = items

    # rebuild the regions summary fresh (so active_now is recomputed)
    regions = build_regions_summary(items)
    previous_data["regions_summary"] = regions
    previous_data["last_updated"] = datetime.now().isoformat()

    rc = region_code.upper()
    region_data = regions.get(rc)
    if not region_data:
        raise HTTPException(status_code=404, detail=f"Region {region_code} not found.")
    return JSONResponse(content=region_data)