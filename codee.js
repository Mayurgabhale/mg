// 🆕 Find travelers who are traveling today (30-10-2025)
const today = new Date("2025-10-30"); // you can change this to new Date() in production

const todayTravelers = safeItems.filter((r) => {
  const start = new Date(r.begin_dt);
  const end = new Date(r.end_dt);
  return start <= today && end >= today; // trip includes today
});