from datetime import datetime

# Inside /upload
previous_data["last_updated"] = datetime.now().isoformat()

# Inside /data
return JSONResponse(content={
    "summary": previous_data["summary"],
    "items": previous_data["items"],
    "last_updated": previous_data.get("last_updated"),
    "message": "Loaded saved data from memory"
})