const express = require("express");
const Case = require("../../models/Case");
const Ca = require("../../models/Ca");

const router = express.Router();

router.put("/:caseId", async (req, res) => {
  try {
    const { caId } = req.body;

    // Fetch CA details for assignedCAName
    const ca = await Ca.findById(caId);
    if (!ca) return res.status(404).json({ message: "CA not found" });

    const updated = await Case.findOneAndUpdate(
      { caseId: req.params.caseId },   // IMPORTANT FIX
      {
        assignedCA: caId,
        assignedCAName: ca.name,
        assignedAt: new Date(),
      },
      { new: true }
    );

    if (!updated)
      return res.status(404).json({ message: "Case not found" });

    res.json({ message: "CA assigned", case: updated });

  } catch (error) {
    console.error("Assign CA Error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
