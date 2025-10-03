// routes/dailyReportRoutes.js
const express = require("express");
const router = express.Router();
const dailyReportController = require("../controllers/dailyReportController");

// Endpoint for frontend to send data
router.post("/saveCompanyData", dailyReportController.saveCompanyData);

// Debug endpoints (for manual testing)
router.get("/debug", dailyReportController.getSavedData);
router.post("/clear", dailyReportController.clearSavedData);

module.exports = router;