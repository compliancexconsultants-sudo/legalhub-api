const express = require("express");
const User = require("../models/User");

const router = express.Router();
let mailer = null;
try {
  mailer = require("../utils/mailer");
} catch (e) {}
/**
 * SYNC USER USING FIREBASE DATA
 * Called after frontend Firebase login
 */
router.post("/sync", async (req, res) => {
  try {
    const { firebaseUid, name, email, phone, photoURL } = req.body;

    if (!firebaseUid || !email) {
      return res
        .status(400)
        .json({ message: "firebaseUid and email are required" });
    }
    console.log(mailer);

    let user = await User.findOne({ firebaseUid });
   if (mailer) {
  try {
    await mailer.sendEmail(
      email,
      "Welcome to ComplianceX Consultants – Your Account Is Ready",
      `
  <div style="font-family: Arial, Helvetica, sans-serif; line-height: 1.7; color: #333;">

    <div style="text-align:center; margin-bottom: 25px;">
      <img 
        src="https://i.ibb.co/tMxVcmXk/logo-c68af2baf2cd6c827066.png"
        alt="ComplianceX Logo"
        style="max-width: 220px;"
      />
    </div>

    <h2 style="color:#203560; text-align:center;">
      Welcome to ComplianceX Consultants
    </h2>

    <p>Hello <strong>${name}</strong>,</p>

    <p>
      Welcome to <strong>ComplianceX Consultants</strong>.
      Your account has been successfully created. ComplianceX Consultants is a professional
      compliance and regulatory support platform designed to help businesses and individuals
      manage legal and statutory requirements efficiently.
    </p>

    <h3 style="color:#203560;">Services Available:</h3>
    <ul>
      <li>Company Registration (Pvt Ltd, LLP, OPC, Partnership)</li>
      <li>GST Registration, Returns & Compliance</li>
      <li>MSME (Udyam) Registration</li>
      <li>Trade License & Shop Establishment</li>
      <li>Labour Law Registrations & Compliance</li>
      <li>Civil Contractor License (PWD / KPWD / CPWD)</li>
      <li>Professional Tax (PT) Registration & Returns</li>
      <li>ROC Filings & Annual Compliance</li>
      <li>Other Central & State Government Licenses</li>
    </ul>

    <h3 style="color:#203560;">Your Login Details:</h3>
    <ul>
      <li><strong>Registered Email:</strong> ${email}</li>
    </ul>

    <p>
      Please log in and update your password immediately to secure your account.
    </p>

    <p>
      👉 <a href="https://compliancexconsultants.in/login" target="_blank" style="color:#199A8D;">
        Login to Dashboard
      </a>
    </p>

    <p>
      Once logged in, you can submit applications, upload documents securely,
      track progress, and receive real-time updates.
    </p>

    <h3 style="color:#203560;">Support</h3>
    <p>
      📧 support@compliancexconsultants.in<br/>
      📞 +91-XXXXXXXXXX<br/>
      🌐 https://compliancexconsultants.in/
    </p>

    <p>
      Thank you for choosing <strong>ComplianceX Consultants</strong>.
      We look forward to supporting your compliance needs.
    </p>

    <p>
      Warm regards,<br/>
      <strong>Team ComplianceX Consultants</strong>
    </p>

  </div>
      `
    );
  } catch (e) {
    console.log("Mailer error:", e);
  }
}

    if (user) {
      // update user
      user.name = name || user.name;
      user.email = email || user.email;
      user.phone = phone || user.phone;
      user.photoURL = photoURL || user.photoURL;
      await user.save();
    } else {
      // new user
      user = await User.create({
        firebaseUid,
        name,
        email,
        phone,
        photoURL,
      });
    }

    res.json({ message: "User synced successfully", user });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
