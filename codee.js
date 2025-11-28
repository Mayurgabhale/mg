let entries = Object.values(map);

// ✅ Shuffle entries into random order
for (let i = entries.length - 1; i > 0; i--) {
  const j = Math.floor(Math.random() * (i + 1));
  [entries[i], entries[j]] = [entries[j], entries[i]];
}