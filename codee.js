PS C:\Users\W0024618\desktop\swipeData\employee-ai-insights> npm start

> employee-ai-insights@1.0.0 start
> node server.js

❌ Uncaught Exception (will exit) (Pune): Error: Cannot find module 'nodemailer'
Require stack:
- C:\Users\W0024618\Desktop\swipeData\employee-ai-insights\controllers\dailyReportController.js
- C:\Users\W0024618\Desktop\swipeData\employee-ai-insights\routes\dailyReportRoutes.js
- C:\Users\W0024618\Desktop\swipeData\employee-ai-insights\server.js
    at Function._resolveFilename (node:internal/modules/cjs/loader:1401:15)
    at defaultResolveImpl (node:internal/modules/cjs/loader:1057:19)
    at resolveForCJSWithHooks (node:internal/modules/cjs/loader:1062:22)
    at Function._load (node:internal/modules/cjs/loader:1211:37)
    at TracingChannel.traceSync (node:diagnostics_channel:322:14)
    at wrapModuleLoad (node:internal/modules/cjs/loader:235:24)
    at Module.require (node:internal/modules/cjs/loader:1487:12)
    at require (node:internal/modules/helpers:135:16)
    at Object.<anonymous> (C:\Users\W0024618\Desktop\swipeData\employee-ai-insights\controllers\dailyReportController.js:2:20)
    at Module._compile (node:internal/modules/cjs/loader:1730:14) {
  code: 'MODULE_NOT_FOUND',
  requireStack: [
    'C:\\Users\\W0024618\\Desktop\\swipeData\\employee-ai-insights\\controllers\\dailyReportController.js',
    'C:\\Users\\W0024618\\Desktop\\swipeData\\employee-ai-insights\\routes\\dailyReportRoutes.js',
    'C:\\Users\\W0024618\\Desktop\\swipeData\\employee-ai-insights\\server.js'
  ]
}
❌ Uncaught Exception (Denver): Error: Cannot find module 'nodemailer'
Require stack:
- C:\Users\W0024618\Desktop\swipeData\employee-ai-insights\controllers\dailyReportController.js
- C:\Users\W0024618\Desktop\swipeData\employee-ai-insights\routes\dailyReportRoutes.js
- C:\Users\W0024618\Desktop\swipeData\employee-ai-insights\server.js
    at Function._resolveFilename (node:internal/modules/cjs/loader:1401:15)
    at defaultResolveImpl (node:internal/modules/cjs/loader:1057:19)
    at resolveForCJSWithHooks (node:internal/modules/cjs/loader:1062:22)
    at Function._load (node:internal/modules/cjs/loader:1211:37)
    at TracingChannel.traceSync (node:diagnostics_channel:322:14)
    at wrapModuleLoad (node:internal/modules/cjs/loader:235:24)
    at Module.require (node:internal/modules/cjs/loader:1487:12)
    at require (node:internal/modules/helpers:135:16)
    at Object.<anonymous> (C:\Users\W0024618\Desktop\swipeData\employee-ai-insights\controllers\dailyReportController.js:2:20)
    at Module._compile (node:internal/modules/cjs/loader:1730:14) {
  code: 'MODULE_NOT_FOUND',
  requireStack: [
    'C:\\Users\\W0024618\\Desktop\\swipeData\\employee-ai-insights\\controllers\\dailyReportController.js',
    'C:\\Users\\W0024618\\Desktop\\swipeData\\employee-ai-insights\\routes\\dailyReportRoutes.js',
    'C:\\Users\\W0024618\\Desktop\\swipeData\\employee-ai-insights\\server.js'
  ]
}
✅ MSSQL pool connected (Pune)
✅ Denver MSSQL pool connected
