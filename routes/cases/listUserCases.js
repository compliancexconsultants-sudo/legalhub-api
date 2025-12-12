const express = require("express");
const router = express.Router();
const Case = require("../../models/Case");

router.get("/:userId", async (req, res) => {
  try {
    const cases = await Case.find({ userId: req.params.userId })
      .sort({ createdAt: -1 });

    res.json(cases);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
