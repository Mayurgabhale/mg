// use relative path — works when client is hosted by same server
await fetch("/api/dailyReport/saveCompanyData", { method: "POST", ... });





curl http://localhost:5001/api/dailyReport/debug





curl -X POST http://localhost:5001/api/dailyReport/sendNow