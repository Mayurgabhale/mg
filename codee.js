@app.get("/data")
async def get_previous_data():
    """Return previously uploaded data if available."""
    if previous_data["items"] is not None:
        return JSONResponse(content={
            "summary": previous_data["summary"],
            "items": previous_data["items"],
            "message": "Loaded saved data from memory"
        })
    else:
        raise HTTPException(status_code=404, detail="No previously uploaded data found.")