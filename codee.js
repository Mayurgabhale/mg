http://127.0.0.1:8000/daily_sheet/regions
i want alos total vip and active vip ok 

Global
100
Total Travelers
5 Active
67 VIP
🌏
APAC
13
Travelers
1 Active
12 VIP
🌍
EMEA
11
Travelers
0 Active
3 VIP
🌎
LACA
17
Travelers
1 Active
6 VIP
🌎
NAMER
59
Travelers
3 Active
46 VIP
{/* Total Card */}
<div style={styles.regionCard}>
    <div style={styles.regionCardHeader}>
        <div style={{ ...styles.regionIcon, background: '#3b82f6' }}>
            <FiGlobe size={16} />
        </div>
        <span style={styles.regionName}>Global</span>
    </div>
    <div style={styles.regionCardStats}>
        <span style={styles.regionCount}>{safeItems.length}</span>
        <span style={styles.regionLabel}>Total Travelers</span>
    </div>
    <div style={styles.regionCardActive}>
        <div style={styles.activeDot}></div>
        <span>{safeItems.filter(r => r.active_now).length} Active</span>
        <span style={{ marginLeft: 12, fontWeight: 600 }}>{safeItems.filter(r => r.is_vip).length} VIP</span>
    </div>
</div>

{/* Region Cards */}
{Object.entries(regionsData || {})
    .sort(([a], [b]) => {
        if (a === 'GLOBAL') return -1;
        if (b === 'GLOBAL') return 1;
        return a.localeCompare(b);
    })
    .map(([regionCode, regionData]) => (
        <div
            key={regionCode}
            style={{
                ...styles.regionCard,
                ...(filters.region === regionCode && styles.regionCardActive),
            }}
        >
            <div style={styles.regionCardHeader}>
                <div
                    style={{
                        ...styles.regionIcon,
                        background: getRegionColor(regionCode),
                    }}
                >
                    {getRegionIcon(regionCode)}
                </div>
                <span style={styles.regionName}>{regionCode}</span>
            </div>
            <div style={styles.regionCardStats}>
                <span style={styles.regionCount}>{regionData.total_count ?? 0}</span>
                <span style={styles.regionLabel}>Travelers</span>
            </div>
            <div style={styles.regionCardActive}>
                <div
                    style={{
                        ...styles.activeDot,
                        background:
                            (regionData.active_count ?? 0) > 0 ? '#10b981' : '#6b7280',
                    }}
                ></div>
                <span>{regionData.active_count ?? 0} Active</span>
                <span style={{ marginLeft: 12, fontWeight: 600 }}>
                    {regionData.vip_count ?? 0} VIP
                </span>
            </div>
        </div>
    ))}


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
    """Group all items by region -> city, with counts, active_count and vip_count."""
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
                "vip_count": 0,             # <- vip tracker per region
                "cities": {}
            }

        regions[region]["total_count"] += 1
        if it.get("active_now"):
            regions[region]["active_count"] += 1
        if it.get("is_vip"):
            regions[region]["vip_count"] += 1

        cities = regions[region]["cities"]
        if city not in cities:
            cities[city] = {
                "city_name": city,
                "total_count": 0,
                "active_count": 0,
                "vip_count": 0,           # <- vip tracker per city
                "sample_items": []
            }

        cities[city]["total_count"] += 1
        if it.get("active_now"):
            cities[city]["active_count"] += 1
        if it.get("is_vip"):
            cities[city]["vip_count"] += 1

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
