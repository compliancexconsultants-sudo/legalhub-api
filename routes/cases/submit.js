const express = require("express");
const multer = require("multer");
const Case = require("../../models/Case");
const User = require("../../models/User");
const uploadToImgBB = require("../../utils/uploadToImgBB");

const router = express.Router();

const upload = multer({ storage: multer.memoryStorage() });

// Create case ID
function generateCaseId(serviceSlug) {
  const rand = Math.floor(10000 + Math.random() * 90000);
  return `LH-${serviceSlug.toUpperCase()}-${rand}`;
}

router.post("/", upload.any(), async (req, res) => {
  try {
    const { serviceName, serviceSlug, userId } = req.body;

    if (!userId) return res.status(400).json({ message: "Missing userId" });

    const user = await User.findOne({ firebaseUid: userId });
    if (!user) return res.status(404).json({ message: "User not found" });

    let fields = [];
    let documents = [];

    // Upload files to IMGBB
    for (const file of req.files) {
      const url = await uploadToImgBB(file.buffer);

      documents.push({
        key: file.fieldname,
        file: url
      });
    }

    // Non-file fields
    Object.keys(req.body).forEach(key => {
      if (["serviceName", "serviceSlug", "userId"].includes(key)) return;

      fields.push({
        key,
        value: req.body[key],
        isFile: false
      });
    });

    const newCase = await Case.create({
      caseId: generateCaseId(serviceSlug),
      serviceName,
      serviceSlug,

      userId,
      user: {
        name: user.name,
        email: user.email,
        phone: user.phone
      },

      fields,
      documents,
      status: "pending"
    });

    res.json({ message: "Case submitted successfully", case: newCase });

  } catch (error) {
    console.log("CASE SUBMIT ERROR:", error);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
