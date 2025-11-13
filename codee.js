Total Travelers
12383 VIP
59 Active35 Active VIP
🌏
APAC
Travelers
86 VIP
6 Active4 Active VIP
🌍
EMEA
Travelers
1511 VIP
6 Active4 Active VIP
🌎
LACA
Travelers
72 VIP
5 Active2 Active VIP
🌎
NAMER
Travelers
9364 VIP
42 Active25 Active VIP

i want this card likehtis 
like that 
Global
Total Travelers
123        -      83 Total VIP
59 Active   -    35 Active VIP
  

<div style={styles.regionCardStats}>
                                        {/* <span style={styles.regionLabel}>Total Travelers</span> */}
                                        <span style={styles.regionCount}>{safeItems.length}
                                            <span style={{ marginLeft: 12, fontWeight: 600 }}>
                                                {safeItems.filter(r => r.is_vip).length} VIP
                                            </span>
                                        </span>
                                    </div>

 <div style={styles.regionCardStats}>
                                                <span style={styles.regionLabel}>Travelers</span>
                                                <span style={styles.regionCount}>{regionData.total_count ?? 0}
                                                    <span style={{ marginLeft: 12, fontWeight: 600 }}>
                                                        {regionData.vip_count ?? 0} VIP
                                                    </span>
                                                </span>
                                            </div>

 regionCardStats: {
        marginBottom: "8px",
    },

 regionCount: {
        display: "flex",
        fontSize: "20px",
        fontWeight: "800",
        color: isDark ? "#f1f5f9" : "#0f172a",
        display: "block",
        lineHeight: "1.2",
    },
