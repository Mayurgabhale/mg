exports.getLiveOccupancy = async (req, res) => {
  try {
    await getPool();

    res.writeHead(200, {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      'Connection': 'keep-alive',
    });
    res.write('\n');

    let lastSeen = new Date();
    const events = [];

    const push = async () => {
      // fetch only new events since lastSeen
      const fresh = await fetchNewEvents(lastSeen);
      if (fresh.length) {
        lastSeen = new Date();
        events.push(...fresh);
      }

      // build live snapshot
      const occupancy = await buildOccupancy(events);
      const todayStats = buildVisitedToday(events);
      occupancy.totalVisitedToday = todayStats.total;
      occupancy.visitedToday = { ...todayStats };

      // send snapshot every second
      const sid = Date.now();
      res.write(`id: ${sid}\n`);
      res.write(`data: ${JSON.stringify(occupancy)}\n\n`);

      if (typeof res.flush === 'function') res.flush();
    };

    // push immediately, then every 1 second
    await push();
    const timer = setInterval(push, 1000);

    req.on('close', () => clearInterval(timer));
  } catch (err) {
    console.error('Live occupancy SSE error:', err);
    if (!res.headersSent) {
      res.status(500).json({ error: 'Internal Server Error' });
    }
  }
};