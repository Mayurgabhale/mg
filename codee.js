const moment = require('moment-timezone');
const timezones = require('../utils/timezones');

exports.getLiveSummary = async (req, res) => {
  try {
    const swipesRaw = await service.fetchLiveOccupancy();

    // 🕒 Filter to only include today's records per location's local timezone
    const swipes = swipesRaw.filter(r => {
      const tz = timezones[r.PartitionName2] || 'UTC';
      const localDateOfSwipe = moment(r.LocaleMessageTime).tz(tz).format('YYYY-MM-DD');
      const todayLocalDate = moment().tz(tz).format('YYYY-MM-DD');
      return localDateOfSwipe === todayLocalDate;
    });

    // 1️⃣ Today's headcount (first swipe per person)
    const firstByPerson = {};
    swipes.forEach(r => {
      const prev = firstByPerson[r.PersonGUID];
      const t = new Date(r.LocaleMessageTime).getTime();
      if (!prev || t < new Date(prev.LocaleMessageTime).getTime()) {
        firstByPerson[r.PersonGUID] = r;
      }
    });
    const todayRecs = Object.values(firstByPerson);
    const today = { total: 0, Employee: 0, Contractor: 0 };
    todayRecs.forEach(r => {
      today.total++;
      if (isEmployeeType(r.PersonnelType)) today.Employee++;
      else today.Contractor++;
    });

    // ... (rest of your existing realtime + details logic stays same)