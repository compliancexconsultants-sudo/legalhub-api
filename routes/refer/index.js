const express = require("express");
const router = express.Router();
let mailer = null;

try {
  mailer = require("../../utils/mailer");
} catch (e) {}

router.post("/refer", async (req, res) => {
  try {
    const { name, email, phone, referrerName, referrerMobile } = req.body;

    if (!mailer) {
      return res.json({ success: true });
    }

    /* ================= CLIENT EMAIL ================= */
    const clientEmailHTML = `
    <div style="font-family: Arial, sans-serif; line-height:1.7; color:#333;">
      
      <div style="text-align:center;margin-bottom:20px;">
        <img src="https://i.ibb.co/tMxVcmXk/logo-c68af2baf2cd6c827066.png" 
             style="max-width:200px;" />
      </div>

      <h2 style="color:#203560;text-align:center;">
        Welcome to ComplianceX Consultants
      </h2>

      <p>Hello <strong>${name}</strong>,</p>

      <p>
        You have been successfully referred by 
        <strong>${referrerName}</strong> to <strong>ComplianceX Consultants</strong>.
      </p>

      <p>
        We specialize in helping individuals and businesses with:
      </p>

      <ul>
        <li>Company Registration</li>
        <li>GST Registration & Filing</li>
        <li>Income Tax Return (ITR)</li>
        <li>MSME, DSC, Licenses & Compliance</li>
      </ul>

      <p>
        Our compliance expert will contact you shortly 
      </p>

      <div style="background:#f3f7ff;padding:15px;border-radius:8px;">
        <p><strong>Your Registered Details:</strong></p>
        <p>Email: ${email}</p>
        <p>Mobile: ${phone}</p>
      </div>

      <p>
        If you have any questions, feel free to contact us at:
      </p>

      <p>
        📧 compliancexconsultants@gmail.com <br/>
        📞 +91-8310792708
      </p>

      <p>
        Thank you for choosing <strong>ComplianceX Consultants</strong>.
      </p>

      <p>
        Warm regards,<br/>
        Team ComplianceX
      </p>

    </div>
    `;

    await mailer.sendEmail(
      email,
      "You Have Been Referred to ComplianceX Consultants",
      clientEmailHTML
    );

    /* ================= ADMIN EMAIL ================= */
    const adminEmailHTML = `
    <div style="font-family:Arial,sans-serif;color:#333;line-height:1.6;">
      
      <h2 style="color:#203560;">New Referral Received</h2>

      <p>A new referral has been submitted.</p>

      <table style="width:100%;border-collapse:collapse;">
        <tr>
          <td style="padding:8px;border:1px solid #ddd;"><strong>Client Name</strong></td>
          <td style="padding:8px;border:1px solid #ddd;">${name}</td>
        </tr>
        <tr>
          <td style="padding:8px;border:1px solid #ddd;"><strong>Email</strong></td>
          <td style="padding:8px;border:1px solid #ddd;">${email}</td>
        </tr>
        <tr>
          <td style="padding:8px;border:1px solid #ddd;"><strong>Phone</strong></td>
          <td style="padding:8px;border:1px solid #ddd;">${phone}</td>
        </tr>
       
        <tr>
          <td style="padding:8px;border:1px solid #ddd;"><strong>Referred By</strong></td>
          <td style="padding:8px;border:1px solid #ddd;">${referrerName}</td>
        </tr>
      </table>

      <p style="margin-top:20px;">
        Please follow up with the client and update referral payment once the client completes payment.
      </p>

    </div>
    `;

    await mailer.sendEmail(
      "compliancexconsultants@gmail.com",
      "New Referral – Action Required",
      adminEmailHTML
    );

    res.json({ success: true });

  } catch (err) {
    console.error("Referral sync error:", err);
    res.status(500).json({ success: false });
  }
});

module.exports = router;
