const pool = await sql.connect(dbConfig);
const req = pool.request();

req.input('dt', sql.DateTime2, datetimeISO);
if (location) req.input('location', sql.NVarChar, location);

const result = await req.query(query);
return result.recordset;



http://localhost:3005/api/occupancy/time-travel?datetime=2025-11-04T00:00:00