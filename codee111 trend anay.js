<div style={styles.card}>
    {/* Compact Upload Section */}
    <div style={styles.compactUploadRow}>
        <div style={styles.compactFileUpload}>
            <input
                type="file"
                accept=".xlsx,.xls,.csv"
                onChange={handleFileChange}
                style={styles.fileInput}
                id="file-upload"
            />
            <label htmlFor="file-upload" style={styles.compactFileLabel}>
                <FiUpload size={16} />
                {file ? file.name : "Choose File"}
            </label>
        </div>
        <div style={styles.compactButtonGroup}>
            <button
                onClick={uploadFile}
                disabled={loading}
                style={loading ? styles.disabledCompactBtn : styles.compactPrimaryBtn}
            >
                {loading ? (
                    <div style={styles.smallSpinner}></div>
                ) : (
                    <FiUpload size={14} />
                )}
            </button>
            <button
                onClick={() => {
                    setItems([]);
                    setSummary({});
                    setFile(null);
                    toast.info("Data cleared successfully.");
                }}
                style={styles.compactSecondaryBtn}
            >
                <FiTrash2 size={14} />
            </button>
            <button onClick={exportCsv} style={styles.compactGhostBtn}>
                <FiDownload size={14} />
            </button>
        </div>
    </div>

    {/* 🆕 Region Count Cards */}
    <div style={styles.regionCardsSection}>
        <div style={styles.sectionHeader}>
            <FiGlobe style={styles.sectionIcon} />
            <h3 style={styles.sectionTitle}>Regions Overview</h3>
        </div>
        <div style={styles.regionCardsGrid}>
            {/* Total Card */}
            <div style={styles.regionCard}>
                <div style={styles.regionCardHeader}>
                    <div style={{...styles.regionIcon, background: '#3b82f6'}}>
                        <FiGlobe size={16} />
                    </div>
                    <span style={styles.regionName}>ALL REGIONS</span>
                </div>
                <div style={styles.regionCardStats}>
                    <span style={styles.regionCount}>{safeItems.length}</span>
                    <span style={styles.regionLabel}>Total Travelers</span>
                </div>
                <div style={styles.regionCardActive}>
                    <div style={styles.activeDot}></div>
                    <span>{safeItems.filter(r => r.active_now).length} Active</span>
                </div>
            </div>

            {/* Region Cards */}
            {Object.entries(regionsData)
                .sort(([a], [b]) => {
                    // Sort: GLOBAL first, then alphabetically
                    if (a === 'GLOBAL') return -1;
                    if (b === 'GLOBAL') return 1;
                    return a.localeCompare(b);
                })
                .map(([regionCode, regionData]) => (
                <div 
                    key={regionCode} 
                    style={{
                        ...styles.regionCard,
                        ...(filters.region === regionCode && styles.regionCardActive)
                    }}
                    onClick={() => setFilters({ ...filters, region: filters.region === regionCode ? '' : regionCode })}
                >
                    <div style={styles.regionCardHeader}>
                        <div style={{
                            ...styles.regionIcon,
                            background: getRegionColor(regionCode)
                        }}>
                            {getRegionIcon(regionCode)}
                        </div>
                        <span style={styles.regionName}>{regionCode}</span>
                    </div>
                    <div style={styles.regionCardStats}>
                        <span style={styles.regionCount}>{regionData.total_count}</span>
                        <span style={styles.regionLabel}>Travelers</span>
                    </div>
                    <div style={styles.regionCardActive}>
                        <div style={{
                            ...styles.activeDot,
                            background: regionData.active_count > 0 ? '#10b981' : '#6b7280'
                        }}></div>
                        <span>{regionData.active_count} Active</span>
                    </div>
                </div>
            ))}
        </div>
    </div>

    {/* Filters Section */}
    <div style={styles.filtersSection}>
        <div style={styles.filtersHeader}>
            <FiFilter style={{ marginRight: '8px', color: '#6b7280' }} />
            <span style={styles.filtersTitle}>Filters & Search</span>
        </div>
        <div style={styles.filtersRow}>
            <div style={styles.searchWrapper}>
                <FiSearch style={styles.searchIcon} />
                <input
                    placeholder="Search travelers..."
                    value={filters.search}
                    onChange={(e) => setFilters({ ...filters, search: e.target.value })}
                    style={styles.searchInput}
                />
            </div>
            
            {/* Region Filter Dropdown */}
            <select
                value={filters.region}
                onChange={(e) => setFilters({ ...filters, region: e.target.value })}
                style={styles.select}
            >
                <option value="">All Regions</option>
                {Object.entries(regionsData)
                    .sort(([a], [b]) => {
                        if (a === 'GLOBAL') return -1;
                        if (b === 'GLOBAL') return 1;
                        return a.localeCompare(b);
                    })
                    .map(([region, data]) => (
                    <option key={region} value={region}>
                        {region} ({data.total_count})
                    </option>
                ))}
            </select>
            
            <select
                value={filters.country}
                onChange={(e) => setFilters({ ...filters, country: e.target.value })}
                style={styles.select}
            >
                <option value="">All Countries</option>
                {countries.map((c) => (
                    <option key={c}>{c}</option>
                ))}
            </select>
            <select
                value={filters.legType}
                onChange={(e) => setFilters({ ...filters, legType: e.target.value })}
                style={styles.select}
            >
                <option value="">All Travel Types</option>
                {legTypes.map((t) => (
                    <option key={t}>{t}</option>
                ))}
            </select>
            <select
                value={filters.status}
                onChange={(e) => setFilters({ ...filters, status: e.target.value })}
                style={styles.select}
            >
                <option value="">All Status</option>
                <option value="active">Active Only</option>
                <option value="inactive">Inactive Only</option>
            </select>
        </div>
    </div>
</div>