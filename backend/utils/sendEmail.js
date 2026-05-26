// const nodeMailer = require("nodemailer");

// const sendEmail = async (options) => {
//   // 0. Validate SMTP credentials exist
//   const smtpUser = process.env.SMTP_USER;
//   const smtpPass = process.env.SMTP_PASSWORD;

//   if (!smtpUser || !smtpPass) {
//     console.error("❌ SMTP credentials missing!");
//     console.error("  SMTP_USER:", smtpUser ? "SET" : "NOT SET");
//     console.error("  SMTP_PASSWORD:", smtpPass ? "SET" : "NOT SET");
//     throw new Error(
//       "Email service not configured. SMTP_USER or SMTP_PASSWORD environment variable is missing."
//     );
//   }

//   // 1. Create Transporter
//   const transporter = nodeMailer.createTransport({
//     host: "smtp.gmail.com",
//     port: 465,
//     secure: true, // true for 465, false for other ports
//     service: "gmail",
//     auth: {
//       user: smtpUser,
//       pass: smtpPass,
//     },
//   });

//   // 2. Define Email Options
//   const mailOptions = {
//     from: smtpUser, // Sender address
//     to: options.email, // Receiver address
//     subject: options.subject,
//     html: options.message, // HTML content
//   };

//   // 3. Send Email
//   console.log(`📧 Sending email to: ${options.email} | Subject: ${options.subject}`);
//   const info = await transporter.sendMail(mailOptions);
//   console.log(`✅ Email sent successfully! MessageID: ${info.messageId}`);
//   return info;
// };

// module.exports = sendEmail;

const nodeMailer = require("nodemailer");

const sendEmail = async (options) => {
  // 0. Validate SMTP credentials
  const smtpUser = process.env.SMTP_USER;
  const smtpPass = process.env.SMTP_PASSWORD;

  if (!smtpUser || !smtpPass) {
    console.error("❌ SMTP credentials missing!");
    console.error("  SMTP_USER:", smtpUser ? "SET" : "NOT SET");
    console.error("  SMTP_PASSWORD:", smtpPass ? "SET" : "NOT SET");
    throw new Error(
      "Email service not configured. SMTP_USER or SMTP_PASSWORD environment variable is missing.",
    );
  }

  // 1. Create Transporter
  // FIX 1: Removed conflicting `service: "gmail"` — use host+port only
  // FIX 2: Changed port 465/secure:true → port 587/secure:false (STARTTLS)
  //         Port 465 with wrong credentials hangs silently; 587 fails fast
  // FIX 3: Added connectionTimeout, greetingTimeout, socketTimeout
  //         so it throws an error within ~8s instead of hanging for 60s
  const transporter = nodeMailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false, // false = STARTTLS on port 587 (correct for Gmail)
    auth: {
      user: smtpUser,
      pass: smtpPass, // Must be a Gmail App Password, NOT your real password
    },
    connectionTimeout: 8000, // give up connecting after 8s
    greetingTimeout: 8000, // give up on SMTP greeting after 8s
    socketTimeout: 10000, // give up if socket goes silent for 10s
  });

  // 2. Verify connection before sending — throws a clear error fast
  //    instead of hanging silently on bad credentials
  try {
    await transporter.verify();
  } catch (verifyErr) {
    console.error("❌ SMTP connection failed:", verifyErr.message);

    // Provide actionable error messages for the most common failures
    if (
      verifyErr.message.includes("535") ||
      verifyErr.message.includes("Invalid login") ||
      verifyErr.message.includes("Username and Password")
    ) {
      throw new Error(
        "Gmail login failed (535). SMTP_PASSWORD must be a Gmail App Password, " +
          "not your real Gmail password. Generate one at: " +
          "myaccount.google.com → Security → 2-Step Verification → App Passwords.",
      );
    }

    if (verifyErr.message.includes("timeout")) {
      throw new Error(
        "SMTP connection timed out. Check your internet connection or firewall.",
      );
    }

    if (verifyErr.message.includes("ECONNREFUSED")) {
      throw new Error(
        "Gmail SMTP refused connection. Check host (smtp.gmail.com) and port (587).",
      );
    }

    throw verifyErr; // re-throw unknown errors as-is
  }

  // 3. Define Email Options
  const mailOptions = {
    from: `"Smart Pharmacy" <${smtpUser}>`,
    to: options.email,
    subject: options.subject,
    html: options.message,
  };

  // 4. Send Email
  console.log(
    `📧 Sending email to: ${options.email} | Subject: ${options.subject}`,
  );
  const info = await transporter.sendMail(mailOptions);
  console.log(`✅ Email sent successfully! MessageID: ${info.messageId}`);
  return info;
};

module.exports = sendEmail;
