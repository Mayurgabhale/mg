const moment = require('moment-timezone');
const timezones = require('../utils/timezones');





const swipesRaw = await service.fetchLiveOccupancy();

// Group swipes by partition, filter to today in local time
const swipes = swipesRaw.filter(r => {
  const tz = timezones[r.PartitionName2] || 'UTC';
  const localDateOfSwipe = moment(r.LocaleMessageTime).tz(tz).format('YYYY-MM-DD');
  const todayLocalDate = moment().tz(tz).format('YYYY-MM-DD');
  return localDateOfSwipe === todayLocalDate;
});