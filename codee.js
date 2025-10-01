// GET /api/current-occupancy
exports.getCurrentOccupancy = async (req, res) => {
  try {
    await getPool();

    // look back 24h from now to get today's events
    const since = DateTime.now().setZone('Asia/Kolkata').startOf('day').toJSDate();
    const events = await fetchNewEvents(since);

    const occupancy = await buildOccupancy(events);
    const todayStats = buildVisitedToday(events);
    occupancy.totalVisitedToday = todayStats.total;
    occupancy.visitedToday = todayStats;

    return res.json(occupancy);
  } catch (err) {
    console.error("getCurrentOccupancy error:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
};



...
router.get('/current-occupancy', liveOccupancyController.getCurrentOccupancy);