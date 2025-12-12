const express = require("express");
const Case = require("../../models/Case");

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const cases = await Case.find().sort({ createdAt: -1 });
    res.json(cases);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
