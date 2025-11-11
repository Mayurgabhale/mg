@router.get("/regions")
def get_regions():
    db = SessionLocal()
    rows = db.query(DailyTravel).all()
    db.close()

    regions = {}
    for r in rows:
        region_code = get_region_code_from_country(r.to_country)
        if region_code not in regions:
            regions[region_code] = {
                "region_code": region_code,
                "total_count": 0,
                "active_count": 0,
                "vip_count": 0,
                "active_vip_count": 0,
                "cities": {}
            }

        regions[region_code]["total_count"] += 1
        if r.active_now:
            regions[region_code]["active_count"] += 1

        # ❌ PROBLEM: you probably missed this block
        if r.is_vip:
            regions[region_code]["vip_count"] += 1
            if r.active_now:
                regions[region_code]["active_vip_count"] += 1