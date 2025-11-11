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
