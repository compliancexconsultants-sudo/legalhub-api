const express = require("express");
const router = express.Router();
const Case = require("../../models/Case");

router.put("/:caseId", async (req, res) => {
  try {
    const { status } = req.body;

    const updated = await Case.findOneAndUpdate(
      { caseId: req.params.caseId },
      { status },
      { new: true }
    );

    if (!updated)
      return res.status(404).json({ message: "Case not found" });

    res.json(updated);

  } catch (err) {
    console.error("Status Update Error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
