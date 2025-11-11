http://127.0.0.1:8000/daily_sheet/data
Internal Server Error
INFO:     127.0.0.1:54897 - "GET /daily_sheet/data HTTP/1.1" 500 Internal Server Error
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
  File "C:\Users\W0024618\Desktop\swipeData\Travel-Backend\daily_sheet.py", line 450, in get_previous_data
    "rows_removed_as_footer_or_empty": previous_data.get("summary", {}).get("rows_removed_as_footer_or_empty", 0),
                                       ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
AttributeError: 'NoneType' object has no attribute 'get'


# ---------------------------
# @router.get("/data")
# def get_previous_data():
#     # ✅ if cache is populated, return from memory
#     if previous_data["items"] is not None:
#         return JSONResponse(content={
#             "summary": previous_data["summary"],
#             "items": previous_data["items"],
#             "last_updated": previous_data.get("last_updated"),
#             "message": "Loaded saved data from memory"
#         })

#     # ✅ fallback: load from DB
#     db = SessionLocal()
#     rows = db.query(DailyTravel).order_by(DailyTravel.id.asc()).all()
#     db.close()

#     if not rows:
#         raise HTTPException(status_code=404, detail="No previously uploaded data found in memory or database.")

#     # convert DB objects to dicts
#     items = [{k: v for k, v in r.__dict__.items() if k != "_sa_instance_state"} for r in rows]

#     summary = {
#         "rows_received": len(items),
#         "rows_removed_as_footer_or_empty": 0,
#         "rows_with_parse_errors": sum(1 for r in items if not r["begin_date"] or not r["end_date"]),
#         "active_now_count": sum(1 for r in items if r["active_now"]),
#     }

#     # repopulate in-memory cache
#     previous_data["items"] = items
#     previous_data["summary"] = summary
#     previous_data["last_updated"] = datetime.now().isoformat()

#     return JSONResponse(content={
#         "summary": summary,
#         "items": items,
#         "last_updated": previous_data["last_updated"],
#         "message": "Loaded saved data from database and cached in memory"
#     })



check alos commente code ok 

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
                # if numeric-like (e.g. '308497.0'), convert to int then str
                it["emp_id"] = str(int(float(it["emp_id"])))
            except Exception:
                it["emp_id"] = str(it["emp_id"]).strip()

    # ✅ Add summary info
    summary = {
        "rows_received": len(items),
        "rows_removed_as_footer_or_empty": previous_data.get("summary", {}).get("rows_removed_as_footer_or_empty", 0),
        "rows_with_parse_errors": sum(1 for r in items if not r.get("begin_date") or not r.get("end_date")),
        "active_now_count": sum(1 for r in items if r.get("active_now")),
        "data_upload_time": previous_data.get("summary", {}).get("data_upload_time") 
            or previous_data.get("last_updated") 
            or datetime.now().isoformat(),  # ✅ add upload time
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
