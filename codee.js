const req = pool.request();

// 🚫 old — converts to UTC
// req.input('dt', sql.DateTime2, new Date(datetimeISO));

// ✅ new — keeps exact time as given
req.input('dt', sql.DateTime2, datetimeISO);

if (location) req.input('location', sql.NVarChar, location);

const result = await req.query(query);
return result.recordset;