const EventEmitter = require('events');
const updates = new EventEmitter();
let latestSnapshot = null;
let denverBackgroundStarted = false;

function startDenverBackgroundWorker() {
  if (denverBackgroundStarted) return;
  denverBackgroundStarted = true;

  (async () => {
    console.log('[DENVER-BG] starting background poller');
    let lastSeen = new Date(Date.now() - 60 * 1000); // small lookback to avoid gaps
    const eventsBuffer = [];
    let consecutiveErrors = 0;

    while (true) {
      try {
        const fresh = await fetchNewEvents(lastSeen);
        if (fresh && fresh.length) {
          const lastEvt = fresh[fresh.length - 1];
          lastSeen = lastEvt && lastEvt.LocaleMessageTime ? new Date(lastEvt.LocaleMessageTime) : new Date();
          eventsBuffer.push(...fresh);
          // prune buffer to today's Denver date
          const todayDenver = DateTime.now().setZone('America/Denver').toISODate();
          for (let i = eventsBuffer.length - 1; i >= 0; i--) {
            if (!eventsBuffer[i].Dateonly || eventsBuffer[i].Dateonly !== todayDenver) eventsBuffer.splice(i, 1);
          }
        }

        // Build snapshot using your existing builder
        const payload = buildOccupancyForToday(eventsBuffer, fresh || [], null);
        latestSnapshot = payload;
        updates.emit('update', payload);

        consecutiveErrors = 0;
      } catch (err) {
        consecutiveErrors++;
        console.error('[DENVER-BG] polling error:', err);
        // Reset the pool so the next cycle will re-create it
        try { denver.poolPromise = null; } catch (e) { /* ignore */ }
        if (consecutiveErrors > 3) {
          await new Promise(r => setTimeout(r, 5000));
        }
      }

      await new Promise(r => setTimeout(r, 1000)); // 1s cadence (tune if needed)
    }
  })().catch(err => {
    console.error('[DENVER-BG] background worker crashed:', err);
    denverBackgroundStarted = false;
  });
}