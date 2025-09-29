async function fetchNewEvents(since) {
  let pool;
  try {
    // IMPORTANT: use denver.getPool() (not denver.poolPromise)
    pool = await denver.getPool();
  } catch (err) {
    console.error('❌ Failed to get Denver pool in fetchNewEvents():', err);
    return [];
  }
  if (!pool) {
    console.warn('⚠️ fetchNewEvents: no pool available, returning empty');
    return [];
  }

  const req = pool.request();
  req.input('since', sql.DateTime2, since);

  const queryText = `...`; // paste the same long query you already have

  const t0 = Date.now();
  try {
    const { recordset } = await safeQueryWithTimeout(req, queryText, 20_000); // 20s timeout
    const took = Date.now() - t0;
    console.log(`[DENVER] fetchNewEvents: got ${recordset ? recordset.length : 0} rows (took ${took}ms)`);
    return recordset || [];
  } catch (err) {
    console.error('❌ fetchNewEvents query error — resetting Denver pool and returning empty:', err);
    try {
      // Close pool to free resources; next getDenverPool will reconnect
      if (pool && typeof pool.close === 'function') {
        try { await pool.close(); } catch (e) { /* ignore */ }
      }
    } catch (e) { /* ignore */ }

    // set the exported promise to null so new callers will recreate
    try { denver._forceReset = true; } catch (e) { /* ignore */ }

    return [];
  }
}