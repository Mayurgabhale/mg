uploadMonthlyContainer: {
    background: isDark 
        ? "linear-gradient(135deg, #0f172a 0%, #1e293b 100%)" 
        : "linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)",
    borderRadius: '20px',
    margin: '20px',
    padding: '0',
    boxShadow: isDark 
        ? '0 20px 40px rgba(0, 0, 0, 0.3), 0 0 0 1px rgba(148, 163, 184, 0.1)'
        : '0 20px 40px rgba(0, 0, 0, 0.08), 0 0 0 1px rgba(226, 232, 240, 0.6)',
    overflow: 'hidden',
},

leftPanel: {
    flex: 1,
    padding: '32px',
},

headerSection: {
    marginBottom: '40px',
    textAlign: 'center',
    position: 'relative',
},

mainTitle: {
    fontSize: '32px',
    fontWeight: '800',
    background: isDark 
        ? 'linear-gradient(135deg, #60a5fa 0%, #a78bfa 100%)' 
        : 'linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    marginBottom: '12px',
    letterSpacing: '-0.02em',
},

subtitle: {
    fontSize: '18px',
    color: isDark ? '#94a3b8' : '#64748b',
    margin: '0 0 24px 0',
    fontWeight: '400',
},

closeSectionButton: {
    position: 'absolute',
    top: '0',
    right: '0',
    background: isDark ? 'rgba(239, 68, 68, 0.1)' : '#fef2f2',
    color: isDark ? '#fca5a5' : '#dc2626',
    border: isDark ? '1px solid rgba(239, 68, 68, 0.2)' : '1px solid #fecaca',
    padding: '10px 20px',
    borderRadius: '12px',
    fontSize: '14px',
    fontWeight: '600',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    transition: 'all 0.2s ease',
    ':hover': {
        background: isDark ? 'rgba(239, 68, 68, 0.2)' : '#fee2e2',
        transform: 'translateY(-1px)',
    }
},

/* ======================= */
/* QUICK FILE UPLOAD SECTION */
/* ======================= */
quickUploadSection: {
    background: isDark 
        ? 'linear-gradient(135deg, rgba(30, 41, 59, 0.8) 0%, rgba(15, 23, 42, 0.6) 100%)'
        : 'linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)',
    padding: '28px',
    borderRadius: '20px',
    marginBottom: '32px',
    border: isDark 
        ? '1px solid rgba(255, 255, 255, 0.08)' 
        : '1px solid rgba(226, 232, 240, 0.8)',
    boxShadow: isDark 
        ? '0 8px 32px rgba(0, 0, 0, 0.2)' 
        : '0 8px 32px rgba(0, 0, 0, 0.04)',
},

sectionHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    marginBottom: '24px',
},

sectionIcon: {
    color: '#3b82f6',
    background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)',
    padding: '10px',
    borderRadius: '12px',
},

sectionTitle: {
    fontSize: '20px',
    fontWeight: '700',
    color: isDark ? '#f1f5f9' : '#0f172a',
    margin: '0',
},

compactUploadRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '16px',
    marginBottom: '16px',
},

compactFileUpload: {
    flex: '1',
},

fileInput: {
    display: 'none',
},

compactFileLabel: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    padding: '16px 24px',
    background: isDark ? 'rgba(255, 255, 255, 0.05)' : '#f8fafc',
    border: isDark ? '1px solid rgba(255, 255, 255, 0.1)' : '1px solid #e2e8f0',
    borderRadius: '14px',
    cursor: 'pointer',
    color: isDark ? '#cbd5e1' : '#475569',
    fontWeight: '500',
    transition: 'all 0.2s ease',
    ':hover': {
        background: isDark ? 'rgba(255, 255, 255, 0.08)' : '#f1f5f9',
        borderColor: isDark ? 'rgba(59, 130, 246, 0.4)' : '#3b82f6',
    }
},

compactButtonGroup: {
    display: 'flex',
    gap: '8px',
},

compactPrimaryBtn: {
    background: 'linear-gradient(135deg, #10b981, #059669)',
    color: 'white',
    border: 'none',
    padding: '16px',
    borderRadius: '14px',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'all 0.2s ease',
    boxShadow: '0 4px 12px rgba(16, 185, 129, 0.3)',
    ':hover': {
        transform: 'translateY(-2px)',
        boxShadow: '0 6px 20px rgba(16, 185, 129, 0.4)',
    }
},

disabledCompactBtn: {
    background: isDark ? '#374151' : '#9ca3af',
    color: isDark ? '#6b7280' : '#d1d5db',
    border: 'none',
    padding: '16px',
    borderRadius: '14px',
    cursor: 'not-allowed',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    opacity: '0.6',
},

compactSecondaryBtn: {
    background: isDark ? 'rgba(239, 68, 68, 0.1)' : '#fef2f2',
    color: isDark ? '#fca5a5' : '#dc2626',
    border: isDark ? '1px solid rgba(239, 68, 68, 0.2)' : '1px solid #fecaca',
    padding: '16px',
    borderRadius: '14px',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'all 0.2s ease',
    ':hover': {
        background: isDark ? 'rgba(239, 68, 68, 0.2)' : '#fee2e2',
        transform: 'translateY(-1px)',
    }
},

compactGhostBtn: {
    background: isDark ? 'rgba(59, 130, 246, 0.1)' : '#eff6ff',
    color: isDark ? '#93c5fd' : '#2563eb',
    border: isDark ? '1px solid rgba(59, 130, 246, 0.2)' : '1px solid #dbeafe',
    padding: '16px',
    borderRadius: '14px',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'all 0.2s ease',
    ':hover': {
        background: isDark ? 'rgba(59, 130, 246, 0.2)' : '#dbeafe',
        transform: 'translateY(-1px)',
    }
},

smallSpinner: {
    width: '16px',
    height: '16px',
    border: '2px solid transparent',
    borderTop: '2px solid white',
    borderRadius: '50%',
    animation: 'spin 1s linear infinite',
},

fileStatus: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    padding: '12px 20px',
    background: isDark ? 'rgba(59, 130, 246, 0.1)' : '#eff6ff',
    border: isDark ? '1px solid rgba(59, 130, 246, 0.2)' : '1px solid #dbeafe',
    borderRadius: '12px',
    color: isDark ? '#93c5fd' : '#2563eb',
    fontSize: '14px',
},

fileStatusText: {
    fontWeight: '500',
},

/* ======================= */
/* MONTHLY EMPLOYEE UPLOAD SECTION */
/* ======================= */
monthlyUploadSection: {
    background: isDark 
        ? 'linear-gradient(135deg, rgba(30, 41, 59, 0.8) 0%, rgba(15, 23, 42, 0.6) 100%)'
        : 'linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)',
    padding: '28px',
    borderRadius: '20px',
    border: isDark 
        ? '1px solid rgba(255, 255, 255, 0.08)' 
        : '1px solid rgba(226, 232, 240, 0.8)',
    boxShadow: isDark 
        ? '0 8px 32px rgba(0, 0, 0, 0.2)' 
        : '0 8px 32px rgba(0, 0, 0, 0.04)',
},

uploadButtonSection: {
    textAlign: 'center',
    padding: '60px 40px',
    background: isDark ? 'rgba(255, 255, 255, 0.02)' : '#f8fafc',
    borderRadius: '16px',
    border: isDark ? '2px dashed rgba(255, 255, 255, 0.1)' : '2px dashed #e2e8f0',
},

uploadTriggerButton: {
    background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)',
    color: 'white',
    border: 'none',
    padding: '16px 32px',
    borderRadius: '14px',
    fontSize: '16px',
    fontWeight: '600',
    cursor: 'pointer',
    display: 'inline-flex',
    alignItems: 'center',
    gap: '8px',
    transition: 'all 0.3s ease',
    boxShadow: '0 8px 24px rgba(59, 130, 246, 0.4)',
    ':hover': {
        transform: 'translateY(-2px)',
        boxShadow: '0 12px 32px rgba(59, 130, 246, 0.6)',
    }
},

uploadHint: {
    color: isDark ? '#94a3b8' : '#64748b',
    fontSize: '14px',
    marginTop: '16px',
    maxWidth: '400px',
    margin: '16px auto 0',
},

/* Success Container */
successContainer: {
    background: isDark 
        ? 'linear-gradient(135deg, rgba(16, 185, 129, 0.1) 0%, rgba(5, 150, 105, 0.05) 100%)'
        : 'linear-gradient(135deg, #dcfce7 0%, #bbf7d0 100%)',
    borderRadius: '20px',
    padding: '32px',
    border: isDark 
        ? '1px solid rgba(16, 185, 129, 0.2)' 
        : '1px solid #bbf7d0',
    boxShadow: isDark 
        ? '0 8px 32px rgba(16, 185, 129, 0.1)' 
        : '0 8px 32px rgba(16, 185, 129, 0.15)',
},

successHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: '28px',
},

successTitleSection: {
    display: 'flex',
    alignItems: 'center',
    gap: '16px',
},

successIcon: {
    color: '#10b981',
    background: 'rgba(16, 185, 129, 0.1)',
    padding: '12px',
    borderRadius: '12px',
},

successTitle: {
    fontSize: '24px',
    fontWeight: '700',
    color: isDark ? '#10b981' : '#065f46',
    margin: '0 0 4px 0',
},

successSubtitle: {
    color: isDark ? '#34d399' : '#059669',
    margin: '0',
    fontSize: '14px',
    fontWeight: '500',
},

deleteDataButton: {
    background: isDark ? 'rgba(239, 68, 68, 0.1)' : '#fef2f2',
    color: isDark ? '#fca5a5' : '#dc2626',
    border: isDark ? '1px solid rgba(239, 68, 68, 0.2)' : '1px solid #fecaca',
    padding: '12px 20px',
    borderRadius: '12px',
    fontSize: '14px',
    fontWeight: '600',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    transition: 'all 0.2s ease',
    ':hover': {
        background: isDark ? 'rgba(239, 68, 68, 0.2)' : '#fee2e2',
        transform: 'translateY(-1px)',
    }
},

metadataGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
    gap: '20px',
    marginBottom: '32px',
    padding: '24px',
    background: isDark ? 'rgba(255, 255, 255, 0.02)' : 'white',
    borderRadius: '16px',
    border: isDark ? '1px solid rgba(255, 255, 255, 0.05)' : '1px solid #e2e8f0',
},

metadataItem: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
},

metadataLabel: {
    fontSize: '12px',
    color: isDark ? '#94a3b8' : '#64748b',
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
},

metadataValue: {
    fontSize: '16px',
    color: isDark ? '#f1f5f9' : '#0f172a',
    fontWeight: '600',
},

summaryCard: {
    background: isDark 
        ? 'linear-gradient(135deg, rgba(30, 41, 59, 0.8) 0%, rgba(15, 23, 42, 0.6) 100%)'
        : 'linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)',
    borderRadius: '16px',
    padding: '28px',
    border: isDark 
        ? '1px solid rgba(255, 255, 255, 0.08)' 
        : '1px solid rgba(226, 232, 240, 0.8)',
},

summaryTitle: {
    fontSize: '18px',
    fontWeight: '700',
    color: isDark ? '#f1f5f9' : '#0f172a',
    marginBottom: '24px',
    textAlign: 'center',
},

summaryStats: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
    gap: '20px',
},

summaryStat: {
    textAlign: 'center',
    padding: '24px',
    background: isDark ? 'rgba(255, 255, 255, 0.05)' : 'white',
    borderRadius: '14px',
    border: isDark ? '1px solid rgba(255, 255, 255, 0.08)' : '1px solid #e2e8f0',
    transition: 'all 0.2s ease',
    ':hover': {
        transform: 'translateY(-2px)',
        boxShadow: isDark 
            ? '0 8px 24px rgba(0, 0, 0, 0.3)' 
            : '0 8px 24px rgba(0, 0, 0, 0.08)',
    }
},

summaryIcon: {
    fontSize: '32px',
    color: '#3b82f6',
    marginBottom: '12px',
},

summaryNumber: {
    display: 'block',
    fontSize: '28px',
    fontWeight: '800',
    color: isDark ? '#f1f5f9' : '#0f172a',
    marginBottom: '4px',
},

summaryLabel: {
    fontSize: '12px',
    color: isDark ? '#94a3b8' : '#64748b',
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
},

loadingContainer: {
    textAlign: 'center',
    padding: '60px 40px',
    color: isDark ? '#94a3b8' : '#64748b',
    fontSize: '16px',
},

/* Modal Styles */
modalOverlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1000,
    backdropFilter: 'blur(8px)',
},

modalContent: {
    backgroundColor: isDark ? '#1e293b' : 'white',
    borderRadius: '24px',
    width: '90%',
    maxWidth: '520px',
    maxHeight: '90vh',
    overflow: 'auto',
    boxShadow: '0 32px 64px rgba(0, 0, 0, 0.3)',
    border: isDark ? '1px solid rgba(255, 255, 255, 0.1)' : '1px solid #e2e8f0',
},

modalHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '28px 32px',
    borderBottom: isDark ? '1px solid rgba(255, 255, 255, 0.1)' : '1px solid #e2e8f0',
},

modalTitle: {
    fontSize: '20px',
    fontWeight: '700',
    color: isDark ? '#f1f5f9' : '#0f172a',
    margin: 0,
},

closeButton: {
    background: isDark ? 'rgba(255, 255, 255, 0.05)' : '#f8fafc',
    border: 'none',
    cursor: 'pointer',
    color: isDark ? '#94a3b8' : '#64748b',
    padding: '8px',
    borderRadius: '10px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'all 0.2s ease',
    ':hover': {
        background: isDark ? 'rgba(255, 255, 255, 0.1)' : '#e2e8f0',
        color: isDark ? '#f1f5f9' : '#0f172a',
    }
},

uploadCard: {
    padding: '32px',
},

uploadArea: {
    border: isDark ? '2px dashed rgba(255, 255, 255, 0.2)' : '2px dashed #d1d5db',
    borderRadius: '16px',
    padding: '48px 32px',
    textAlign: 'center',
    marginBottom: '28px',
    transition: 'all 0.3s ease',
    background: isDark ? 'rgba(255, 255, 255, 0.02)' : '#fafafa',
    ':hover': {
        borderColor: isDark ? 'rgba(59, 130, 246, 0.6)' : '#3b82f6',
        background: isDark ? 'rgba(59, 130, 246, 0.05)' : '#f0f9ff',
    }
},

uploadCloudIcon: {
    color: isDark ? '#4b5563' : '#9ca3af',
    marginBottom: '20px',
},

uploadAreaTitle: {
    fontSize: '20px',
    fontWeight: '600',
    color: isDark ? '#f1f5f9' : '#0f172a',
    marginBottom: '12px',
},

uploadAreaSubtitle: {
    color: isDark ? '#94a3b8' : '#6b7280',
    marginBottom: '28px',
    fontSize: '14px',
},

fileInputLabel: {
    backgroundColor: 'linear-gradient(135deg, #3b82f6, #8b5cf6)',
    color: 'white',
    padding: '14px 28px',
    borderRadius: '12px',
    cursor: 'pointer',
    display: 'inline-flex',
    alignItems: 'center',
    fontSize: '14px',
    fontWeight: '600',
    transition: 'all 0.2s ease',
    boxShadow: '0 4px 12px rgba(59, 130, 246, 0.4)',
    ':hover': {
        transform: 'translateY(-1px)',
        boxShadow: '0 6px 20px rgba(59, 130, 246, 0.6)',
    }
},

hiddenFileInput: {
    display: 'none',
},

filePreview: {
    display: 'flex',
    alignItems: 'center',
    gap: '16px',
    padding: '20px',
    background: isDark ? 'rgba(255, 255, 255, 0.05)' : '#f8fafc',
    borderRadius: '12px',
    marginTop: '20px',
    maxWidth: '400px',
    margin: '20px auto 0',
    border: isDark ? '1px solid rgba(255, 255, 255, 0.08)' : '1px solid #e2e8f0',
},

fileIcon: {
    color: '#3b82f6',
    fontSize: '20px',
},

fileInfo: {
    flex: 1,
    textAlign: 'left',
},

fileName: {
    display: 'block',
    fontSize: '14px',
    fontWeight: '600',
    color: isDark ? '#f1f5f9' : '#0f172a',
    marginBottom: '4px',
},

fileSize: {
    fontSize: '12px',
    color: isDark ? '#94a3b8' : '#6b7280',
},

removeFileButton: {
    background: isDark ? 'rgba(239, 68, 68, 0.1)' : '#fef2f2',
    border: 'none',
    color: isDark ? '#fca5a5' : '#dc2626',
    cursor: 'pointer',
    padding: '6px',
    borderRadius: '6px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'all 0.2s ease',
    ':hover': {
        background: isDark ? 'rgba(239, 68, 68, 0.2)' : '#fee2e2',
    }
},

modalActions: {
    display: 'flex',
    gap: '16px',
    justifyContent: 'flex-end',
},

cancelButton: {
    backgroundColor: isDark ? 'rgba(255, 255, 255, 0.05)' : '#f8fafc',
    color: isDark ? '#94a3b8' : '#64748b',
    border: isDark ? '1px solid rgba(255, 255, 255, 0.1)' : '1px solid #e2e8f0',
    padding: '12px 24px',
    borderRadius: '12px',
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: '600',
    transition: 'all 0.2s ease',
    ':hover': {
        background: isDark ? 'rgba(255, 255, 255, 0.1)' : '#e2e8f0',
        transform: 'translateY(-1px)',
    }
},

uploadButton: {
    backgroundColor: 'linear-gradient(135deg, #10b981, #059669)',
    color: 'white',
    border: 'none',
    padding: '12px 28px',
    borderRadius: '12px',
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: '600',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    transition: 'all 0.2s ease',
    boxShadow: '0 4px 12px rgba(16, 185, 129, 0.4)',
    ':hover': {
        transform: 'translateY(-1px)',
        boxShadow: '0 6px 20px rgba(16, 185, 129, 0.6)',
    }
},

uploadButtonDisabled: {
    backgroundColor: isDark ? '#374151' : '#9ca3af',
    color: isDark ? '#6b7280' : '#d1d5db',
    border: 'none',
    padding: '12px 28px',
    borderRadius: '12px',
    cursor: 'not-allowed',
    fontSize: '14px',
    fontWeight: '600',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    opacity: '0.6',
},