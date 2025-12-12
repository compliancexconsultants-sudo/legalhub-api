const express = require("express");
const router = express.Router();
const User = require("../../models/User");

router.get("/", async (req, res) => {
  try {
    const users = await User.find().sort({ createdAt: -1 });
    res.json(users);
  } catch (err) {
    console.error("User List Error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
