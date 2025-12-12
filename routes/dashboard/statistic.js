const express = require("express");
const router = express.Router();
const User = require("../../models/User");
const Case = require("../../models/Case");

// DASHBOARD OVERVIEW
router.get("/stats", async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalCases = await Case.countDocuments();
    const completedCases = await Case.countDocuments({ status: "completed" });
    const newCases = await Case.find().sort({ createdAt: -1 }).limit(5);
    const recentCases = await Case.find().sort({ createdAt: -1 }).limit(10);

    res.json({
      totalUsers,
      totalCases,
      completedCases,
      newCases,
      recentCases
    });
  } catch (error) {
    console.log("Dashboard Stats Error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
