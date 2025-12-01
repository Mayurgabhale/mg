const express = require("express");
const router = express.Router();
const {
  addDevice,
  updateDevice,
  deleteDevice,
  fetchGlobalData,
} = require("../services/excelService");

// get all devices (summary + details)
router.get("/all", async (req, res) => {
  try {
    const data = await fetchGlobalData();
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// add new device
router.post("/", (req, res) => {
  try {
    const { type, device } = req.body;
    if (!type || !device) return res.status(400).json({ error: "type and device are required" });
    const added = addDevice(type, device);
    res.status(201).json({ added });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// update device by old ip
router.put("/:ip", (req, res) => {
  try {
    const oldIp = req.params.ip;
    const updates = req.body;
    const updated = updateDevice(oldIp, updates);
    res.json({ updated });
  } catch (err) {
    res.status(404).json({ error: err.message });
  }
});

// delete device
router.delete("/:ip", (req, res) => {
  try {
    const ip = req.params.ip;
    deleteDevice(ip);
    res.json({ ok: true });
  } catch (err) {
    res.status(404).json({ error: err.message });
  }
});

module.exports = router;
