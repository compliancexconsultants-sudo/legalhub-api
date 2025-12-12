const express = require("express");
const router = express.Router();
const User = require("../../models/User");
const Case = require("../../models/Case");

router.get("/:uid", async (req, res) => {
  try {
    const user = await User.findOne({ firebaseUid: req.params.uid });

    if (!user) return res.status(404).json({ message: "User not found" });

    // fetch all cases created by this user
    const cases = await Case.find({ userId: req.params.uid });

    res.json({
      user,
      totalCases: cases.length,
      cases
    });

  } catch (err) {
    console.error("User Details Error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
