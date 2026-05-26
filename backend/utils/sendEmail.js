const nodeMailer = require("nodemailer");

const sendEmail = async (options) => {
  // 0. Validate SMTP credentials exist
  const smtpUser = process.env.SMTP_USER;
  const smtpPass = process.env.SMTP_PASSWORD;

  if (!smtpUser || !smtpPass) {
    console.error("❌ SMTP credentials missing!");
    console.error("  SMTP_USER:", smtpUser ? "SET" : "NOT SET");
    console.error("  SMTP_PASSWORD:", smtpPass ? "SET" : "NOT SET");
    throw new Error(
      "Email service not configured. SMTP_USER or SMTP_PASSWORD environment variable is missing."
    );
  }

  // 1. Create Transporter
  const transporter = nodeMailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true, // true for 465, false for other ports
    service: "gmail",
    auth: {
      user: smtpUser,
      pass: smtpPass,
    },
  });

  // 2. Define Email Options
  const mailOptions = {
    from: smtpUser, // Sender address
    to: options.email, // Receiver address
    subject: options.subject,
    html: options.message, // HTML content
  };

  // 3. Send Email
  console.log(`📧 Sending email to: ${options.email} | Subject: ${options.subject}`);
  const info = await transporter.sendMail(mailOptions);
  console.log(`✅ Email sent successfully! MessageID: ${info.messageId}`);
  return info;
};

module.exports = sendEmail;

