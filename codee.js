const today = new Date(); // use current date in production
today.setHours(0, 0, 0, 0); // normalize to midnight for comparison

const todayTravelers = safeItems.filter((r) => {
  if (!r.begin_dt) return false;
  const start = new Date(r.begin_dt);
  start.setHours(0, 0, 0, 0);
  return start.getTime() === today.getTime(); // only if start date = today
});