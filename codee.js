@router.get("/data")
def get_previous_data():
    # ✅ if cache is populated, return from memory
    if previous_data["items"] is not None:
        return JSONResponse(content={
            "summary": previous_data["summary"],
            "items": previous_data["items"],
            "last_updated": previous_data.get("last_updated"),
            "message": "Loaded saved data from memory"
        })

    # ✅ fallback: load from DB
    db = SessionLocal()
    rows = db.query(DailyTravel).order_by(DailyTravel.id.asc()).all()
    db.close()

    if not rows:
        raise HTTPException(status_code=404, detail="No previously uploaded data found in memory or database.")

    # convert DB objects to dicts
    items = [{k: v for k, v in r.__dict__.items() if k != "_sa_instance_state"} for r in rows]

    summary = {
        "rows_received": len(items),
        "rows_removed_as_footer_or_empty": 0,
        "rows_with_parse_errors": sum(1 for r in items if not r["begin_date"] or not r["end_date"]),
        "active_now_count": sum(1 for r in items if r["active_now"]),
    }

    # repopulate in-memory cache
    previous_data["items"] = items
    previous_data["summary"] = summary
    previous_data["last_updated"] = datetime.now().isoformat()

    return JSONResponse(content={
        "summary": summary,
        "items": items,
        "last_updated": previous_data["last_updated"],
        "message": "Loaded saved data from database and cached in memory"
    })