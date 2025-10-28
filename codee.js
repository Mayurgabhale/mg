Upload failed. Please check the backend server or file format.
(.venv) PS C:\Users\W0024618\Desktop\swipeData\Travel-Backend> uvicorn main:app --reload --port 8000
INFO:     Will watch for changes in these directories: ['C:\\Users\\W0024618\\Desktop\\swipeData\\Travel-Backend']
INFO:     Uvicorn running on http://127.0.0.1:8000 (Press CTRL+C to quit)
INFO:     Started reloader process [21980] using StatReload
INFO:     Started server process [10756]
INFO:     Waiting for application startup.
INFO:     Application startup complete.
INFO:     127.0.0.1:55858 - "GET / HTTP/1.1" 404 Not Found
INFO:     127.0.0.1:55858 - "GET / HTTP/1.1" 404 Not Found
INFO:     127.0.0.1:54769 - "POST /upload HTTP/1.1" 500 Internal Server Error
ERROR:    Exception in ASGI application
Traceback (most recent call last):
  File "C:\Users\W0024618\Desktop\swipeData\Travel-Backend\.venv\Lib\site-packages\uvicorn\protocols\http\h11_impl.py", line 403, in run_asgi
    result = await app(  # type: ignore[func-returns-value]
             ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
        self.scope, self.receive, self.send
        ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
    )
    ^
  File "C:\Users\W0024618\Desktop\swipeData\Travel-Backend\.venv\Lib\site-packages\uvicorn\middleware\proxy_headers.py", line 60, in __call__
    return await self.app(scope, receive, send)
           ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
  File "C:\Users\W0024618\Desktop\swipeData\Travel-Backend\.venv\Lib\site-packages\fastapi\applications.py", line 1134, in __call__
    await super().__call__(scope, receive, send)
  File "C:\Users\W0024618\Desktop\swipeData\Travel-Backend\.venv\Lib\site-packages\starlette\applications.py", line 113, in __call__
    await self.middleware_stack(scope, receive, send)
  File "C:\Users\W0024618\Desktop\swipeData\Travel-Backend\.venv\Lib\site-packages\starlette\middleware\errors.py", line 186, in __call__
    raise exc
  File "C:\Users\W0024618\Desktop\swipeData\Travel-Backend\.venv\Lib\site-packages\starlette\middleware\errors.py", line 164, in __call__
    await self.app(scope, receive, _send)
  File "C:\Users\W0024618\Desktop\swipeData\Travel-Backend\.venv\Lib\site-packages\starlette\middleware\cors.py", line 93, in __call__
    await self.simple_response(scope, receive, send, request_headers=headers)
  File "C:\Users\W0024618\Desktop\swipeData\Travel-Backend\.venv\Lib\site-packages\starlette\middleware\cors.py", line 144, in simple_response
    await self.app(scope, receive, send)
  File "C:\Users\W0024618\Desktop\swipeData\Travel-Backend\.venv\Lib\site-packages\starlette\middleware\exceptions.py", line 63, in __call__
    await wrap_app_handling_exceptions(self.app, conn)(scope, receive, send)
  File "C:\Users\W0024618\Desktop\swipeData\Travel-Backend\.venv\Lib\site-packages\starlette\_exception_handler.py", line 53, in wrapped_app
    raise exc
  File "C:\Users\W0024618\Desktop\swipeData\Travel-Backend\.venv\Lib\site-packages\starlette\_exception_handler.py", line 42, in wrapped_app
    await app(scope, receive, sender)
  File "C:\Users\W0024618\Desktop\swipeData\Travel-Backend\.venv\Lib\site-packages\fastapi\middleware\asyncexitstack.py", line 18, in __call__
    await self.app(scope, receive, send)
  File "C:\Users\W0024618\Desktop\swipeData\Travel-Backend\.venv\Lib\site-packages\starlette\routing.py", line 716, in __call__
    await self.middleware_stack(scope, receive, send)
  File "C:\Users\W0024618\Desktop\swipeData\Travel-Backend\.venv\Lib\site-packages\starlette\routing.py", line 736, in app
    await route.handle(scope, receive, send)
  File "C:\Users\W0024618\Desktop\swipeData\Travel-Backend\.venv\Lib\site-packages\starlette\routing.py", line 290, in handle
    await self.app(scope, receive, send)
  File "C:\Users\W0024618\Desktop\swipeData\Travel-Backend\.venv\Lib\site-packages\fastapi\routing.py", line 124, in app
    await wrap_app_handling_exceptions(app, request)(scope, receive, send)
  File "C:\Users\W0024618\Desktop\swipeData\Travel-Backend\.venv\Lib\site-packages\starlette\_exception_handler.py", line 53, in wrapped_app
    raise exc
  File "C:\Users\W0024618\Desktop\swipeData\Travel-Backend\.venv\Lib\site-packages\starlette\_exception_handler.py", line 42, in wrapped_app
    await app(scope, receive, sender)
  File "C:\Users\W0024618\Desktop\swipeData\Travel-Backend\.venv\Lib\site-packages\fastapi\routing.py", line 110, in app
    response = await f(request)
               ^^^^^^^^^^^^^^^^
  File "C:\Users\W0024618\Desktop\swipeData\Travel-Backend\.venv\Lib\site-packages\fastapi\routing.py", line 423, in app
    response = actual_response_class(content, **response_args)
  File "C:\Users\W0024618\Desktop\swipeData\Travel-Backend\.venv\Lib\site-packages\starlette\responses.py", line 190, in __init__
    super().__init__(content, status_code, headers, media_type, background)
    ~~~~~~~~~~~~~~~~^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
  File "C:\Users\W0024618\Desktop\swipeData\Travel-Backend\.venv\Lib\site-packages\starlette\responses.py", line 47, in __init__
    self.body = self.render(content)
                ~~~~~~~~~~~^^^^^^^^^
  File "C:\Users\W0024618\Desktop\swipeData\Travel-Backend\.venv\Lib\site-packages\starlette\responses.py", line 193, in render
    return json.dumps(
           ~~~~~~~~~~^
        content,
        ^^^^^^^^
    ...<3 lines>...
        separators=(",", ":"),
        ^^^^^^^^^^^^^^^^^^^^^^
    ).encode("utf-8")
    ^
  File "C:\Program Files\Python313\Lib\json\__init__.py", line 238, in dumps
    **kw).encode(obj)
          ~~~~~~^^^^^
  File "C:\Program Files\Python313\Lib\json\encoder.py", line 200, in encode
    chunks = self.iterencode(o, _one_shot=True)
  File "C:\Program Files\Python313\Lib\json\encoder.py", line 261, in iterencode
    return _iterencode(o, 0)
ValueError: Out of range float values are not JSON compliant: nan



i want errro in toast notification"
from fastapi import FastAPI, File, UploadFile, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import pandas as pd
from io import BytesIO
from dateutil import parser
import re
from datetime import datetime
import zoneinfo

app = FastAPI(title="Employee Travel Dashboard — Parser")

# Allow local dev frontend (adjust origin in production)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Configure server timezone here
SERVER_TZ = zoneinfo.ZoneInfo("Asia/Kolkata")

# Helpful date parser that normalizes "23.00" -> "23:00" etc.
def normalize_and_parse(dt_val):
    if pd.isna(dt_val):
        return None
    s = str(dt_val).strip()
    # convert 23.00 to 23:00
    s = re.sub(r"(\d{1,2})\.(\d{1,2})(?!\d)", r"\1:\2", s)
    try:
        dt = parser.parse(s, dayfirst=False)
        # if naive, attach server timezone then convert to UTC
        if dt.tzinfo is None:
            dt = dt.replace(tzinfo=SERVER_TZ)
        # return ISO UTC
        return dt.astimezone(zoneinfo.ZoneInfo("UTC"))
    except Exception:
        return None


@app.post("/upload")
async def upload_excel(file: UploadFile = File(...)):
    # Accept xlsx/xls
    if not file.filename.lower().endswith((".xlsx", ".xls", ".csv")):
        raise HTTPException(status_code=400, detail="Unsupported file type")

    content = await file.read()
    try:
        if file.filename.lower().endswith(".csv"):
            df = pd.read_csv(BytesIO(content))
        else:
            df = pd.read_excel(BytesIO(content))
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Failed to read spreadsheet: {e}")

    # Expected columns (case-insensitive match)
    expected = [
        "AGENCY ID","AGENCY NAME","LAST NAME","FIRST NAME","TRAVELER",
        "EMP ID","EMAIL","PNR","LEG TYPE","BEGIN DATE","FROM LOCATION","FROM COUNTRY",
        "END DATE","TO LOCATION","TO COUNTRY"
    ]

    # Normalize column names to canonical
    cols_map = {c.lower().strip(): c for c in df.columns}

    # Quick check — attempt to map fields
    def get_col(ci):
        # case-insensitive
        for k,v in cols_map.items():
            if k == ci.lower():
                return v
        # fallback: try contains
        for k,v in cols_map.items():
            if ci.lower() in k:
                return v
        return None

    col_get = {c: get_col(c) for c in expected}

    # Build a cleaned DataFrame with canonical column names (if present)
    clean = {}
    for canon, found in col_get.items():
        clean[canon] = df[found] if found in df.columns else pd.Series([None]*len(df))

    clean_df = pd.DataFrame(clean)

    # Parse dates
    clean_df['BEGIN_DT'] = clean_df['BEGIN DATE'].apply(normalize_and_parse)
    clean_df['END_DT'] = clean_df['END DATE'].apply(normalize_and_parse)

    # Compute active_now (compare against server local time normalized to UTC)
    now_local = datetime.now(tz=SERVER_TZ)
    now_utc = now_local.astimezone(zoneinfo.ZoneInfo('UTC'))

    def is_active(row):
        b = row['BEGIN_DT']
        e = row['END_DT']
        if b is None or e is None:
            return False
        return (b <= now_utc) and (e >= now_utc)

    clean_df['active_now'] = clean_df.apply(is_active, axis=1)

    # Build minimal JSON-serializable response
    def row_to_obj(i, row):
        return {
            'index': int(i),
            'agency_id': row.get('AGENCY ID'),
            'agency_name': row.get('AGENCY NAME'),
            'first_name': row.get('FIRST NAME'),
            'last_name': row.get('LAST NAME'),
            'emp_id': row.get('EMP ID'),
            'email': row.get('EMAIL'),
            'pnr': row.get('PNR'),
            'leg_type': row.get('LEG TYPE'),
            'begin_dt': row.get('BEGIN_DT').isoformat() if row.get('BEGIN_DT') is not None else None,
            'end_dt': row.get('END_DT').isoformat() if row.get('END_DT') is not None else None,
            'from_location': row.get('FROM LOCATION'),
            'from_country': row.get('FROM COUNTRY'),
            'to_location': row.get('TO LOCATION'),
            'to_country': row.get('TO COUNTRY'),
            'active_now': bool(row.get('active_now'))
        }

    items = [row_to_obj(i, r) for i,r in clean_df.iterrows()]

    summary = {
        'rows_received': len(clean_df),
        'rows_with_parse_errors': int(clean_df['BEGIN_DT'].isna().sum() + clean_df['END_DT'].isna().sum()),
        'active_now_count': int(clean_df['active_now'].sum())
    }

    return { 'summary': summary, 'items': items }
