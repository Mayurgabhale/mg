in this i want ot add this region 
ok inlcude global ok only count 
<div style={styles.card}>
                        <div style={styles.uploadRow}>
                            <div style={styles.fileUploadWrapper}>
                                <input
                                    type="file"
                                    accept=".xlsx,.xls,.csv"
                                    onChange={handleFileChange}
                                    style={styles.fileInput}
                                    id="file-upload"
                                />
                                <label htmlFor="file-upload" style={styles.fileInputLabel}>
                                    <FiUpload style={{ marginRight: '8px' }} />
                                    {file ? file.name : "Choose File"}
                                </label>
                            </div>
                            <div style={styles.buttonGroup}>
                                <button
                                    onClick={uploadFile}
                                    disabled={loading}
                                    style={loading ? styles.disabledPrimaryBtn : styles.primaryBtn}
                                >
                                    {loading ? (
                                        <>
                                            <div style={styles.spinner}></div>
                                            Processing...
                                        </>
                                    ) : (
                                        <>
                                            <FiUpload style={{ marginRight: '8px' }} />
                                            Upload File
                                        </>
                                    )}
                                </button>
                                <button
                                    onClick={() => {
                                        setItems([]);
                                        setSummary({});
                                        setFile(null);
                                        toast.info("Data cleared successfully.");
                                    }}
                                    style={styles.secondaryBtn}
                                >
                                    <FiTrash2 style={{ marginRight: '8px' }} />
                                    Clear
                                </button>
                                <button onClick={exportCsv} style={styles.ghostBtn}>
                                    <FiDownload style={{ marginRight: '8px' }} />
                                    Export CSV
                                </button>
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
                                        placeholder="Search by name, email, or location..."
                                        value={filters.search}
                                        onChange={(e) => setFilters({ ...filters, search: e.target.value })}
                                        style={styles.searchInput}
                                    />
                                </div>
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
                                    value={filters.location}
                                    onChange={(e) => setFilters({ ...filters, location: e.target.value })}
                                    style={styles.select}
                                >
                                    <option value="">All Locations</option>
                                    {locations.map((loc) => (
                                        <option key={loc}>{loc}</option>
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
