const express = require("express");
const router = express.Router();
const dailyReportController = require("../controllers/dailyReportController");

// Endpoint for frontend to send data
router.post("/saveCompanyData", dailyReportController.saveCompanyData);

module.exports = router;