{/* Temporary test button */}
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
            cursor: 'pointer'
        }}
    >
        <FiUpload style={{ marginRight: 8 }} />
        Test Upload Button
    </button>
</div>