const nodeMailer = require("nodemailer");

const sendEmail = async (options) => {
  // 1. Create Transporter
  const transporter = nodeMailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true, // true for 465, false for other ports
    service: "gmail",
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASSWORD,
    },
  });

  // 2. Define Email Options
  const mailOptions = {
    from: process.env.SMTP_USER, // Sender address
    to: options.email, // Receiver address
    subject: options.subject,
    html: options.message, // HTML content
  };

  // 3. Send Email
  await transporter.sendMail(mailOptions);
};

module.exports = sendEmail;
