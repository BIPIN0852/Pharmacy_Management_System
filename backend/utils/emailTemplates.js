// backend/utils/emailTemplates.js

const getEmailTemplate = (userName, content, otpCode = null) => {
  return `
<!DOCTYPE html>
<html>
<head>
  <style>
    body { font-family: 'Arial', sans-serif; background-color: #f4f4f4; margin: 0; padding: 0; }
    .container { max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 10px rgba(0,0,0,0.1); }
    .header { background-color: #0d6efd; padding: 20px; text-align: center; color: #ffffff; }
    .header h1 { margin: 0; font-size: 24px; }
    .content { padding: 30px 20px; color: #333333; line-height: 1.6; }
    .otp-box { background-color: #eef2ff; border: 1px dashed #0d6efd; padding: 15px; text-align: center; font-size: 24px; font-weight: bold; letter-spacing: 5px; color: #0d6efd; margin: 20px 0; border-radius: 5px; }
    .footer { background-color: #f8f9fa; padding: 20px; text-align: center; font-size: 12px; color: #888888; border-top: 1px solid #eeeeee; }
    .footer a { color: #0d6efd; text-decoration: none; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>💊 Smart Pharmacy</h1>
    </div>
    <div class="content">
      <h2>Hello, ${userName}</h2>
      <p>${content}</p>
      ${otpCode ? `<div class="otp-box">${otpCode}</div>` : ""}
      <p>If you did not request this, please ignore this email.</p>
      <br>
      <p>Best regards,<br><strong>The Smart Pharmacy Team</strong></p>
    </div>
    <div class="footer">
      <p>123 Health Street, Bagmati Province, Nepal</p>
      <p>&copy; ${new Date().getFullYear()} Smart Pharmacy System. All rights reserved.</p>
    </div>
  </div>
</body>
</html>
  `;
};

module.exports = { getEmailTemplate };
