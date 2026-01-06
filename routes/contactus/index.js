const mailer = require("../../utils/mailer");
const express = require("express");
const router = express.Router();

router.post("/contact", async (req, res) => {
  const { name, email, phoneNumber } = req.body;

  try {
    // 1️⃣ MAIL TO YOUR TEAM
    await mailer.sendEmail(
      "compliancexconsultants@gmail.com",
      "New Contact Enquiry - Complix Website",
      `
      <div style="font-family: Arial">
        <h2>New Enquiry Received</h2>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Phone:</strong> ${phoneNumber || "N/A"}</p>
      </div>
      `
    );

    // 2️⃣ AUTO REPLY TO USER
    await mailer.sendEmail(
      email,
      "Thank You for Contacting Complix",
      `
      <div style="font-family: Arial; line-height:1.6;">
        <h2 style="color:#199A8D;">Thank You for Reaching Out!</h2>
        <p>Hello ${name},</p>
        <p>
          Thank you for contacting <strong>Complix</strong>. 
          Our team has received your enquiry and one of our representatives 
          will get in touch with you within the next <strong>24 hours</strong>.
        </p>
        <p>If anything is urgent, feel free to reply to this email.</p>
        <p>Regards,<br/>Team Complix</p>
      </div>
      `
    );

    return res.json({
      success: true,
      message: "Contact enquiry submitted & emails sent successfully"
    });

  } catch (err) {
    console.log("Mailer error:", err);
    return res.status(500).json({
      success: false,
      message: "Failed to send emails"
    });
  }
});

module.exports = router;
