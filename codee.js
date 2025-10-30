// --- 1) TODAY’S HEADCOUNT (fixed double counting)
const filteredSwipesForToday = swipes.filter(r => {
  const p = r.PartitionName2;
  return getLocalDateString(r.LocaleMessageTime, p) === partitionToday[p];
});

// ✅ use EmployeeID (fallback to GUID if missing)
const firstByEmployee = {};
filteredSwipesForToday.forEach(r => {
  const key = r.EmployeeID || r.PersonGUID;
  const prev = firstByEmployee[key];
  const t = new Date(r.LocaleMessageTime).getTime();
  if (!prev || t < new Date(prev.LocaleMessageTime).getTime()) {
    firstByEmployee[key] = r;
  }
});

const todayRecs = Object.values(firstByEmployee);
const today = { total: 0, Employee: 0, Contractor: 0 };
todayRecs.forEach(r => {
  today.total++;
  if (isEmployeeType(r.PersonnelType)) today.Employee++;
  else today.Contractor++;
});