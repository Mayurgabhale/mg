i say like this 
create this more atractive desing 
 {/* //////// */}
                    {activeTab === "addTravel" && (

                        <div style={styles.addTravelerSection}>
                            <button
                                onClick={() => setShowAddForm(!showAddForm)}
                                style={showAddForm ? styles.cancelButton : styles.addButton}
                            >
                                <div style={styles.buttonContent}>
                                    {showAddForm ? (
                                        <>
                                            <FiX size={16} />
                                            Cancel
                                        </>
                                    ) : (
                                        <>
                                            <FiUserPlus size={16} />
                                            Add New Traveler
                                        </>
                                    )}
                                </div>
                            </button>

                            {showAddForm && (
                                <div style={styles.addFormContainer}>
                                    {/* Form Header */}
                                    <div style={styles.formHeader}>
                                        <div style={styles.formIcon}>
                                            <FiUserPlus size={20} />
                                        </div>
                                        <div>
                                            <h3 style={styles.formTitle}>Add Traveler Details</h3>
                                            <p style={styles.formSubtitle}>Enter new traveler information</p>
                                        </div>
                                    </div>

                                    {/* Form Fields Grid */}
                                    <div style={styles.formGrid}>
                                        {[
                                            { key: 'first_name', label: 'First Name', type: 'text', icon: FiUser },
                                            { key: 'last_name', label: 'Last Name', type: 'text', icon: FiUser },
                                            { key: 'emp_id', label: 'Employee ID', type: 'text', icon: FiAward },
                                            { key: 'email', label: 'Email', type: 'email', icon: FiMail },
                                            { key: 'leg_type', label: 'Travel Type', type: 'text', icon: FiNavigation },
                                            { key: 'from_location', label: 'From Location', type: 'text', icon: FiMapPin },
                                            { key: 'from_country', label: 'From Country', type: 'text', icon: FiGlobe },
                                            { key: 'to_location', label: 'To Location', type: 'text', icon: FiMapPin },
                                            { key: 'to_country', label: 'To Country', type: 'text', icon: FiGlobe },
                                            { key: 'begin_dt', label: 'Start Date', type: 'datetime-local', icon: FiCalendar },
                                            { key: 'end_dt', label: 'End Date', type: 'datetime-local', icon: FiCalendar },
                                        ].map(({ key, label, type, icon: Icon }) => (
                                            <div key={key} style={styles.inputGroup}>
                                                <label style={styles.inputLabel}>
                                                    <Icon size={14} style={styles.labelIcon} />
                                                    {label}
                                                </label>
                                                <input
                                                    type={type}
                                                    value={newTraveler[key] || ''}
                                                    onChange={(e) => setNewTraveler({ ...newTraveler, [key]: e.target.value })}
                                                    style={styles.formInput}
                                                    placeholder={`Enter ${label.toLowerCase()}`}
                                                />
                                            </div>
                                        ))}
                                    </div>

                                    {/* Form Actions */}
                                    <div style={styles.formActions}>
                                        <button
                                            onClick={() => setShowAddForm(false)}
                                            style={styles.secondaryButton}
                                        >
                                            <FiX size={16} />
                                            Cancel
                                        </button>
                                        <button
                                            onClick={addTraveler}
                                            style={styles.saveButton}
                                        >
                                            <FiSave size={16} />
                                            Save Traveler
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>




                    )}
                    {/* //////// */}

{ id: "AddNewTraveler", label: "Add New Traveler",},
                            { id: "overview", label: "Overview", icon: FiActivity },
                            { id: "analytics", label: "Analytics", icon: FiBarChart2 },
                            { id: "recent", label: "Recent Travels", icon: FiClock },
