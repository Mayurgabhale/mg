i want to do login for this Upload Button.
    for example i click Upload Button this buttion that time opne this setShowUploadFileSection ok
but i want to do cradantional fo this buttion ( Upload Button)  i measn i wan to creat a login 
i click on this buttin i wan to opne long page .. then i enter correct username and passowed then afte opne setShowUploadFileSection thsi secion ok 
and i want to more atractive login page.. this is travelll logn page like that desing ok 

{/* Upload Button in Sidebar */}
                    <div style={{ padding: '20px', textAlign: 'center' }}>
                        <button
                            onClick={() => setShowUploadFileSection(true)}
                            style={{
                                backgroundColor: '#3182ce',
                                color: 'white',
                                padding: '12px 24px',
                                border: 'none',
                                borderRadius: '8px',
                                fontSize: '16px',
                                cursor: 'pointer',
                                width: '100%'
                            }}
                        >
                            <FiUpload style={{ marginRight: 8 }} />
                            Upload Button
                        </button>
                    </div>
