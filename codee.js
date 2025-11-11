@router.get("/regions")
def get_regions():
    """
    Return regional travel summary grouped by 'from_country' or 'to_country'.
    Uses in-memory cache if available, else loads from DB.
    """

    # 1️⃣ Use memory if cache is filled
    if previous_data.get("items"):
        items = previous_data["items"]
    else:
        # 2️⃣ Fallback to DB
        db = SessionLocal()
        rows = db.query(DailyTravel).all()
        db.close()
        if not rows:
            raise HTTPException(status_code=404, detail="No travel data available in memory or database.")
        items = [
            {k: v for k, v in r.__dict__.items() if k != "_sa_instance_state"}
            for r in rows
        ]
        previous_data["items"] = items

    # 3️⃣ Build region summary
    regions = {}
    for item in items:
        # Use TO COUNTRY → fallback to FROM COUNTRY
        region_key = (item.get("to_country") or item.get("from_country") or "UNKNOWN").upper()

        if region_key not in regions:
            regions[region_key] = {
                "region_code": region_key,
                "total_count": 0,
                "active_count": 0,
                "cities": {}
            }

        regions[region_key]["total_count"] += 1
        if item.get("active_now"):
            regions[region_key]["active_count"] += 1

        city = (item.get("to_location") or item.get("from_location") or "UNKNOWN").title()
        if city not in regions[region_key]["cities"]:
            regions[region_key]["cities"][city] = {"count": 0, "active": 0}
        regions[region_key]["cities"][city]["count"] += 1
        if item.get("active_now"):
            regions[region_key]["cities"][city]["active"] += 1

    # 4️⃣ Cache the summary
    previous_data["regions_summary"] = regions
    previous_data["last_updated"] = datetime.now().isoformat()

    # 5️⃣ Return response
    return JSONResponse(content={
        "regions": regions,
        "last_updated": previous_data["last_updated"],
        "message": "Loaded region summary from memory or database"
    })