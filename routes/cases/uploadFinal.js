const express = require("express");
const multer = require("multer");
const Case = require("../../models/Case");
const uploadToImgBB = require("../../utils/uploadToImgBB");

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

router.post("/:id", upload.any(), async (req, res) => {
  try {
    let uploaded = [];

    for (const file of req.files) {
      const url = await uploadToImgBB(file.buffer);

      uploaded.push({
        key: file.fieldname,
        file: url
      });
    }

    const updated = await Case.findByIdAndUpdate(
      req.params.id,
      { $push: { finalDocuments: { $each: uploaded } } },
      { new: true }
    );

    res.json({ message: "Final documents uploaded", case: updated });

  } catch (error) {
    console.log("UPLOAD FINAL ERROR:", error);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
