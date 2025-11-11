http://127.0.0.1:8000/daily_sheet/data
Internal Server Error

Traceback (most recent call last):
  File "C:\Users\W0024618\Desktop\swipeData\Travel-Backend\.venv\Lib\site-packages\sqlalchemy\engine\base.py", line 1967, in _exec_single_context
    self.dialect.do_execute(
    ~~~~~~~~~~~~~~~~~~~~~~~^
        cursor, str_statement, effective_parameters, context
        ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
    )
    ^
  File "C:\Users\W0024618\Desktop\swipeData\Travel-Backend\.venv\Lib\site-packages\sqlalchemy\engine\default.py", line 951, in do_execute
    cursor.execute(statement, parameters)
    ~~~~~~~~~~~~~~^^^^^^^^^^^^^^^^^^^^^^^
sqlite3.OperationalError: no such column: daily_travel.from_country

The above exception was the direct cause of the following exception:

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
  File "C:\Users\W0024618\Desktop\swipeData\Travel-Backend\.venv\Lib\site-packages\starlette\middleware\cors.py", line 85, in __call__
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
  File "C:\Users\W0024618\Desktop\swipeData\Travel-Backend\.venv\Lib\site-packages\fastapi\routing.py", line 390, in app
    raw_response = await run_endpoint_function(
                   ^^^^^^^^^^^^^^^^^^^^^^^^^^^^
    ...<3 lines>...
    )
    ^
  File "C:\Users\W0024618\Desktop\swipeData\Travel-Backend\.venv\Lib\site-packages\fastapi\routing.py", line 291, in run_endpoint_function
    return await run_in_threadpool(dependant.call, **values)
           ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
  File "C:\Users\W0024618\Desktop\swipeData\Travel-Backend\.venv\Lib\site-packages\starlette\concurrency.py", line 38, in run_in_threadpool
    return await anyio.to_thread.run_sync(func)
           ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
  File "C:\Users\W0024618\Desktop\swipeData\Travel-Backend\.venv\Lib\site-packages\anyio\to_thread.py", line 56, in run_sync
    return await get_async_backend().run_sync_in_worker_thread(
           ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
        func, args, abandon_on_cancel=abandon_on_cancel, limiter=limiter
        ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
    )
    ^
  File "C:\Users\W0024618\Desktop\swipeData\Travel-Backend\.venv\Lib\site-packages\anyio\_backends\_asyncio.py", line 2485, in run_sync_in_worker_thread
    return await future
           ^^^^^^^^^^^^
  File "C:\Users\W0024618\Desktop\swipeData\Travel-Backend\.venv\Lib\site-packages\anyio\_backends\_asyncio.py", line 976, in run
    result = context.run(func, *args)
  File "C:\Users\W0024618\Desktop\swipeData\Travel-Backend\daily_sheet.py", line 478, in get_previous_data
    rows = db.query(DailyTravel).order_by(DailyTravel.id.asc()).all()
  File "C:\Users\W0024618\Desktop\swipeData\Travel-Backend\.venv\Lib\site-packages\sqlalchemy\orm\query.py", line 2704, in all
    return self._iter().all()  # type: ignore
           ~~~~~~~~~~^^
  File "C:\Users\W0024618\Desktop\swipeData\Travel-Backend\.venv\Lib\site-packages\sqlalchemy\orm\query.py", line 2857, in _iter
    result: Union[ScalarResult[_T], Result[_T]] = self.session.execute(
                                                  ~~~~~~~~~~~~~~~~~~~~^
        statement,
        ^^^^^^^^^^
        params,
        ^^^^^^^
        execution_options={"_sa_orm_load_options": self.load_options},
        ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
    )
    ^
  File "C:\Users\W0024618\Desktop\swipeData\Travel-Backend\.venv\Lib\site-packages\sqlalchemy\orm\session.py", line 2351, in execute
    return self._execute_internal(
           ~~~~~~~~~~~~~~~~~~~~~~^
        statement,
        ^^^^^^^^^^
    ...<4 lines>...
        _add_event=_add_event,
        ^^^^^^^^^^^^^^^^^^^^^^
    )
    ^
  File "C:\Users\W0024618\Desktop\swipeData\Travel-Backend\.venv\Lib\site-packages\sqlalchemy\orm\session.py", line 2249, in _execute_internal
    result: Result[Any] = compile_state_cls.orm_execute_statement(
                          ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~^
        self,
        ^^^^^
    ...<4 lines>...
        conn,
        ^^^^^
    )
    ^
  File "C:\Users\W0024618\Desktop\swipeData\Travel-Backend\.venv\Lib\site-packages\sqlalchemy\orm\context.py", line 306, in orm_execute_statement
    result = conn.execute(
        statement, params or {}, execution_options=execution_options
    )
  File "C:\Users\W0024618\Desktop\swipeData\Travel-Backend\.venv\Lib\site-packages\sqlalchemy\engine\base.py", line 1419, in execute
    return meth(
        self,
        distilled_parameters,
        execution_options or NO_OPTIONS,
    )
  File "C:\Users\W0024618\Desktop\swipeData\Travel-Backend\.venv\Lib\site-packages\sqlalchemy\sql\elements.py", line 526, in _execute_on_connection
    return connection._execute_clauseelement(
           ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~^
        self, distilled_params, execution_options
        ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
    )
    ^
  File "C:\Users\W0024618\Desktop\swipeData\Travel-Backend\.venv\Lib\site-packages\sqlalchemy\engine\base.py", line 1641, in _execute_clauseelement
    ret = self._execute_context(
        dialect,
    ...<8 lines>...
        cache_hit=cache_hit,
    )
  File "C:\Users\W0024618\Desktop\swipeData\Travel-Backend\.venv\Lib\site-packages\sqlalchemy\engine\base.py", line 1846, in _execute_context
    return self._exec_single_context(
           ~~~~~~~~~~~~~~~~~~~~~~~~~^
        dialect, context, statement, parameters
        ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
    )
    ^
  File "C:\Users\W0024618\Desktop\swipeData\Travel-Backend\.venv\Lib\site-packages\sqlalchemy\engine\base.py", line 1986, in _exec_single_context
    self._handle_dbapi_exception(
    ~~~~~~~~~~~~~~~~~~~~~~~~~~~~^
        e, str_statement, effective_parameters, cursor, context
        ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
    )
    ^
  File "C:\Users\W0024618\Desktop\swipeData\Travel-Backend\.venv\Lib\site-packages\sqlalchemy\engine\base.py", line 2355, in _handle_dbapi_exception
    raise sqlalchemy_exception.with_traceback(exc_info[2]) from e
  File "C:\Users\W0024618\Desktop\swipeData\Travel-Backend\.venv\Lib\site-packages\sqlalchemy\engine\base.py", line 1967, in _exec_single_context
    self.dialect.do_execute(
    ~~~~~~~~~~~~~~~~~~~~~~~^
        cursor, str_statement, effective_parameters, context
        ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
    )
    ^
  File "C:\Users\W0024618\Desktop\swipeData\Travel-Backend\.venv\Lib\site-packages\sqlalchemy\engine\default.py", line 951, in do_execute
    cursor.execute(statement, parameters)
    ~~~~~~~~~~~~~~^^^^^^^^^^^^^^^^^^^^^^^
sqlalchemy.exc.OperationalError: (sqlite3.OperationalError) no such column: daily_travel.from_country
[SQL: SELECT daily_travel.id AS daily_travel_id, daily_travel.emp_id AS daily_travel_emp_id, daily_travel.first_name AS daily_travel_first_name, daily_travel.last_name AS daily_travel_last_name, daily_travel.email AS daily_travel_email, daily_travel.from_location AS daily_travel_from_location, daily_travel.from_country AS daily_travel_from_country, daily_travel.to_location AS daily_travel_to_location, daily_travel.to_country AS daily_travel_to_country, daily_travel.begin_date AS daily_travel_begin_date, daily_travel.end_date AS daily_travel_end_date, daily_travel.leg_type AS daily_travel_leg_type, daily_travel.active_now AS daily_travel_active_now, daily_travel.is_vip AS daily_travel_is_vip, daily_travel.matched_employee_id AS daily_travel_matched_employee_id, daily_travel.matched_employee_name AS daily_travel_matched_employee_name, daily_travel.match_reason AS daily_travel_match_reason, daily_travel.uploaded_at AS daily_travel_uploaded_at
FROM daily_travel ORDER BY daily_travel.id ASC]
(Background on this error at: https://sqlalche.me/e/20/e3q8)

# daily_sheet.py
from fastapi import APIRouter, File, UploadFile, HTTPException
from fastapi.responses import JSONResponse
from sqlalchemy import Column, Integer, String
from io import BytesIO, StringIO
import pandas as pd
import numpy as np
from datetime import datetime
from dateutil import parser as date_parser
import re, zoneinfo, logging
from typing import Optional
import math
# Import DB Base/engine/SessionLocal and Employee model + VIP_LEVELS from monthly_sheet
# Make sure monthly_sheet exports: Base, engine, SessionLocal, Employee, VIP_LEVELS
from monthly_sheet import Base, engine, SessionLocal, Employee, VIP_LEVELS


logger = logging.getLogger("uvicorn.error")

router = APIRouter(prefix="/daily_sheet", tags=["daily_sheet"])

# Use same server timezone as main.py
SERVER_TZ = zoneinfo.ZoneInfo("Asia/Kolkata")




class DailyTravel(Base):
    __tablename__ = "daily_travel"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    emp_id = Column(String, index=True, nullable=True)
    first_name = Column(String, nullable=True)
    last_name = Column(String, nullable=True)
    email = Column(String, nullable=True)
    from_location = Column(String, nullable=True)
    from_country = Column(String, nullable=True)   # ✅ add this
    to_location = Column(String, nullable=True)
    to_country = Column(String, nullable=True)     # ✅ add this
    begin_date = Column(String, nullable=True)
    end_date = Column(String, nullable=True)
    leg_type = Column(String, nullable=True)
    active_now = Column(Integer, default=0)
    is_vip = Column(Integer, default=0)
    matched_employee_id = Column(String, nullable=True)
    matched_employee_name = Column(String, nullable=True)
    match_reason = Column(String, nullable=True)
    uploaded_at = Column(String, nullable=True)


# Ensure tables exist
Base.metadata.create_all(bind=engine)





def normalize_and_parse(dt_val):
    """Parse a variety of date strings into timezone-aware local datetimes (no UTC shift)."""
    if pd.isna(dt_val) or dt_val is None:
        return None
    s = str(dt_val).strip()
    s = re.sub(r"(\d{1,2})\.(\d{1,2})(?!\d)", r"\1:\2", s)
    try:
        dt = date_parser.parse(s, dayfirst=False)
        if dt.tzinfo is None:
            dt = dt.replace(tzinfo=SERVER_TZ)  # stay in server tz (Asia/Kolkata)
        # ❌ don’t convert to UTC
        return dt
    except Exception:
        return None
    



def read_any_format(content: bytes, filename: str) -> pd.DataFrame:
    """
    Robust reader: detects header row (CSV/Excel), normalizes to canonical columns.
    Returns DataFrame with columns:
      "AGENCY ID","AGENCY NAME","LAST NAME","FIRST NAME","TRAVELER",
      "EMP ID","EMAIL","PNR","LEG TYPE","BEGIN DATE","FROM LOCATION",
      "FROM COUNTRY","END DATE","TO LOCATION","TO COUNTRY"
    """
    EXPECTED_COLS = [
        "AGENCY ID","AGENCY NAME","LAST NAME","FIRST NAME","TRAVELER",
        "EMP ID","EMAIL","PNR","LEG TYPE","BEGIN DATE","FROM LOCATION",
        "FROM COUNTRY","END DATE","TO LOCATION","TO COUNTRY"
    ]

    # CSV path
    if filename.lower().endswith(".csv"):
        text = content.decode(errors="ignore").splitlines()
        header_row = None
        for i, line in enumerate(text[:50]):
            if any(h.lower() in line.lower() for h in EXPECTED_COLS):
                header_row = i
                break
        if header_row is None:
            raise ValueError("Header row not found in CSV file")
        df = pd.read_csv(StringIO("\n".join(text)), skiprows=header_row)
    else:
        # Excel path: scan first 50 rows to find header row
        bio = BytesIO(content)
        preview = pd.read_excel(bio, header=None, nrows=50)
        header_row = None
        for i in range(len(preview)):
            joined = " ".join(str(v).strip().lower() for v in preview.iloc[i].values if pd.notna(v))
            if any(h.lower() in joined for h in EXPECTED_COLS):
                header_row = i
                break
        if header_row is None:
            raise ValueError("Header row not found in Excel file")
        bio.seek(0)
        df = pd.read_excel(bio, header=header_row)

    # normalize headers
    df.columns = [str(c).strip().upper() for c in df.columns]

    # ensure expected columns exist
    for col in EXPECTED_COLS:
        if col not in df.columns:
            df[col] = None

    # keep canonical order
    df = df[EXPECTED_COLS]

    # drop blank rows and known footers
    def looks_like_footer(row):
        s = " ".join(str(v).lower() for v in row if pd.notna(v))
        return bool(re.search(r"copyright|all rights reserved|gardaworld|utc", s))

    df = df.dropna(how="all")
    df = df[~df.apply(looks_like_footer, axis=1)]

    return df


# ---------------------------
# In-memory cache (parity with main.py)
# ---------------------------
previous_data = {
    "summary": None,
    "items": None,
    "last_updated": None,
    "regions_summary": None
}


def clean_nans(obj):
    """Recursively replace NaN/inf with None in dicts/lists."""
    if isinstance(obj, dict):
        return {k: clean_nans(v) for k, v in obj.items()}
    elif isinstance(obj, list):
        return [clean_nans(v) for v in obj]
    elif isinstance(obj, float):
        if math.isnan(obj) or math.isinf(obj):
            return None
        return obj
    else:
        return obj

# summary = clean_nans(summary)
# items = clean_nans(items)

# ---------------------------
# Upload endpoint (stores DB and previous_data)
# ---------------------------
@router.post("/upload")
async def upload(file: UploadFile = File(...)):
    """
    Upload daily travel Excel/CSV.
    - Detects header row robustly
    - Parses/normalizes dates
    - Saves records into `daily_travel` (replacing previous daily_travel rows)
    - Attempts to match each row to monthly employees (emp_id -> email -> name)
    - Updates previous_data cache
    """
    if not file.filename.lower().endswith((".xlsx", ".xls", ".csv")):
        raise HTTPException(status_code=400, detail="Please upload a valid Excel or CSV file.")

    content = await file.read()

    try:
        df = read_any_format(content, file.filename)
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Error reading file: {e}")

    # normalize columns to uppercase (already done in read_any_format)
    # Parse dates
    df['BEGIN_DT'] = df['BEGIN DATE'].apply(normalize_and_parse)
    df['END_DT'] = df['END DATE'].apply(normalize_and_parse)

    now_local = datetime.now(tz=SERVER_TZ)
    now_utc = now_local.astimezone(zoneinfo.ZoneInfo('UTC'))

    def is_active_row(row):
        b, e = row['BEGIN_DT'], row['END_DT']
        return bool(b and e and b <= now_utc <= e)

    df['active_now'] = df.apply(is_active_row, axis=1)

    # Remove blank/footer rows (again) and keep rows with some identifying info
    original_count = len(df)
    def is_footer_row(row):
        combined = " ".join(str(v) for v in row.values if v is not None).lower()
        patterns = [r"copyright", r"all rights reserved", r"gardaworld", r"utc", r"\b\d{1,2}-[a-z]{3}-\d{4}\b"]
        return any(re.search(p, combined) for p in patterns)

    df = df.dropna(how="all")
    df = df[~df.apply(is_footer_row, axis=1)]
    df = df[
        df["FIRST NAME"].notna() |
        df["LAST NAME"].notna() |
        df["EMAIL"].notna()
    ]
    removed_rows = original_count - len(df)

    # Build employee lookup maps from monthly_sheet DB
    db = SessionLocal()
    try:
        employees = db.query(Employee).all()
    except Exception as e:
        logger.exception("Failed to load monthly employees: %s", e)
        employees = []
    by_empid = {}
    by_email = {}
    by_name = {}
    for emp in employees:
        eid = (getattr(emp, "employee_id", "") or "").strip()
        em = (getattr(emp, "employee_email", "") or "").strip().lower()
        fn = (getattr(emp, "first_name", "") or "").strip().lower()
        ln = (getattr(emp, "last_name", "") or "").strip().lower()
        if eid:
            by_empid[eid] = emp
        if em:
            by_email[em] = emp
        if fn or ln:
            k = f"{fn} {ln}".strip()
            if k:
                if k not in by_name:
                    by_name[k] = emp

    # Replace existing daily_travel rows
    try:
        db.query(DailyTravel).delete()
        db.commit()
    except Exception as e:
        db.rollback()
        logger.exception("Failed to clear previous daily_travel: %s", e)

    rows_added = 0
    upload_time = datetime.now().strftime("%Y-%m-%d %H:%M:%S")

    for idx, row in df.iterrows():
        emp_id = str(row.get('EMP ID') or "").strip()
        first_name = (str(row.get('FIRST NAME') or "").strip()) if 'FIRST NAME' in df.columns else ""
        last_name = (str(row.get('LAST NAME') or "").strip()) if 'LAST NAME' in df.columns else ""
        email = (str(row.get('EMAIL') or "").strip().lower()) if 'EMAIL' in df.columns else None
        from_location = row.get('FROM LOCATION') if 'FROM LOCATION' in df.columns else None
        to_location = row.get('TO LOCATION') if 'TO LOCATION' in df.columns else None
        begin_dt_obj = row.get('BEGIN_DT') if 'BEGIN_DT' in df.columns else None
        end_dt_obj = row.get('END_DT') if 'END_DT' in df.columns else None
        begin_date_iso = begin_dt_obj.isoformat() if begin_dt_obj is not None else None
        end_date_iso = end_dt_obj.isoformat() if end_dt_obj is not None else None
        leg_type = row.get('LEG TYPE') if 'LEG TYPE' in df.columns else None
        active_flag = 1 if bool(row.get('active_now')) else 0
        

        # matching priority
        matched_emp = None
        match_reason = None
        if emp_id and emp_id in by_empid:
            matched_emp = by_empid[emp_id]
            match_reason = "emp_id"
        elif email and email in by_email:
            matched_emp = by_email[email]
            match_reason = "email"
        else:
            name_key = f"{(first_name or '').strip().lower()} {(last_name or '').strip().lower()}".strip()
            if name_key and name_key in by_name:
                matched_emp = by_name[name_key]
                match_reason = "name"

        is_vip = 0
        matched_employee_id = None
        matched_employee_name = None
        if matched_emp:
            matched_employee_id = getattr(matched_emp, "employee_id", None)
            matched_employee_name = getattr(matched_emp, "full_name", None) or f"{getattr(matched_emp,'first_name','')} {getattr(matched_emp,'last_name','')}".strip()
            mgmt_level = getattr(matched_emp, "management_level", None)
            if mgmt_level and mgmt_level in VIP_LEVELS:
                is_vip = 1

        dt = DailyTravel(
            emp_id = emp_id or None,
            first_name = first_name or None,
            last_name = last_name or None,
            email = email or None,
            from_country=from_country,
            to_country=to_country,
            from_location = from_location,
            to_location = to_location,
            begin_date = begin_date_iso,
            end_date = end_date_iso,
            leg_type = str(leg_type) if leg_type is not None else None,
            active_now = active_flag,
            is_vip = is_vip,
            matched_employee_id = matched_employee_id,
            matched_employee_name = matched_employee_name,
            match_reason = match_reason,
            uploaded_at = upload_time
        )

        try:
            db.add(dt)
            rows_added += 1
        except Exception as e:
            logger.exception("Failed to add DailyTravel row: %s", e)
            db.rollback()

    try:
        db.commit()
    except Exception as e:
        db.rollback()
        logger.exception("Commit failed for daily_travel: %s", e)
    finally:
        db.close()

    # Build previous_data cache (items & summary) like main.py
    items = []
    for i, row in df.iterrows():
        items.append({
            'index': int(i),
            'agency_id': row.get('AGENCY ID'),
            'agency_name': row.get('AGENCY NAME'),
            'first_name': row.get('FIRST NAME'),
            'last_name': row.get('LAST NAME'),
            'emp_id': row.get('EMP ID'),
            'email': row.get('EMAIL'),
            'pnr': row.get('PNR'),
            'leg_type': row.get('LEG TYPE'),
            'begin_dt': row.get('BEGIN_DT').isoformat() if row.get('BEGIN_DT') else None,
            'end_dt': row.get('END_DT').isoformat() if row.get('END_DT') else None,
            'from_location': row.get('FROM LOCATION'),
            'from_country': row.get('FROM COUNTRY'),
            'to_location': row.get('TO LOCATION'),
            'to_country': row.get('TO COUNTRY'),
            'active_now': bool(row.get('active_now')),
        })

    summary = {
        'rows_received': len(df),
        'rows_removed_as_footer_or_empty': removed_rows,
        'rows_with_parse_errors': int(df['BEGIN_DT'].isna().sum() + df['END_DT'].isna().sum()),
        'active_now_count': int(df['active_now'].sum())
    }

    previous_data["summary"] = summary
    previous_data["items"] = items
    previous_data["last_updated"] = datetime.now().isoformat()

    return JSONResponse(content={
        'summary': summary,
        'items': items,
        'message': f'{rows_added} daily travel records saved and cached'
    })



@router.get("/data")
def get_previous_data():
    """
    Return cached or DB-loaded daily travel data with clean emp_id and upload timestamp.
    """
    # ✅ Try using in-memory cache first
    if previous_data.get("items"):
        items = previous_data["items"]
    else:
        # ✅ Fallback: load from DB
        db = SessionLocal()
        rows = db.query(DailyTravel).order_by(DailyTravel.id.asc()).all()
        db.close()
        if not rows:
            raise HTTPException(status_code=404, detail="No travel data found in memory or database.")
        items = [
            {k: v for k, v in r.__dict__.items() if k != "_sa_instance_state"}
            for r in rows
        ]
        previous_data["items"] = items

    # ✅ Clean up emp_id (remove .0)
    for it in items:
        if "emp_id" in it and it["emp_id"] is not None:
            try:
                it["emp_id"] = str(int(float(it["emp_id"])))  # e.g. "308497.0" → "308497"
            except Exception:
                it["emp_id"] = str(it["emp_id"]).strip()

    # ✅ Safely access old summary if available
    old_summary = previous_data.get("summary") or {}

    # ✅ Add summary info
    summary = {
        "rows_received": len(items),
        "rows_removed_as_footer_or_empty": old_summary.get("rows_removed_as_footer_or_empty", 0),
        "rows_with_parse_errors": sum(1 for r in items if not r.get("begin_date") or not r.get("end_date")),
        "active_now_count": sum(1 for r in items if r.get("active_now")),
        "data_upload_time": old_summary.get("data_upload_time")
            or previous_data.get("last_updated")
            or datetime.now().isoformat(),
    }

    # ✅ Update cache metadata
    previous_data["summary"] = summary
    previous_data["last_updated"] = datetime.now().isoformat()

    return JSONResponse(content={
        "summary": summary,
        "items": items,
        "last_updated": previous_data["last_updated"],
        "message": "Loaded daily sheet data from memory or database"
    })


# ---------------------------
# add_traveler endpoint (append to previous_data)
# ---------------------------
from pydantic import BaseModel
class TravelerInput(BaseModel):
    first_name: Optional[str] = None
    last_name: Optional[str] = None
    emp_id: Optional[str] = None
    email: Optional[str] = None
    begin_dt: Optional[str] = None
    end_dt: Optional[str] = None
    from_location: Optional[str] = None
    from_country: Optional[str] = None
    to_location: Optional[str] = None
    to_country: Optional[str] = None
    leg_type: Optional[str] = None
    agency_id: Optional[str] = None
    agency_name: Optional[str] = None
    pnr: Optional[str] = None

@router.post("/add_traveler")
def add_traveler(traveler: TravelerInput):
    now_utc = datetime.now(tz=zoneinfo.ZoneInfo('UTC'))
    begin_dt = normalize_and_parse(traveler.begin_dt) if traveler.begin_dt else None
    end_dt = normalize_and_parse(traveler.end_dt) if traveler.end_dt else None
    active_now = bool(begin_dt and end_dt and begin_dt <= now_utc <= end_dt)

    new_item = {
        'index': len(previous_data["items"]) + 1 if previous_data["items"] else 1,
        'agency_id': traveler.agency_id,
        'agency_name': traveler.agency_name,
        'first_name': traveler.first_name,
        'last_name': traveler.last_name,
        'emp_id': traveler.emp_id,
        'email': traveler.email,
        'pnr': traveler.pnr,
        'leg_type': traveler.leg_type,
        'begin_dt': begin_dt.isoformat() if begin_dt else None,
        'end_dt': end_dt.isoformat() if end_dt else None,
        'from_location': traveler.from_location,
        'from_country': traveler.from_country,
        'to_location': traveler.to_location,
        'to_country': traveler.to_country,
        'active_now': active_now
    }

    if previous_data["items"] is None:
        previous_data["items"] = []
    previous_data["items"].append(new_item)

    items = previous_data["items"]
    summary = {
        'rows_received': len(items),
        'rows_removed_as_footer_or_empty': previous_data["summary"].get("rows_removed_as_footer_or_empty", 0) if previous_data["summary"] else 0,
        'rows_with_parse_errors': sum(1 for r in items if not r["begin_dt"] or not r["end_dt"]),
        'active_now_count': sum(1 for r in items if r["active_now"]),
    }

    previous_data["summary"] = summary
    previous_data["last_updated"] = datetime.now().isoformat()

    return JSONResponse(content={
        "message": "Traveler added successfully",
        "summary": summary,
        "items": items
    })


# ---------------------------
# DB-backed records endpoints (parity with earlier daily_sheet)
# ---------------------------
@router.get("/records")
def get_daily_records(limit: int = 1000, offset: int = 0, only_active: Optional[int] = None):
    db = SessionLocal()
    q = db.query(DailyTravel)
    if only_active is not None:
        q = q.filter(DailyTravel.active_now == (1 if only_active else 0))
    total = q.count()
    rows = q.order_by(DailyTravel.id.asc()).offset(offset).limit(limit).all()
    db.close()
    items = [{k: v for k, v in r.__dict__.items() if k != "_sa_instance_state"} for r in rows]
    return JSONResponse(content={"count": total, "items": items})


@router.get("/records/{record_id}")
def get_daily_record(record_id: int):
    db = SessionLocal()
    r = db.query(DailyTravel).filter(DailyTravel.id == record_id).first()
    db.close()
    if not r:
        raise HTTPException(status_code=404, detail="Daily record not found")
    return JSONResponse(content={k: v for k, v in r.__dict__.items() if k != "_sa_instance_state"})


@router.delete("/clear")
def clear_daily_data():
    db = SessionLocal()
    try:
        n = db.query(DailyTravel).count()
        db.query(DailyTravel).delete()
        db.commit()
        # also clear cache
        previous_data["items"] = None
        previous_data["summary"] = None
        previous_data["regions_summary"] = None
        previous_data["last_updated"] = None
        return JSONResponse(content={"message": f"Cleared {n} daily travel records."})
    except Exception as e:
        db.rollback()
        logger.exception("Failed clearing daily_travel: %s", e)
        raise HTTPException(status_code=500, detail="Failed to clear daily data")
    finally:
        db.close()

