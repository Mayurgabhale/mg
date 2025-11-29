if (short && result[city].counts.hasOwnProperty(short)) {
    result[city].counts[short]++;
    if (status === "offline") {
        result[city].offline[short] = (result[city].offline[short] || 0) + 1;
    }
}