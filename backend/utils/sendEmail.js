// import nodemailer from "nodemailer";

// export const sendEmail = async (to, subject, html) => {
//   const transporter = nodemailer.createTransport({
//     service: "gmail",
//     auth: {
//       user: process.env.SMTP_USER,
//       pass: process.env.SMTP_PASS, // use Gmail App Password
//     },
//   });

//   await transporter.sendMail({
//     from: `"SkillEdge" <${process.env.SMTP_USER}>`,
//     to,
//     subject,
//     html,
//   });
// };

// // backend/utils/sendEmail.js
// const nodemailer = require("nodemailer");

// const transporter = nodemailer.createTransport({
//   service: "gmail",
//   auth: {
//     user: process.env.SMTP_USER,
//     pass: process.env.SMTP_PASSWORD, // Gmail App Password
//   },
// });

// /**
//  * Send an HTML email
//  * @param {string} to - recipient email
//  * @param {string} subject - email subject
//  * @param {string} html - html body
//  */
// async function sendEmail(to, subject, html) {
//   await transporter.sendMail({
//     from: `"Smart Pharmacy" <${process.env.SMTP_USER}>`,
//     to,
//     subject,
//     html,
//   });
// }

// module.exports = sendEmail;

// const nodemailer = require("nodemailer");

// const transporter = nodemailer.createTransport({
//   host: "smtp.gmail.com", // Explicit host is safer
//   port: 587,
//   secure: false,
//   auth: {
//     user: process.env.SMTP_USER,
//     pass: process.env.SMTP_PASSWORD,
//   },
// });

// const sendEmail = async (to, subject, htmlContent) => {
//   try {
//     await transporter.sendMail({
//       from: `"Smart Pharmacy" <${process.env.SMTP_USER}>`,
//       to,
//       subject,
//       html: htmlContent, // ✅ Supports HTML templates
//     });
//     console.log(`📧 Email sent to ${to}`);
//   } catch (error) {
//     console.error("❌ Email send error:", error);
//   }
// };

// module.exports = sendEmail;

// const nodeMailer = require("nodemailer");

// const sendEmail = async (options) => {
//   // 1. Create Transporter
//   const transporter = nodeMailer.createTransport({
//     host: process.env.SMPT_HOST,
//     port: process.env.SMPT_PORT,
//     service: process.env.SMPT_SERVICE, // e.g., "gmail"
//     auth: {
//       user: process.env.SMPT_MAIL, // Your email
//       pass: process.env.SMPT_PASSWORD, // Your app password
//     },
//   });

//   // 2. Define Email Options
//   const mailOptions = {
//     from: process.env.SMPT_MAIL,
//     to: options.email, // ✅ This must match the key passed from your routes
//     subject: options.subject,
//     html: options.message, // Using 'html' allows for formatted text
//   };

//   // 3. Send Email
//   // We do NOT use try/catch here so the error bubbles up to the route handler
//   await transporter.sendMail(mailOptions);
// };

// module.exports = sendEmail;

// const nodeMailer = require("nodemailer");

// const sendEmail = async (options) => {
//   const transporter = nodeMailer.createTransport({
//     host: process.env.SMPT_HOST,
//     port: process.env.SMPT_PORT,
//     service: process.env.SMPT_SERVICE,
//     auth: {
//       user: process.env.SMPT_MAIL,
//       pass: process.env.SMPT_PASSWORD,
//     },
//   });

//   const mailOptions = {
//     from: process.env.SMPT_MAIL,
//     to: options.email, // ✅ Must be 'to', not 'email'
//     subject: options.subject,
//     html: options.message, // ✅ Must use 'html' for your template to render
//   };

//   await transporter.sendMail(mailOptions);
// };

// module.exports = sendEmail;

const nodeMailer = require("nodemailer");

const sendEmail = async (options) => {
  // 1. Create Transporter
  const transporter = nodeMailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true, // true for 465, false for other ports
    service: "gmail",
    auth: {
      user: process.env.SMTP_USER, // ✅ Matches your .env
      pass: process.env.SMTP_PASSWORD, // ✅ Matches your .env
    },
  });

  // 2. Define Email Options
  const mailOptions = {
    from: process.env.SMTP_USER, // ✅ Sender address
    to: options.email, // Receiver address
    subject: options.subject,
    html: options.message, // HTML content
  };

  // 3. Send Email
  await transporter.sendMail(mailOptions);
};

module.exports = sendEmail;
