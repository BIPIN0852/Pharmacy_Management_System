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

// const nodeMailer = require("nodemailer");

// const sendEmail = async (options) => {
//   // 0. Validate SMTP credentials
//   const smtpUser = process.env.SMTP_USER;
//   const smtpPass = process.env.SMTP_PASSWORD;

//   if (!smtpUser || !smtpPass) {
//     console.error("❌ SMTP credentials missing!");
//     console.error("  SMTP_USER:", smtpUser ? "SET" : "NOT SET");
//     console.error("  SMTP_PASSWORD:", smtpPass ? "SET" : "NOT SET");
//     throw new Error(
//       "Email service not configured. SMTP_USER or SMTP_PASSWORD environment variable is missing.",
//     );
//   }

//   // 1. Create Transporter
//   // FIX 1: Removed conflicting `service: "gmail"` — use host+port only
//   // FIX 2: Changed port 465/secure:true → port 587/secure:false (STARTTLS)
//   //         Port 465 with wrong credentials hangs silently; 587 fails fast
//   // FIX 3: Added connectionTimeout, greetingTimeout, socketTimeout
//   //         so it throws an error within ~8s instead of hanging for 60s
//   const transporter = nodeMailer.createTransport({
//     host: "smtp.gmail.com",
//     port: 465,
//     secure: true, // true for 465, false for other ports
//     auth: {
//       user: smtpUser,
//       pass: smtpPass, // Must be a Gmail App Password, NOT your real password
//     },
//     connectionTimeout: 8000, // give up connecting after 8s
//     greetingTimeout: 8000, // give up on SMTP greeting after 8s
//     socketTimeout: 10000, // give up if socket goes silent for 10s
//   });

//   // 2. Verify connection before sending — throws a clear error fast
//   //    instead of hanging silently on bad credentials
//   try {
//     await transporter.verify();
//   } catch (verifyErr) {
//     console.error("❌ SMTP connection failed:", verifyErr.message);

//     // Provide actionable error messages for the most common failures
//     if (
//       verifyErr.message.includes("535") ||
//       verifyErr.message.includes("Invalid login") ||
//       verifyErr.message.includes("Username and Password")
//     ) {
//       throw new Error(
//         "Gmail login failed (535). SMTP_PASSWORD must be a Gmail App Password, " +
//           "not your real Gmail password. Generate one at: " +
//           "myaccount.google.com → Security → 2-Step Verification → App Passwords.",
//       );
//     }

//     if (verifyErr.message.includes("timeout")) {
//       throw new Error(
//         "SMTP connection timed out. Check your internet connection or firewall.",
//       );
//     }

//     if (verifyErr.message.includes("ECONNREFUSED")) {
//       throw new Error(
//         "Gmail SMTP refused connection. Check host (smtp.gmail.com) and port (587).",
//       );
//     }

//     throw verifyErr; // re-throw unknown errors as-is
//   }

//   // 3. Define Email Options
//   const mailOptions = {
//     from: `"Smart Pharmacy" <${smtpUser}>`,
//     to: options.email,
//     subject: options.subject,
//     html: options.message,
//   };

//   // 4. Send Email
//   console.log(
//     `📧 Sending email to: ${options.email} | Subject: ${options.subject}`,
//   );
//   const info = await transporter.sendMail(mailOptions);
//   console.log(`✅ Email sent successfully! MessageID: ${info.messageId}`);
//   return info;
// };

// module.exports = sendEmail;

// const nodeMailer = require("nodemailer");

// const sendEmail = async (options) => {
//   // 0. Validate SMTP credentials
//   // ✅ FIXED: now reads EMAIL_USER and EMAIL_PASS to match your .env
//   const smtpUser = process.env.EMAIL_USER;
//   const smtpPass = process.env.EMAIL_PASS;

//   if (!smtpUser || !smtpPass) {
//     console.error("❌ SMTP credentials missing!");
//     console.error("  EMAIL_USER:", smtpUser ? "SET" : "NOT SET");
//     console.error("  EMAIL_PASS:", smtpPass ? "SET" : "NOT SET");
//     throw new Error(
//       "Email service not configured. EMAIL_USER or EMAIL_PASS environment variable is missing.",
//     );
//   }

//   // 1. Create Transporter
//   const transporter = nodeMailer.createTransport({
//     host: "smtp.gmail.com",
//     port: 587, // ✅ 587 + secure:false = STARTTLS (works on Render)
//     secure: false, // ✅ must be false for port 587
//     auth: {
//       user: smtpUser,
//       pass: smtpPass,
//     },
//     connectionTimeout: 8000,
//     greetingTimeout: 8000,
//     socketTimeout: 10000,
//   });

//   // 2. Verify connection before sending
//   try {
//     await transporter.verify();
//   } catch (verifyErr) {
//     console.error("❌ SMTP connection failed:", verifyErr.message);

//     if (
//       verifyErr.message.includes("535") ||
//       verifyErr.message.includes("Invalid login") ||
//       verifyErr.message.includes("Username and Password")
//     ) {
//       throw new Error(
//         "Gmail login failed (535). EMAIL_PASS must be a Gmail App Password, " +
//           "not your real Gmail password. Generate one at: " +
//           "myaccount.google.com → Security → 2-Step Verification → App Passwords.",
//       );
//     }

//     if (verifyErr.message.includes("timeout")) {
//       throw new Error(
//         "SMTP connection timed out. Render.com blocks port 465 — ensure you are using port 587.",
//       );
//     }

//     if (verifyErr.message.includes("ECONNREFUSED")) {
//       throw new Error(
//         "Gmail SMTP refused connection. Check host (smtp.gmail.com) and port (587).",
//       );
//     }

//     throw verifyErr;
//   }

//   // 3. Define Email Options
//   const mailOptions = {
//     from: `"Smart Pharmacy" <${smtpUser}>`,
//     to: options.email,
//     subject: options.subject,
//     html: options.message,
//   };

//   // 4. Send Email
//   console.log(
//     `📧 Sending email to: ${options.email} | Subject: ${options.subject}`,
//   );
//   const info = await transporter.sendMail(mailOptions);
//   console.log(`✅ Email sent successfully! MessageID: ${info.messageId}`);
//   return info;
// };

// module.exports = sendEmail;

const nodeMailer = require("nodemailer");

// ============================================================
// STRATEGY: Try Resend API first (works on Render free tier)
// Falls back to Nodemailer SMTP if RESEND_API_KEY is not set
// (useful for local development)
// ============================================================

const sendEmail = async (options) => {
  // ── OPTION 1: Resend API (HTTP, works on Render) ──────────
  if (process.env.RESEND_API_KEY) {
    const { Resend } = require("resend");
    const resend = new Resend(process.env.RESEND_API_KEY);

    const { data, error } = await resend.emails.send({
      from: "Smart Pharmacy <onboarding@resend.dev>", // works without domain verification
      to: [options.email],
      subject: options.subject,
      html: options.message,
    });

    if (error) {
      console.error("❌ Resend error:", error);
      throw new Error(error.message || "Failed to send email via Resend");
    }

    console.log(
      `✅ Email sent via Resend to ${options.email} | id: ${data.id}`,
    );
    return data;
  }

  // ── OPTION 2: Nodemailer SMTP (works locally, blocked on Render) ──
  const smtpUser = process.env.EMAIL_USER;
  const smtpPass = process.env.EMAIL_PASS;

  if (!smtpUser || !smtpPass) {
    console.error("❌ No email service configured!");
    console.error("   Either set RESEND_API_KEY (recommended for Render)");
    console.error("   or set EMAIL_USER + EMAIL_PASS (local development only)");
    throw new Error(
      "Email service not configured. Set RESEND_API_KEY in your environment variables.",
    );
  }

  const transporter = nodeMailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false,
    auth: {
      user: smtpUser,
      pass: smtpPass,
    },
    connectionTimeout: 8000,
    greetingTimeout: 8000,
    socketTimeout: 10000,
  });

  try {
    await transporter.verify();
  } catch (verifyErr) {
    console.error("❌ SMTP verify failed:", verifyErr.message);

    if (
      verifyErr.message.includes("535") ||
      verifyErr.message.includes("Invalid login")
    ) {
      throw new Error(
        "Gmail login failed. EMAIL_PASS must be a Gmail App Password, not your real password. " +
          "Generate at: myaccount.google.com → Security → App Passwords",
      );
    }
    if (verifyErr.message.includes("timeout")) {
      throw new Error(
        "SMTP timed out. If you are on Render, SMTP is blocked — set RESEND_API_KEY instead.",
      );
    }
    throw verifyErr;
  }

  const info = await transporter.sendMail({
    from: `"Smart Pharmacy" <${smtpUser}>`,
    to: options.email,
    subject: options.subject,
    html: options.message,
  });

  console.log(
    `✅ Email sent via SMTP to ${options.email} | id: ${info.messageId}`,
  );
  return info;
};

module.exports = sendEmail;
