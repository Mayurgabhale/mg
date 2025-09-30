DENVER] SSE client disconnected, cleared timers
[DENVER] fetchNewEvents: got 1 rows (took 15117ms)
[DENVER] fetchNewEvents: got 2385 rows (took 22114ms)
❌ Denver MSSQL pool error: TimeoutError: operation timed out for an unknown reason
    at C:\Users\W0024618\Desktop\swipeData\employee-ai-insights\node_modules\tarn\dist\PendingOperation.js:17:27
    at runNextTicks (node:internal/process/task_queues:65:5)
    at listOnTimeout (node:internal/timers:549:9)
    at process.processTimers (node:internal/timers:523:7)
❌ Error fetching rejection data: TimeoutError: operation timed out for an unknown reason
    at C:\Users\W0024618\Desktop\swipeData\employee-ai-insights\node_modules\tarn\dist\PendingOperation.js:17:27
    at runNextTicks (node:internal/process/task_queues:65:5)
    at listOnTimeout (node:internal/timers:549:9)
    at process.processTimers (node:internal/timers:523:7)
❌ Denver MSSQL pool error: TimeoutError: operation timed out for an unknown reason
    at C:\Users\W0024618\Desktop\swipeData\employee-ai-insights\node_modules\tarn\dist\PendingOperation.js:17:27
    at runNextTicks (node:internal/process/task_queues:65:5)
    at listOnTimeout (node:internal/timers:549:9)
    at process.processTimers (node:internal/timers:523:7)
❌ fetchNewEvents query error — resetting Denver pool and returning empty: TimeoutError: operation timed out for an unknown reason
    at C:\Users\W0024618\Desktop\swipeData\employee-ai-insights\node_modules\tarn\dist\PendingOperation.js:17:27
    at runNextTicks (node:internal/process/task_queues:65:5)
    at listOnTimeout (node:internal/timers:549:9)
    at process.processTimers (node:internal/timers:523:7)
==========================================================================
    }
⏳ Retrying Denver pool connect (1 left)…
❌ Denver pool connection failed: ConnectionError: Failed to connect to SRVWUDEN0891V:1433 in 30000ms
    at C:\Users\W0024618\Desktop\swipeData\employee-ai-insights\node_modules\mssql\lib\tedious\connection-pool.js:85:17
    at Connection.onConnect (C:\Users\W0024618\Desktop\swipeData\employee-ai-insights\node_modules\tedious\lib\connection.js:849:9)
    at Object.onceWrapper (node:events:633:26)
    at Connection.emit (node:events:518:28)
    at Connection.emit (C:\Users\W0024618\Desktop\swipeData\employee-ai-insights\node_modules\tedious\lib\connection.js:970:18)
    at Connection.connectTimeout (C:\Users\W0024618\Desktop\swipeData\employee-ai-insights\node_modules\tedious\lib\connection.js:1222:10)
    at Timeout._onTimeout (C:\Users\W0024618\Desktop\swipeData\employee-ai-insights\node_modules\tedious\lib\connection.js:1167:12)
    at listOnTimeout (node:internal/timers:588:17)
    at process.processTimers (node:internal/timers:523:7) {
  code: 'ETIMEOUT',
  originalError: ConnectionError: Failed to connect to SRVWUDEN0891V:1433 in 30000ms
      at Connection.connectTimeout (C:\Users\W0024618\Desktop\swipeData\employee-ai-insights\node_modules\tedious\lib\connection.js:1222:26)
      at Timeout._onTimeout (C:\Users\W0024618\Desktop\swipeData\employee-ai-insights\node_modules\tedious\lib\connection.js:1167:12)
      at listOnTimeout (node:internal/timers:588:17)
      at process.processTimers (node:internal/timers:523:7) {
    code: 'ETIMEOUT'
  }
}
⚠️ fetchNewEvents: no pool available, returning empty
⚠️ Denver pool not available
⚠️ Denver pool not available
⚠️ Denver pool not available
⚠️ fetchNewEvents: no pool available, returning empty
⚠️ Denver pool not available
⚠️ Denver pool not available
⚠️ fetchNewEvents: no pool available, returning empty
⚠️ fetchNewEvents: no pool available, returning empty
⚠️ Denver pool not available
