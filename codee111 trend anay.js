function filterHistoryForDisplay(hist, category) {
    const cat = (category || '').toString().toUpperCase();
    const filtered = [];
    let lastOff = null;

    hist.forEach(e => {
        if (e.status === 'Offline') {
            lastOff = e;
        } else if (e.status === 'Online' && lastOff) {
            const diff = (new Date(e.timestamp) - new Date(lastOff.timestamp)) / 1000;

            if (cat === 'SERVER') {
                // ✅ For SERVER: keep only downtime > 5 minutes
                if (diff > 300) {
                    filtered.push(lastOff, e);
                }
            } else {
                // ✅ For other devices: keep original rule (downtime ≥ 5 min)
                if (diff >= 300) {
                    filtered.push(lastOff, e);
                } else {
                    // If your original non-server logic allowed short events, you can adjust here.
                }
            }
            lastOff = null;
        } else {
            // Keep Online or single events for non-servers
            if (cat !== 'SERVER') filtered.push(e);
        }
    });

    // Handle the last Offline event (still down)
    if (lastOff) {
        const diff = (Date.now() - new Date(lastOff.timestamp)) / 1000;
        if (cat === 'SERVER') {
            if (diff > 300) filtered.push(lastOff);
        } else {
            if (diff >= 300) filtered.push(lastOff);
        }
    }

    return filtered.sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));
}