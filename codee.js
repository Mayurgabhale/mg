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