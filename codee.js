// add near the other routes
// TimeTravel: ?datetime=2025-11-05T10:40:00[&location=UK.London]
router.get('/time-travel', controller.getTimeTravelOccupancy);