const express = require("express");
const multer = require("multer");
const Case = require("../../models/Case");
const User = require("../../models/User");
const uploadToImgBB = require("../../utils/uploadToImgBB");
const { sendEmail } = require("../../utils/mailer");

const router = express.Router();

const upload = multer({ storage: multer.memoryStorage() });

// Create case ID
function generateCaseId(serviceSlug) {
  const rand = Math.floor(10000 + Math.random() * 90000);
  return `LH-${serviceSlug.toUpperCase()}-${rand}`;
}
function buildAdminEmail(caseData) {
  const { caseId, serviceName, user, fields, documents } = caseData;

  let fieldsHtml = fields
    .map(
      (f) => `
    <tr>
      <td style="padding:8px;border:1px solid #ddd">${f.key}</td>
      <td style="padding:8px;border:1px solid #ddd">${f.value}</td>
    </tr>
  `
    )
    .join("");

  let docsHtml = documents
    .map(
      (d) => `
    <tr>
      <td style="padding:8px;border:1px solid #ddd">${d.key}</td>
      <td style="padding:8px;border:1px solid #ddd">
        <a href="${d.file}" target="_blank">View / Download</a>
      </td>
    </tr>
  `
    )
    .join("");

  return `
    <h2>📂 New Case Submitted – ${caseId}</h2>

    <h3>👤 Client Details</h3>
    <p>
      <strong>Name:</strong> ${user.name}<br/>
      <strong>Email:</strong> ${user.email}<br/>
      <strong>Phone:</strong> ${user.phone}
    </p>

    <h3>🧾 Service</h3>
    <p><strong>${serviceName}</strong></p>

    <h3>📝 Form Fields</h3>
    <table cellpadding="0" cellspacing="0">
      ${fieldsHtml || "<tr><td>No extra fields</td></tr>"}
    </table>

    <h3>📎 Documents</h3>
    <table cellpadding="0" cellspacing="0">
      ${docsHtml}
    </table>

    <p style="margin-top:20px">
      <strong>ComplianceX Consultants Admin Panel</strong><br/>
      This is an automated notification.
    </p>
  `;
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
        file: url,
      });
    }

    // Non-file fields
    Object.keys(req.body).forEach((key) => {
      if (["serviceName", "serviceSlug", "userId"].includes(key)) return;

      fields.push({
        key,
        value: req.body[key],
        isFile: false,
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
        phone: user.phone,
      },
      fields,
      documents,
      status: "pending",
    });

    // 📧 Send admin email
    const emailHtml = buildAdminEmail(newCase);

    await sendEmail(
      "compliancexconsultants@gmail.com",
      `📥 New Case Received – ${newCase.caseId}`,
      emailHtml
    );

    res.json({ message: "Case submitted successfully", case: newCase });
  } catch (error) {
    console.log("CASE SUBMIT ERROR:", error);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
