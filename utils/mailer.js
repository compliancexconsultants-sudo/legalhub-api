// utils/mailer.js
const nodemailer = require("nodemailer");

let transporter = null;

function createTransporter() {
  if (transporter) return transporter;

  // Create transporter using env settings
  transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT) || 587,
    secure: process.env.SMTP_SECURE === "true", // true = 465
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });

  return transporter;
}

async function sendEmail(to, subject, html) {
  const mailer = createTransporter();

  const mailOptions = {
    from: process.env.EMAIL_FROM,
    to,
    subject,
    html,
  };

  return mailer.sendMail(mailOptions);
}

module.exports = { sendEmail };
