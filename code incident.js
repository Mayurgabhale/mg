function isNoGreenLocation(row) {
  const z = String(row.Zone || '').toLowerCase();
  return (
    z.includes('quezon') ||
    z.includes('vilnius')
  );
}