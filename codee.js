// safeQuery helper — cancels request if it exceeds timeoutMs (ms)
async function safeQueryWithTimeout(req, sqlText, timeoutMs = 20_000) {
  // req is a mssql Request: created from pool.request()
  let timer = null;
  let timedOut = false;

  const cancelIfTimeout = () => {
    timedOut = true;
    try {
      if (typeof req.cancel === 'function') req.cancel(); // cancel the underlying request
    } catch (e) {
      // ignore
    }
  };

  const qPromise = (async () => {
    try {
      const result = await req.query(sqlText);
      return result;
    } finally {
      if (timer) clearTimeout(timer);
    }
  })();

  timer = setTimeout(cancelIfTimeout, timeoutMs);

  try {
    const res = await qPromise;
    if (timedOut) throw new Error('Query canceled after timeout');
    return res;
  } catch (err) {
    if (timedOut) err.message = `Query timed out after ${timeoutMs}ms`;
    throw err;
  }
}