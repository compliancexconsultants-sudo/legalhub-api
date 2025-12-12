// routes/ca.js
const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const Ca = require("../../models/Ca");
const { generatePassword, hashPassword, comparePassword } = require("../../utils/caHelpers");
const multer = require("multer");
const uploadToImgBB = require("../../utils/uploadToImgBB");
const Case = require("../../models/Case");

// mailer optional
let mailer = null;
try { mailer = require("../../utils/mailer"); } catch (e) {}

const upload = multer({ storage: multer.memoryStorage() });

/**
 * CREATE CA (no admin middleware for now)
 */
router.post("/", upload.any(), async (req, res) => {
  try {
    const { name, email, phone, specialization, experienceYears } = req.body;

    if (!name || !email) {
      return res.status(400).json({ message: "Name and Email required" });
    }

    const exists = await Ca.findOne({ email: email.toLowerCase() });
    if (exists) return res.status(409).json({ message: "CA already exists" });

    // Generate password
    const plainPassword = generatePassword(10);
    const hashed = await hashPassword(plainPassword);

    // Upload documents if any
    const documents = [];
    if (req.files && req.files.length > 0) {
      for (const f of req.files) {
        const url = await uploadToImgBB(f.buffer);
        documents.push({ name: f.fieldname, url });
      }
    }

    const ca = await Ca.create({
      name,
      email: email.toLowerCase(),
      phone,
      specialization,
      experienceYears,
      documents,
      password: hashed
    });

    // Send email if mailer exists
    if (mailer) {
      try {
        await mailer.sendEmail(
          email,
          "Your CA Account Details",
          `<p>Hello ${name},</p>
           <p>Your CA account has been created.</p>
           <p><b>Email:</b> ${email}</p>
           <p><b>Password:</b> ${plainPassword}</p>
           <p>Please login and update your password.</p>`
        );
      } catch (e) {
        console.log("Mailer error:", e);
      }
    }

    const safe = ca.toObject();
    delete safe.password;

    res.json({
      message: "CA created successfully",
      ca: safe,
      password: plainPassword // for admin to share manually
    });

  } catch (error) {
    console.log("CA Create Error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

/**
 * GET ALL CAs
 */
router.get("/", async (req, res) => {
  try {
    const cas = await Ca.find().select("-password").sort({ createdAt: -1 });
    res.json(cas);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

/**
 * GET SINGLE CA
 */
router.get("/:id", async (req, res) => {
  try {
    const ca = await Ca.findById(req.params.id).select("-password");
    if (!ca) return res.status(404).json({ message: "CA not found" });

    res.json(ca);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

/**
 * UPDATE CA
 */
router.put("/:id", upload.any(), async (req, res) => {
  try {
    const updates = req.body;

    // Upload documents if provided
    if (req.files && req.files.length > 0) {
      updates.documents = [];

      for (const f of req.files) {
        const url = await uploadToImgBB(f.buffer);
        updates.documents.push({ name: f.fieldname, url });
      }
    }

    const ca = await Ca.findByIdAndUpdate(req.params.id, updates, {
      new: true
    }).select("-password");

    if (!ca) return res.status(404).json({ message: "CA not found" });

    res.json({ message: "CA updated", ca });

  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

/**
 * DELETE CA
 */
router.delete("/:id", async (req, res) => {
  try {
    const deleted = await Ca.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: "CA not found" });

    res.json({ message: "CA deleted" });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

/**
 * CA LOGIN
 */
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const ca = await Ca.findOne({ email: email.toLowerCase() });
    if (!ca) return res.status(404).json({ message: "Invalid credentials" });

    const match = await comparePassword(password, ca.password);
    if (!match) return res.status(401).json({ message: "Invalid credentials" });

    // const token = jwt.sign(
    //   { caId: ca._id },
    //   process.env.JWT_SECRET,
    //   { expiresIn: "7d" }
    // );

    const safe = ca.toObject();
    delete safe.password;

    res.json({ message: "Login success", ca: safe });

  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

/**
 * CA CHANGE PASSWORD
 */
router.put("/change-password", async (req, res) => {
  try {
    const { email, oldPassword, newPassword } = req.body;

    const ca = await Ca.findOne({ email: email.toLowerCase() });
    if (!ca) return res.status(404).json({ message: "CA not found" });

    const match = await comparePassword(oldPassword, ca.password);
    if (!match) return res.status(400).json({ message: "Old password is incorrect" });

    ca.password = await hashPassword(newPassword);
    await ca.save();

    res.json({ message: "Password updated" });

  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

/**
 * RESET PASSWORD (no admin middleware)
 */
router.post("/:id/reset-password", async (req, res) => {
  try {
    const ca = await Ca.findById(req.params.id);
    if (!ca) return res.status(404).json({ message: "CA not found" });

    const newPass = generatePassword(10);
    ca.password = await hashPassword(newPass);
    await ca.save();

    res.json({ message: "Password reset", password: newPass });

  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});
router.get("/assigned/:caId", async (req, res) => {
  try {
    const { caId } = req.params;

    const cases = await Case.find({ assignedCA: caId })
      .sort({ createdAt: -1 });

    res.json(cases);

  } catch (error) {
    console.log("CA Assigned Cases Error:", error);
    res.status(500).json({ message: "Server error" });
  }
});
router.get("/case/:caseId", async (req, res) => {
  try {
    const caseData = await Case.findOne({ caseId: req.params.caseId });

    if (!caseData)
      return res.status(404).json({ message: "Case not found" });

    res.json(caseData);

  } catch (error) {
    console.log("CA Case Details Error:", error);
    res.status(500).json({ message: "Server error" });
  }
});
router.put("/status/:caseId", async (req, res) => {
  try {
    const { status } = req.body;

    const updated = await Case.findOneAndUpdate(
      { caseId: req.params.caseId },
      { status },
      { new: true }
    );

    if (!updated)
      return res.status(404).json({ message: "Case not found" });

    res.json({ message: "Case status updated", case: updated });

  } catch (error) {
    console.log("CA Status Update Error:", error);
    res.status(500).json({ message: "Server error" });
  }
});


module.exports = router;
