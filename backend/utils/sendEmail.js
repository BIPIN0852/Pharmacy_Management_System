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

// backend/utils/sendEmail.js
const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASSWORD, // Gmail App Password
  },
});

/**
 * Send an HTML email
 * @param {string} to - recipient email
 * @param {string} subject - email subject
 * @param {string} html - html body
 */
async function sendEmail(to, subject, html) {
  await transporter.sendMail({
    from: `"Smart Pharmacy" <${process.env.SMTP_USER}>`,
    to,
    subject,
    html,
  });
}

module.exports = sendEmail;
