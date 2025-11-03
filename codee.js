// Inside the component, get the styles based on current theme
const styles = getStyles(isDarkTheme);

// Then update ALL style references in the JSX to use styles object
// For example:
return (
    <div style={styles.page}>
        {/* ... rest of the component ... */}
    </div>
);

// Replace ALL style references like:
// style={page} → style={styles.page}
// style={header} → style={styles.header}
// style={title} → style={styles.title}
// etc...