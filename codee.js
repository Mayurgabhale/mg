http://127.0.0.1:8000/daily_sheet/regions

in denver "total_count": 33, but show only this i wan to sho all 
 "NAMER": {
      "region_code": "NAMER",
      "total_count": 93,
      "active_count": 65,
      "vip_count": 64,
      "active_vip_count": 42,
      "cities": {
        "Denver": {
          "city_name": "Denver",
          "total_count": 33,
          "active_count": 28,
          "vip_count": 27,
          "active_vip_count": 23,
          "sample_items": [
            {
              "first_name": "KAROLIS",
              "last_name": "KEVALAS",
              "email": "308257@westernunion.com",
              "pnr": null,
              "active_now": 1,
              "is_vip": false,
              "begin_dt": null,
              "end_dt": null
            },
            {
              "first_name": "KAROLIS",
              "last_name": "KEVALAS",
              "email": "308257@westernunion.com",
              "pnr": null,
              "active_now": 1,
              "is_vip": false,
              "begin_dt": null,
              "end_dt": null
            },
            {
              "first_name": "KAROLIS",
              "last_name": "KEVALAS",
              "email": "nan",
              "pnr": null,
              "active_now": 1,
              "is_vip": false,
              "begin_dt": null,
              "end_dt": null
            },
            {
              "first_name": "KAROLIS",
              "last_name": "KEVALAS",
              "email": "nan",
              "pnr": null,
              "active_now": 1,
              "is_vip": false,
              "begin_dt": null,
              "end_dt": null
            },
            {
              "first_name": "FRANCISCO JAVIER",
              "last_name": "PEREZ ROMERO",
              "email": "javier.perez@westernunion.com",
              "pnr": null,
              "active_now": 1,
              "is_vip": false,
              "begin_dt": null,
              "end_dt": null
            },
            {
              "first_name": "TYLER",
              "last_name": "BROWN",
              "email": "tyler.brown@wu.com",
              "pnr": null,
              "active_now": 1,
              "is_vip": true,
              "begin_dt": null,
              "end_dt": null
            },
            {
              "first_name": "SHARI",
              "last_name": "GALE",
              "email": "shari.gale@westernunion.com",
              "pnr": null,
              "active_now": 1,
              "is_vip": true,
              "begin_dt": null,
              "end_dt": null
            },
            {
              "first_name": "CARL",
              "last_name": "PIERCE",
              "email": "carl.pierce@westernunion.com",
              "pnr": null,
              "active_now": 1,
              "is_vip": true,
              "begin_dt": null,
              "end_dt": null
            },
            {
              "first_name": "GIOVANNI",
              "last_name": "NAJERA",
              "email": "giovanni.najera@westernunion.com",
              "pnr": null,
              "active_now": 1,
              "is_vip": true,
              "begin_dt": null,
              "end_dt": null
            },
            {
              "first_name": "GIOVANNI",
              "last_name": "NAJERA",
              "email": "giovanni.najera@westernunion.com",
              "pnr": null,
              "active_now": 1,
              "is_vip": true,
              "begin_dt": null,
              "end_dt": null
            }
          ]
        },
        "Newark": {
          "city_name": "Newark",
          "total_count": 13,
          "active_count": 5,
          "vip_count": 13,
          "active_vip_count": 5,
          "sample_items": [
            {
              "first_name": "CONNER",
              "last_name": "DANIEL",
              "email": "conner.daniel@westernunion.com",
              "pnr": null,
              "active_now": 0,
              "is_vip": true,


              

def build_regions_summary(items: list) -> dict:
    """Group all items by region → city, with totals."""
    regions = {}
    for it in items:
        country = (it.get('to_country') or it.get('from_country') or "").strip()
        location = (it.get('to_location') or it.get('from_location') or "").strip()
        region = resolve_region(country, location)
        city = normalize_city(location) or "Unknown"

        if region not in regions:
            regions[region] = {
                "region_code": region,
                "total_count": 0,
                "active_count": 0,
                "vip_count": 0,
                "active_vip_count": 0,
                "cities": {}
            }

        # --- Region-level totals ---
        reg = regions[region]
        reg["total_count"] += 1
        if it.get("active_now"):
            reg["active_count"] += 1
        if it.get("is_vip"):
            reg["vip_count"] += 1
        if it.get("active_now") and it.get("is_vip"):
            reg["active_vip_count"] += 1

        # --- City-level totals ---
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
        if it.get("active_now"):
            cty["active_count"] += 1
        if it.get("is_vip"):
            cty["vip_count"] += 1
        if it.get("active_now") and it.get("is_vip"):
            cty["active_vip_count"] += 1

        if len(cty["sample_items"]) < 10:
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

    # sort cities by count
    for reg_data in regions.values():
        reg_data["cities"] = dict(sorted(reg_data["cities"].items(),
                                         key=lambda kv: -kv[1]["total_count"]))
    return regions


# ----------------------------------------------------------
# 🚀 FastAPI endpoints
# ----------------------------------------------------------

@router.get("/regions")
def get_regions():
    """
    Return regional travel summary grouped by region (APAC, EMEA, NAMER, LACA, UNKNOWN).
    Uses memory cache if available, else loads from DB.
    """
    # 1️⃣ From memory
    if previous_data.get("items"):
        items = previous_data["items"]
    else:
        # 2️⃣ Fallback to DB
        db = SessionLocal()
        rows = db.query(DailyTravel).all()
        db.close()
        if not rows:
            raise HTTPException(status_code=404, detail="No travel data available in memory or database.")
        items = [{k: v for k, v in r.__dict__.items() if k != "_sa_instance_state"} for r in rows]
        previous_data["items"] = items

    # 3️⃣ Use new resolver-based region builder
    regions = build_regions_summary(items)

    # 4️⃣ Cache + timestamp
    previous_data["regions_summary"] = regions
    previous_data["last_updated"] = datetime.now().isoformat()

    # 5️⃣ Response
    return JSONResponse(content={
        "regions": regions,
        "last_updated": previous_data["last_updated"],
        "message": "Loaded region summary from memory or database"
    })


@router.get("/regions/{region_code}")
async def get_region(region_code: str):
    """Get details for a specific region."""
    regions = previous_data.get("regions_summary")
    if not regions:
        raise HTTPException(status_code=404, detail="Region summary not yet generated.")
    region_code = region_code.upper()
    region_data = regions.get(region_code)
    if not region_data:
        raise HTTPException(status_code=404, detail=f"Region {region_code} not found.")
    return JSONResponse(content=region_data)
