file is uploded in databse but not getting successage message,,
  gettng below error.. how to fix this error permenatly ok  
read the below error and code carefully, and how to fix this tell me ok carefully, 
  
daily_shee
POST
/daily_sheet/upload
Upload

Upload daily travel Excel/CSV.

Detects header row robustly
Parses/normalizes dates
Saves records into daily_travel (replacing previous daily_travel rows)
Attempts to match each row to monthly employees (emp_id -> email -> name)
Updates previous_data cache
Parameters
Cancel
Reset
No parameters

Request body

multipart/form-data
file *
string($binary)
EMPLOYEES_TRAVELING_TODAY-202511120613.csv
Execute
Clear
Responses
Curl

curl -X 'POST' \
  'http://127.0.0.1:8000/daily_sheet/upload' \
  -H 'accept: application/json' \
  -H 'Content-Type: multipart/form-data' \
  -F 'file=@EMPLOYEES_TRAVELING_TODAY-202511120613.csv;type=text/csv'
Request URL
http://127.0.0.1:8000/daily_sheet/upload
Server response
Code	Details
500
Undocumented
Error: Internal Server Error

Response body
Download
Internal Server Error
Response headers
INFO:     127.0.0.1:49667 - "POST /daily_sheet/upload HTTP/1.1" 500 Internal Server Error
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
  File "C:\Users\W0024618\Desktop\swipeData\Travel-Backend\.venv\Lib\site-packages\fastapi\routing.py", line 390, in app
    raw_response = await run_endpoint_function(
                   ^^^^^^^^^^^^^^^^^^^^^^^^^^^^
    ...<3 lines>...
    )
    ^
  File "C:\Users\W0024618\Desktop\swipeData\Travel-Backend\.venv\Lib\site-packages\fastapi\routing.py", line 289, in run_endpoint_function
    return await dependant.call(**values)
           ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
  File "C:\Users\W0024618\Desktop\swipeData\Travel-Backend\daily_sheet.py", line 391, in upload
    return JSONResponse(content={
        'summary': summary,
        'items': items,
        'message': f'{rows_added} daily travel records saved and cached'
    })
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
