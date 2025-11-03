const getStyles = (isDark) => ({
    // ... existing styles ...

    // Combined Location Styles
    combinedLocationCell: {
        display: 'flex',
        flexDirection: 'column',
        gap: '2px',
        minWidth: '120px',
        maxWidth: '180px',
    },

    locationRow: {
        display: 'flex',
        alignItems: 'center',
        fontSize: '13px',
        lineHeight: '1.2',
    },

    countryRow: {
        display: 'flex',
        alignItems: 'center',
        fontSize: '11px',
        lineHeight: '1.2',
        opacity: '0.8',
    },

    locationText: {
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        whiteSpace: 'nowrap',
        flex: 1,
    },

    countryText: {
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        whiteSpace: 'nowrap',
        flex: 1,
        color: isDark ? '#9ca3af' : '#6b7280',
        fontWeight: '400',
    },

    // Remove or keep these if you want to use them elsewhere
    locationCell: {
        display: 'flex',
        alignItems: 'center',
        fontSize: '14px',
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
});