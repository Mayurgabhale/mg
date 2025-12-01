(venv) PS C:\Users\W0024618\Desktop\Backend\python-service> uvicorn app:app --reload
INFO:     Will watch for changes in these directories: ['C:\\Users\\W0024618\\Desktop\\Backend\\python-service']
INFO:     Uvicorn running on http://127.0.0.1:8000 (Press CTRL+C to quit)
INFO:     Started reloader process [5060] using StatReload
INFO:     Started server process [1728]
INFO:     Waiting for application startup.
INFO:     Application startup complete.
INFO:     127.0.0.1:64499 - "GET /devices HTTP/1.1" 500 Internal Server Error
ERROR:    Exception in ASGI application
Traceback (most recent call last):
  File "C:\Users\W0024618\Desktop\Backend\python-service\venv\Lib\site-packages\uvicorn\protocols\http\h11_impl.py", line 403, in run_asgi
    result = await app(  # type: ignore[func-returns-value]
             ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
        self.scope, self.receive, self.send
        ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
    )
    ^
  File "C:\Users\W0024618\Desktop\Backend\python-service\venv\Lib\site-packages\uvicorn\middleware\proxy_headers.py", line 60, in __call__
    return await self.app(scope, receive, send)
           ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
  File "C:\Users\W0024618\Desktop\Backend\python-service\venv\Lib\site-packages\fastapi\applications.py", line 1134, in __call__
    await super().__call__(scope, receive, send)
  File "C:\Users\W0024618\Desktop\Backend\python-service\venv\Lib\site-packages\starlette\applications.py", line 107, in __call__
    await self.middleware_stack(scope, receive, send)
  File "C:\Users\W0024618\Desktop\Backend\python-service\venv\Lib\site-packages\starlette\middleware\errors.py", line 186, in __call__
    raise exc
  File "C:\Users\W0024618\Desktop\Backend\python-service\venv\Lib\site-packages\starlette\middleware\errors.py", line 164, in __call__
    await self.app(scope, receive, _send)
  File "C:\Users\W0024618\Desktop\Backend\python-service\venv\Lib\site-packages\starlette\middleware\exceptions.py", line 63, in __call__
    await wrap_app_handling_exceptions(self.app, conn)(scope, receive, send)
  File "C:\Users\W0024618\Desktop\Backend\python-service\venv\Lib\site-packages\starlette\_exception_handler.py", line 53, in wrapped_app
    raise exc
  File "C:\Users\W0024618\Desktop\Backend\python-service\venv\Lib\site-packages\starlette\_exception_handler.py", line 42, in wrapped_app
    await app(scope, receive, sender)
  File "C:\Users\W0024618\Desktop\Backend\python-service\venv\Lib\site-packages\fastapi\middleware\asyncexitstack.py", line 18, in __call__
    await self.app(scope, receive, send)
  File "C:\Users\W0024618\Desktop\Backend\python-service\venv\Lib\site-packages\starlette\routing.py", line 716, in __call__
    await self.middleware_stack(scope, receive, send)
  File "C:\Users\W0024618\Desktop\Backend\python-service\venv\Lib\site-packages\starlette\routing.py", line 736, in app
    await route.handle(scope, receive, send)
  File "C:\Users\W0024618\Desktop\Backend\python-service\venv\Lib\site-packages\starlette\routing.py", line 290, in handle
    await self.app(scope, receive, send)
  File "C:\Users\W0024618\Desktop\Backend\python-service\venv\Lib\site-packages\fastapi\routing.py", line 125, in app
    await wrap_app_handling_exceptions(app, request)(scope, receive, send)
  File "C:\Users\W0024618\Desktop\Backend\python-service\venv\Lib\site-packages\starlette\_exception_handler.py", line 53, in wrapped_app
    raise exc
  File "C:\Users\W0024618\Desktop\Backend\python-service\venv\Lib\site-packages\starlette\_exception_handler.py", line 42, in wrapped_app
    await app(scope, receive, sender)
  File "C:\Users\W0024618\Desktop\Backend\python-service\venv\Lib\site-packages\fastapi\routing.py", line 111, in app
    response = await f(request)
               ^^^^^^^^^^^^^^^^
  File "C:\Users\W0024618\Desktop\Backend\python-service\venv\Lib\site-packages\fastapi\routing.py", line 391, in app
    raw_response = await run_endpoint_function(
                   ^^^^^^^^^^^^^^^^^^^^^^^^^^^^
    ...<3 lines>...
    )
    ^
  File "C:\Users\W0024618\Desktop\Backend\python-service\venv\Lib\site-packages\fastapi\routing.py", line 292, in run_endpoint_function
    return await run_in_threadpool(dependant.call, **values)
           ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
  File "C:\Users\W0024618\Desktop\Backend\python-service\venv\Lib\site-packages\starlette\concurrency.py", line 32, in run_in_threadpool
    return await anyio.to_thread.run_sync(func)
           ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
  File "C:\Users\W0024618\Desktop\Backend\python-service\venv\Lib\site-packages\anyio\to_thread.py", line 61, in run_sync
    return await get_async_backend().run_sync_in_worker_thread(
           ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
        func, args, abandon_on_cancel=abandon_on_cancel, limiter=limiter
        ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
    )
    ^
  File "C:\Users\W0024618\Desktop\Backend\python-service\venv\Lib\site-packages\anyio\_backends\_asyncio.py", line 2525, in run_sync_in_worker_thread
    return await future
           ^^^^^^^^^^^^
  File "C:\Users\W0024618\Desktop\Backend\python-service\venv\Lib\site-packages\anyio\_backends\_asyncio.py", line 986, in run
    result = context.run(func, *args)
  File "C:\Users\W0024618\Desktop\Backend\python-service\app.py", line 12, in list_devices
    d["status"] = ping(d["ip_address"])
                  ~~~~^^^^^^^^^^^^^^^^^
  File "C:\Users\W0024618\Desktop\Backend\python-service\ping_service.py", line 49, in ping
    subprocess.check_output(
    ~~~~~~~~~~~~~~~~~~~~~~~^
        ["ping", param, "1", ip],
        ^^^^^^^^^^^^^^^^^^^^^^^^^
        stderr=subprocess.DEVNULL,
        ^^^^^^^^^^^^^^^^^^^^^^^^^^
        stdout=subprocess.DEVNULL
        ^^^^^^^^^^^^^^^^^^^^^^^^^
    )
    ^
  File "C:\Program Files\Python313\Lib\subprocess.py", line 460, in check_output
    raise ValueError(f'{kw} argument not allowed, it will be overridden.')
ValueError: stdout argument not allowed, it will be overridden.
