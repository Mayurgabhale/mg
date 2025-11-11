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
        <span style={{ marginLeft: 12, fontWeight: 600 }}>
            {safeItems.filter(r => r.is_vip).length} VIP
        </span>

        {/* ✅ Add this new line for Active VIP count */}
        <span style={{ marginLeft: 12, color: '#10b981', fontWeight: 600 }}>
            {safeItems.filter(r => r.active_now && r.is_vip).length} Active VIP
        </span>
    </div>
</div>