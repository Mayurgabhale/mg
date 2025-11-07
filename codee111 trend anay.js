
function filterHistoryForDisplay(hist, category) {
    const cat = (category || '').toString().toUpperCase();
    if (cat === 'SERVER') return hist.slice(); // show all for servers

    // remove any offline entries that resolve within 5 minutes
    const filtered = [];
    let lastOff = null;
    hist.forEach(e => {
        if (e.status === 'Offline') {
            lastOff = e;
        } else if (e.status === 'Online' && lastOff) {
            const diff = (new Date(e.timestamp) - new Date(lastOff.timestamp)) / 1000;
            if (diff >= 300) {
                filtered.push(lastOff, e);
            }
            lastOff = null;
        } else {
            filtered.push(e);
        }
    });
    if (lastOff) {
        const diff = (Date.now() - new Date(lastOff.timestamp)) / 1000;
        if (diff >= 300) filtered.push(lastOff);
    }
    return filtered.sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));
}
