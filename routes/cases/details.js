const express = require("express");
const Case = require("../../models/Case");

const router = express.Router();

router.get("/:caseId", async (req, res) => {
  try {
    const c = await Case.findOne({ caseId: req.params.caseId });
    if (!c) return res.status(404).json({ message: "Case not found" });

    res.json(c);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
