// Get all controller + door statuses
app.get("/api/controllers/status", (req, res) => {
  res.json(fullStatus);
});