import io

@app.post("/upload")
async def upload_excel(file: UploadFile = File(None)):
    global previous_data

    if file is None:
        if previous_data["items"] is not None:
            return JSONResponse(content={
                "summary": previous_data["summary"],
                "items": previous_data["items"],
                "message": "Returned previously uploaded data (no new file uploaded)"
            })
        else:
            raise HTTPException(status_code=400, detail="No file uploaded and no previous data found.")

    if not file.filename.lower().endswith((".xlsx", ".xls", ".csv")):
        raise HTTPException(status_code=400, detail="Unsupported file type")

    content = await file.read()
    file_stream = BytesIO(content)

    # 🔍 Expected canonical headers
    expected_headers = [
        "AGENCY ID","AGENCY NAME","LAST NAME","FIRST NAME","TRAVELER",
        "EMP ID","EMAIL","PNR","LEG TYPE","BEGIN DATE","FROM LOCATION",
        "FROM COUNTRY","END DATE","TO LOCATION","TO COUNTRY"
    ]

    # --- STEP 1: Find header row dynamically ---
    if file.filename.lower().endswith(".csv"):
        text = content.decode(errors="ignore").splitlines()
        header_row_idx = None
        for i, line in enumerate(text[:30]):  # check first 30 lines
            for h in expected_headers:
                if h.lower() in line.lower():
                    header_row_idx = i
                    break
            if header_row_idx is not None:
                break

        if header_row_idx is None:
            raise HTTPException(status_code=400, detail="No valid header row found in CSV.")

        df = pd.read_csv(io.StringIO("\n".join(text)), skiprows=header_row_idx)
    else:
        # Excel — read first 30 rows to find header
        preview = pd.read_excel(file_stream, header=None, nrows=30)
        header_row_idx = None
        for i in range(len(preview)):
            row_values = " ".join(str(v).strip().lower() for v in preview.iloc[i].values if pd.notna(v))
            if any(h.lower() in row_values for h in expected_headers):
                header_row_idx = i
                break

        if header_row_idx is None:
            raise HTTPException(status_code=400, detail="No valid header row found in Excel.")

        # re-read from detected header row
        file_stream.seek(0)
        df = pd.read_excel(file_stream, header=header_row_idx)

    # --- STEP 2: Normalize column names ---
    df.columns = [str(c).strip() for c in df.columns]