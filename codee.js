i am getting this unknow,,
    COUNTRY_TO_REGION = { use this to map,,
but every time getting new city, every time we not able to add,,
so use the algorihm to map this,,
    use ml to find out the region 
withou using COUNTRY_TO_REGION = { this ok 

 can yo do this..                                  
"UNKNOWN": {
      "region_code": "UNKNOWN",
      "total_count": 6,
      "active_count": 2,
      "vip_count": 6,
      "active_vip_count": 2,
      "cities": {
        "Valletta": {
          "city_name": "Valletta",
          "total_count": 2,
          "active_count": 0,
          "vip_count": 2,
          "active_vip_count": 0,
          "sample_items": [
            {
              "first_name": "GIANCARLO",
              "last_name": "COLELLA",
              "email": "giancarlo.colella@westernunion.com",
              "pnr": null,
              "active_now": 0,
              "is_vip": true,
              "begin_dt": null,
              "end_dt": null
            },
            {
              "first_name": "GIANCARLO",
              "last_name": "COLELLA",
              "email": "giancarlo.colella@westernunion.com",
              "pnr": null,
              "active_now": 0,
              "is_vip": true,
              "begin_dt": null,
              "end_dt": null
            }
          ]
        },
        "Billund": {
          "city_name": "Billund",
          "total_count": 1,
          "active_count": 0,
          "vip_count": 1,
          "active_vip_count": 0,
          "sample_items": [
            {
              "first_name": "LUKA",
              "last_name": "CULIC",
              "email": "luka.culic@westernunion.com",
              "pnr": null,
              "active_now": 0,
              "is_vip": true,
              "begin_dt": null,
              "end_dt": null
            }
          ]
        },
        "Copenhagen": {
          "city_name": "Copenhagen",
          "total_count": 1,
          "active_count": 1,
          "vip_count": 1,
          "active_vip_count": 1,
          "sample_items": [
            {
              "first_name": "LUKA",
              "last_name": "CULIC",
              "email": "luka.culic@westernunion.com",
              "pnr": null,
              "active_now": 1,
              "is_vip": true,
              "begin_dt": null,
              "end_dt": null
            }
          ]
        },
        "Stockholm": {
          "city_name": "Stockholm",
          "total_count": 1,
          "active_count": 0,
          "vip_count": 1,
          "active_vip_count": 0,
          "sample_items": [
            {
              "first_name": "LUKA",
              "last_name": "CULIC",
              "email": "luka.culic@westernunion.com",
              "pnr": null,
              "active_now": 0,
              "is_vip": true,
              "begin_dt": null,
              "end_dt": null
            }
          ]
        },
        "Vientiane": {
          "city_name": "Vientiane",
          "total_count": 1,
          "active_count": 1,
          "vip_count": 1,
          "active_vip_count": 1,
          "sample_items": [
            {
              "first_name": "NATCHA",
              "last_name": "DECHGAN",
              "email": "natcha.dechgan@wu.com",
              "pnr": null,
              "active_now": 1,
              "is_vip": true,
              "begin_dt": null,
              "end_dt": null
            }
          ]
        }
      }
    }
  },
  "last_updated": "2025-11-12T11:49:40.648643",
  "message": "Loaded region summary from memory or database"
}



# 🌍 Region mapping (includes common cities, states, and countries)
COUNTRY_TO_REGION = {
    # ---------------- APAC ----------------
    'india': 'APAC', 'pune': 'APAC', 'mumbai': 'APAC', 'hyderabad': 'APAC', 'chennai': 'APAC',
    'bangalore': 'APAC', 'bengaluru': 'APAC', 'delhi': 'APAC', 'gurgaon': 'APAC',
    'quezon city': 'APAC', 'taguig city': 'APAC', 'manila': 'APAC', 'philippines': 'APAC',
    'china': 'APAC', 'shanghai': 'APAC', 'beijing': 'APAC', 'hong kong': 'APAC', 'shenzhen': 'APAC',
    'japan': 'APAC', 'tokyo': 'APAC', 'osaka': 'APAC',
    'australia': 'APAC', 'sydney': 'APAC', 'melbourne': 'APAC', 'hobart': 'APAC',
    'singapore': 'APAC', 'singapore city': 'APAC',
    'malaysia': 'APAC', 'kuala lumpur': 'APAC',
    'indonesia': 'APAC', 'jakarta': 'APAC', 'bali': 'APAC',
    'thailand': 'APAC', 'bangkok': 'APAC',
    'vietnam': 'APAC', 'hanoi': 'APAC', 'ho chi minh': 'APAC', 'ho chi minh city': 'APAC',
    'south korea': 'APAC', 'seoul': 'APAC',
    'pakistan': 'APAC', 'karachi': 'APAC',
    'bangladesh': 'APAC', 'dhaka': 'APAC',
    'new zealand': 'APAC', 'auckland': 'APAC',

    # ---------------- NAMER ----------------
    'united states': 'NAMER', 'usa': 'NAMER', 'us': 'NAMER', 'america': 'NAMER',
    'new york': 'NAMER', 'los angeles': 'NAMER', 'houston': 'NAMER', 'denver': 'NAMER',
    'boston': 'NAMER', 'atlanta': 'NAMER', 'newark': 'NAMER',
    'miami': 'NAMER', 'las vegas': 'NAMER', 'washington': 'NAMER', 'washington d.c.': 'NAMER',
    'saint louis': 'NAMER', 'st. louis': 'NAMER', 'baltimore': 'NAMER', 'oakland': 'NAMER',
    'fort lauderdale': 'NAMER', 'annapolis': 'NAMER',
    'canada': 'NAMER', 'toronto': 'NAMER', 'vancouver': 'NAMER', 'montreal': 'NAMER', 'regina': 'NAMER',
    'mexico': 'NAMER', 'mexico city': 'NAMER',
    'chicago': 'NAMER', 'seattle': 'NAMER', 'phoenix': 'NAMER', 'dallas': 'NAMER',

    # ---------------- LACA ----------------
    'brazil': 'LACA', 'são paulo': 'LACA', 'sao paulo': 'LACA', 'rio de janeiro': 'LACA',
    'argentina': 'LACA', 'buenos aires': 'LACA', 'cordoba': 'LACA', 'salta': 'LACA',
    'chile': 'LACA', 'santiago': 'LACA',
    'colombia': 'LACA', 'bogotá': 'LACA', 'bogota': 'LACA',
    'peru': 'LACA', 'lima': 'LACA',
    'venezuela': 'LACA', 'caracas': 'LACA',
    'panama': 'LACA', 'panama city': 'LACA',
    'costa rica': 'LACA', 'san josé': 'LACA', 'san jose': 'LACA',
    'guatemala': 'LACA', 'guatemala city': 'LACA',
    'paraguay': 'LACA', 'asunción': 'LACA', 'asuncion': 'LACA',
    'uruguay': 'LACA', 'montevideo': 'LACA',
    'ecuador': 'LACA', 'quito': 'LACA',

    # ---------------- EMEA ----------------
    'united kingdom': 'EMEA', 'uk': 'EMEA', 'england': 'EMEA', 'london': 'EMEA', 'manchester': 'EMEA',
    'ireland': 'EMEA', 'dublin': 'EMEA', 'cork': 'EMEA',
    'spain': 'EMEA', 'madrid': 'EMEA', 'valencia': 'EMEA', 'bilbao': 'EMEA', 'barcelona': 'EMEA',
    'zaragoza': 'EMEA', 'palma de mallorca': 'EMEA', 'ibiza': 'EMEA',
    'italy': 'EMEA', 'rome': 'EMEA', 'milan': 'EMEA', 'trieste': 'EMEA', 'ancona': 'EMEA',
    'france': 'EMEA', 'paris': 'EMEA', 'perpignan': 'EMEA',
    'germany': 'EMEA', 'berlin': 'EMEA', 'munich': 'EMEA', 'frankfurt': 'EMEA',
    'austria': 'EMEA', 'vienna': 'EMEA', 'graz': 'EMEA',
    'lithuania': 'EMEA', 'vilnius': 'EMEA',
    'romania': 'EMEA', 'oradea': 'EMEA', 'bucharest': 'EMEA',
    'greece': 'EMEA', 'athens': 'EMEA',
    'portugal': 'EMEA', 'lisbon': 'EMEA',
    'russia': 'EMEA', 'moscow': 'EMEA',
    'uae': 'EMEA', 'abu dhabi': 'EMEA', 'dubai': 'EMEA',
    'morocco': 'EMEA', 'casablanca': 'EMEA',
    'netherlands': 'EMEA', 'amsterdam': 'EMEA',
    'poland': 'EMEA', 'warsaw': 'EMEA',
    'saudi arabia': 'EMEA', 'riyadh': 'EMEA',
    'south africa': 'EMEA', 'johannesburg': 'EMEA',
    'egypt': 'EMEA', 'cairo': 'EMEA',
    'luton': 'EMEA', 'doncaster': 'EMEA',
}
DEFAULT_REGION = 'UNKNOWN'


def guess_region(country: Optional[str], location: Optional[str]) -> str:
    """Guess a region using either country or location (case-insensitive, fuzzy matching)."""
    text_parts = []
    if country: text_parts.append(str(country).lower())
    if location: text_parts.append(str(location).lower())
    combined = " ".join(text_parts)

    for key, region in COUNTRY_TO_REGION.items():
        if key in combined:
            return region
    return DEFAULT_REGION



def normalize_city(location: Optional[str]) -> Optional[str]:
    """Simplify city name for grouping."""
    if not location:
        return None
    s = str(location).strip().split(',')[0]
    return s.title()


def build_regions_summary(items: list) -> dict:
    """Group all items by region -> city, with total_count, active_count, vip_count, and active_vip_count."""
    regions = {}
    for it in items:
        country = (it.get('to_country') or it.get('from_country') or "").strip()
        location = (it.get('to_location') or it.get('from_location') or "").strip()
        region = guess_region(country, location)
        city = normalize_city(location) or "Unknown"

        if region not in regions:
            regions[region] = {
                "region_code": region,
                "total_count": 0,
                "active_count": 0,
                "vip_count": 0,
                "active_vip_count": 0,  # ✅ new
                "cities": {}
            }

        # --- Region-level aggregation ---
        regions[region]["total_count"] += 1
        if it.get("active_now"):
            regions[region]["active_count"] += 1
        if it.get("is_vip"):
            regions[region]["vip_count"] += 1
        if it.get("active_now") and it.get("is_vip"):
            regions[region]["active_vip_count"] += 1  # ✅ new line

        # --- City-level aggregation ---
        cities = regions[region]["cities"]
        if city not in cities:
            cities[city] = {
                "city_name": city,
                "total_count": 0,
                "active_count": 0,
                "vip_count": 0,
                "active_vip_count": 0,  # ✅ new
                "sample_items": []
            }

        cities[city]["total_count"] += 1
        if it.get("active_now"):
            cities[city]["active_count"] += 1
        if it.get("is_vip"):
            cities[city]["vip_count"] += 1
        if it.get("active_now") and it.get("is_vip"):
            cities[city]["active_vip_count"] += 1  # ✅ new

        if len(cities[city]["sample_items"]) < 10:
            cities[city]["sample_items"].append({
                "first_name": it.get("first_name"),
                "last_name": it.get("last_name"),
                "email": it.get("email"),
                "pnr": it.get("pnr"),
                "active_now": it.get("active_now"),
                "is_vip": bool(it.get("is_vip")),
                "begin_dt": it.get("begin_dt"),
                "end_dt": it.get("end_dt")
            })

    # Sort cities by descending counts for nicer output
    for reg_data in regions.values():
        reg_data["cities"] = dict(
            sorted(reg_data["cities"].items(), key=lambda kv: -kv[1]["total_count"])
        )

    return regions



@router.get("/regions")
def get_regions():
    """
    Return regional travel summary grouped by region (APAC, EMEA, NAMER, LACA, UNKNOWN).
    Uses memory cache if available, else loads from DB.
    """

    # 1️⃣ Try using memory first
    if previous_data.get("items"):
        items = previous_data["items"]
    else:
        # 2️⃣ Fallback to DB
        db = SessionLocal()
        rows = db.query(DailyTravel).all()
        db.close()
        if not rows:
            raise HTTPException(status_code=404, detail="No travel data available in memory or database.")
        items = [{k: v for k, v in r.__dict__.items() if k != "_sa_instance_state"} for r in rows]
        previous_data["items"] = items

    # 3️⃣ Use the region builder you defined earlier
    regions = build_regions_summary(items)

    # 4️⃣ Cache + timestamp
    previous_data["regions_summary"] = regions
    previous_data["last_updated"] = datetime.now().isoformat()

    # 5️⃣ Return the summary
    return JSONResponse(content={
        "regions": regions,
        "last_updated": previous_data["last_updated"],
        "message": "Loaded region summary from memory or database"
    })



@router.get("/regions/{region_code}")
async def get_region(region_code: str):
