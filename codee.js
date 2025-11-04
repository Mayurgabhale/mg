     <div style={{ margin: "20px 0" }}>
                        <button
                            onClick={() => setShowAddForm(!showAddForm)}
                            style={{
                                background: "#2563eb",
                                color: "white",
                                padding: "8px 16px",
                                borderRadius: "8px",
                                border: "none",
                                cursor: "pointer",
                            }}
                        >
                            {showAddForm ? "Cancel" : "➕ Add Traveler"}
                        </button>

                        {showAddForm && (
                            <div style={{
                                marginTop: "16px",
                                padding: "16px",
                                background: isDarkTheme ? "#1f2937" : "#f9fafb",
                                borderRadius: "12px",
                                boxShadow: "0 1px 3px rgba(0,0,0,0.2)",
                            }}>
                                <h3>Add Traveler Details</h3>
                                <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "8px" }}>
                                    {Object.keys(newTraveler).map((key) => (
                                        <input
                                            key={key}
                                            type={key.includes("dt") ? "datetime-local" : "text"}
                                            placeholder={key.replace("_", " ").toUpperCase()}
                                            value={newTraveler[key]}
                                            onChange={(e) => setNewTraveler({ ...newTraveler, [key]: e.target.value })}
                                            style={{
                                                padding: "8px",
                                                borderRadius: "6px",
                                                border: "1px solid #d1d5db",
                                                background: isDarkTheme ? "#374151" : "white",
                                                color: isDarkTheme ? "white" : "black",
                                            }}
                                        />
                                    ))}
                                </div>
                                <button
                                    onClick={addTraveler}
                                    style={{
                                        marginTop: "12px",
                                        background: "#16a34a",
                                        color: "white",
                                        padding: "8px 16px",
                                        borderRadius: "8px",
                                        border: "none",
                                        cursor: "pointer",
                                    }}
                                >
                                    Save Traveler
                                </button>
                            </div>
                        )}
                    </div>
