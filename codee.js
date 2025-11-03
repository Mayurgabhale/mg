const getStyles = (isDark) => ({
    // ... existing styles ...

    // Table Styles
    locationCell: {
        display: 'flex',
        alignItems: 'center',
        fontSize: '14px',
        maxWidth: '150px',
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        whiteSpace: 'nowrap',
    },

    countryCell: {
        display: 'flex',
        alignItems: 'center',
        fontSize: '14px',
        fontWeight: '500',
        color: isDark ? '#cbd5e1' : '#374151',
    },

    empId: {
        fontSize: '14px',
        fontWeight: '500',
        color: isDark ? '#cbd5e1' : '#374151',
    },

    // Popup Styles
    detailsContainer: {
        padding: '0',
    },

    detailSection: {
        padding: '20px 24px',
        borderBottom: isDark ? '1px solid #374151' : '1px solid #f3f4f6',
        ':last-child': {
            borderBottom: 'none',
        }
    },

    sectionHeader: {
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        marginBottom: '16px',
    },

    sectionIcon: {
        color: '#3b82f6',
        fontSize: '16px',
    },

    sectionTitle: {
        fontSize: '16px',
        fontWeight: '600',
        color: isDark ? '#f3f4f6' : '#374151',
        margin: 0,
    },

    detailList: {
        display: 'flex',
        flexDirection: 'column',
        gap: '12px',
    },

    detailRow: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
    },

    detailLabel: {
        fontSize: '14px',
        color: isDark ? '#9ca3af' : '#6b7280',
        fontWeight: '500',
        flex: 1,
    },

    detailValue: {
        fontSize: '14px',
        color: isDark ? '#e5e7eb' : '#374151',
        fontWeight: '400',
        flex: 1,
        textAlign: 'right',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'flex-end',
    },

    inlineIcon: {
        marginRight: '6px',
    },

    statusTag: {
        padding: '4px 8px',
        borderRadius: '6px',
        fontSize: '12px',
        fontWeight: '500',
    },

    activeTag: {
        background: isDark ? '#065f46' : '#dcfce7',
        color: isDark ? '#34d399' : '#16a34a',
    },

    inactiveTag: {
        background: isDark ? '#374151' : '#f3f4f6',
        color: isDark ? '#9ca3af' : '#6b7280',
    },
});