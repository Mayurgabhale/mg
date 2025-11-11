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

                {/* ✅ New Active VIP count */}
                <span style={{ marginLeft: 12, color: '#10b981', fontWeight: 600 }}>
                    {regionData.active_vip_count ?? 0} Active VIP
                </span>
            </div>
        </div>
    ))}