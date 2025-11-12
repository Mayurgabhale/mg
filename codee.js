  running build_ext
      generating cffi module 'build\\temp.win-amd64-cpython-313\\Release\\timezonefinder.inside_polygon_ext.c'
      creating build\temp.win-amd64-cpython-313\Release
      building 'timezonefinder.inside_polygon_ext' extension
      error: Microsoft Visual C++ 14.0 or greater is required. Get it with "Microsoft C++ Build Tools": https://visualstudio.microsoft.com/visual-cpp-build-tools/
      [end of output]

  note: This error originates from a subprocess, and is likely not a problem with pip.
  ERROR: Failed building wheel for timezonefinder
Failed to build timezonefinder
error: failed-wheel-build-for-install

× Failed to build installable wheels for some pyproject.toml based projects
╰─> timezonefinder
(.venv) PS C:\Users\W0024618\Desktop\swipeData\Travel-Backend> 
    (.venv) PS C:\Users\W0024618\Desktop\swipeData\Travel-Backend> uvicorn main:app --reload --port 8000
INFO:     Will watch for changes in these directories: ['C:\\Users\\W0024618\\Desktop\\swipeData\\Travel-Backend']
INFO:     Uvicorn running on http://127.0.0.1:8000 (Press CTRL+C to quit)
INFO:     Started reloader process [10864] using StatReload
Process SpawnProcess-1:
Traceback (most recent call last):
  File "C:\Program Files\Python313\Lib\multiprocessing\process.py", line 313, in _bootstrap
    self.run()
    ~~~~~~~~^^
  File "C:\Program Files\Python313\Lib\multiprocessing\process.py", line 108, in run
    self._target(*self._args, **self._kwargs)
    ~~~~~~~~~~~~^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
  File "C:\Users\W0024618\Desktop\swipeData\Travel-Backend\.venv\Lib\site-packages\uvicorn\_subprocess.py", line 80, in subprocess_started
    target(sockets=sockets)
    ~~~~~~^^^^^^^^^^^^^^^^^
  File "C:\Users\W0024618\Desktop\swipeData\Travel-Backend\.venv\Lib\site-packages\uvicorn\server.py", line 67, in run
    return asyncio_run(self.serve(sockets=sockets), loop_factory=self.config.get_loop_factory())
  File "C:\Program Files\Python313\Lib\asyncio\runners.py", line 195, in run
    return runner.run(main)
           ~~~~~~~~~~^^^^^^
  File "C:\Program Files\Python313\Lib\asyncio\runners.py", line 118, in run
    return self._loop.run_until_complete(task)
           ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~^^^^^^
  File "C:\Program Files\Python313\Lib\asyncio\base_events.py", line 725, in run_until_complete
    return future.result()
           ~~~~~~~~~~~~~^^
  File "C:\Users\W0024618\Desktop\swipeData\Travel-Backend\.venv\Lib\site-packages\uvicorn\server.py", line 71, in serve
    await self._serve(sockets)
  File "C:\Users\W0024618\Desktop\swipeData\Travel-Backend\.venv\Lib\site-packages\uvicorn\server.py", line 78, in _serve
    config.load()
    ~~~~~~~~~~~^^
  File "C:\Users\W0024618\Desktop\swipeData\Travel-Backend\.venv\Lib\site-packages\uvicorn\config.py", line 439, in load
    self.loaded_app = import_from_string(self.app)
                      ~~~~~~~~~~~~~~~~~~^^^^^^^^^^
  File "C:\Users\W0024618\Desktop\swipeData\Travel-Backend\.venv\Lib\site-packages\uvicorn\importer.py", line 22, in import_from_string
    raise exc from None
  File "C:\Users\W0024618\Desktop\swipeData\Travel-Backend\.venv\Lib\site-packages\uvicorn\importer.py", line 19, in import_from_string
    module = importlib.import_module(module_str)
  File "C:\Program Files\Python313\Lib\importlib\__init__.py", line 88, in import_module
    return _bootstrap._gcd_import(name[level:], package, level)
           ~~~~~~~~~~~~~~~~~~~~~~^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
  File "<frozen importlib._bootstrap>", line 1387, in _gcd_import
  File "<frozen importlib._bootstrap>", line 1360, in _find_and_load
  File "<frozen importlib._bootstrap>", line 1331, in _find_and_load_unlocked
  File "<frozen importlib._bootstrap>", line 935, in _load_unlocked
  File "<frozen importlib._bootstrap_external>", line 1026, in exec_module
  File "<frozen importlib._bootstrap>", line 488, in _call_with_frames_removed
  File "C:\Users\W0024618\Desktop\swipeData\Travel-Backend\main.py", line 542, in <module>
    from daily_sheet import router as daily_router
  File "C:\Users\W0024618\Desktop\swipeData\Travel-Backend\daily_sheet.py", line 928, in <module>
    from timezonefinder import TimezoneFinder
ModuleNotFoundError: No module named 'timezonefinder'

pip install pytz timezonefinder






# add imports near top
import pytz
from timezonefinder import TimezoneFinder

TF = TimezoneFinder()

def infer_timezone_from_country_or_city(country: Optional[str], location: Optional[str]) -> Optional[str]:
    """
    Try to infer a tz name (e.g. "America/Denver") from:
      1) explicit country name or ISO code (pytz.country_timezones)
      2) local city DB (geonamescache) -> lat/lon -> timezonefinder
    Returns tz name string or None.
    """
    # 1) country (try ISO alpha-2 and fuzzy name lookup)
    if country:
        c = country.strip()
        # if already ISO alpha2
        if len(c) == 2:
            try:
                tlist = pytz.country_timezones.get(c.upper())
                if tlist:
                    return tlist[0]
            except Exception:
                pass
        # try lookup by name via pycountry
        try:
            pc = pycountry.countries.get(name=c)
            if not pc:
                # fuzzy attempt
                choices = [cobj.name for cobj in pycountry.countries]
                best = process.extractOne(c, choices, scorer=fuzz.token_sort_ratio)
                if best and best[1] > 80:
                    pc = pycountry.countries.get(name=best[0])
            if pc:
                tlist = pytz.country_timezones.get(pc.alpha_2)
                if tlist:
                    return tlist[0]
        except Exception:
            pass

    # 2) city -> geonamescache -> lat/lon -> timezonefinder
    if location:
        city_only = str(location).split(",")[0].strip().lower()
        try:
            rec = CITY_DB.get(city_only)
            if rec:
                lat = float(rec.get("latitude"))
                lon = float(rec.get("longitude"))
                tzname = TF.timezone_at(lng=lon, lat=lat)
                if tzname:
                    return tzname
        except Exception:
            pass

    return None


def parse_datetime_with_inference(dt_val, country: Optional[str] = None, location: Optional[str] = None):
    """
    Parse a datetime-like value into an aware datetime (UTC).
    - If dt_val has tzinfo → convert to UTC and return
    - If dt_val is naive → infer tz (country/city) else fallback to SERVER_TZ
    - Returns timezone-aware datetime in UTC, or None if unparseable
    """
    if dt_val is None:
        return None
    try:
        # try parse first (dateutil)
        dt = date_parser.parse(str(dt_val))
    except Exception:
        return None

    # if dt already aware -> convert to UTC
    if dt.tzinfo is not None:
        return dt.astimezone(timezone.utc)

    # dt naive -> infer tz
    tzname = infer_timezone_from_country_or_city(country, location)
    if not tzname:
        tzname = getattr(SERVER_TZ, "key", None) if hasattr(SERVER_TZ, "key") else None
    # fallback to explicit zone string if needed
    try:
        tz = pytz.timezone(tzname) if tzname else pytz.timezone("Asia/Kolkata")
    except Exception:
        tz = pytz.timezone("Asia/Kolkata")

    dt_local = tz.localize(dt)
    return dt_local.astimezone(timezone.utc)
