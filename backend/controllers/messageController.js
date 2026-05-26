// const asyncHandler = require("express-async-handler");
// const Message = require("../models/Message");
// const sendEmail = require("../utils/sendEmail");

// // ===================================================================
// // 🛠️ PART 1: ADMIN & CUSTOMER SUPPORT TICKETS
// // ===================================================================

// const sendMessage = asyncHandler(async (req, res) => {
//   const { name, email, text } = req.body;

//   if (!name || !email || !text) {
//     res.status(400);
//     throw new Error("Please fill all fields");
//   }

//   const message = await Message.create({
//     name,
//     email,
//     text,
//     userId: req.user ? req.user._id : null,
//   });

//   res.status(201).json(message);
// });

// const getMessages = asyncHandler(async (req, res) => {
//   const messages = await Message.find({}).sort({ createdAt: -1 });
//   res.json(messages);
// });

// const markMessageAsRead = asyncHandler(async (req, res) => {
//   const message = await Message.findById(req.params.id);
//   if (message) {
//     message.isRead = true;
//     const updatedMessage = await message.save();
//     res.json(updatedMessage);
//   } else {
//     res.status(404);
//     throw new Error("Message not found");
//   }
// });

// const getMyMessages = asyncHandler(async (req, res) => {
//   const messages = await Message.find({
//     $or: [
//       { userId: req.user._id },
//       { receiver: req.user._id },
//       { sender: req.user._id },
//     ],
//   }).sort({ createdAt: -1 });

//   res.json(messages);
// });

// const replyToMessage = asyncHandler(async (req, res) => {
//   const { replyText } = req.body;
//   const message = await Message.findById(req.params.id);

//   if (message) {
//     message.adminReply = replyText;
//     message.isRead = true;
//     message.isReplyRead = false;
//     await message.save();

//     try {
//       await sendEmail({
//         email: message.email,
//         subject: "Reply to your inquiry - Smart Pharmacy",
//         message: `
//           <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #e0e0e0; border-radius: 8px; overflow: hidden;">
//             <div style="background-color: #2563eb; color: white; padding: 20px; text-align: center;">
//               <h2 style="margin: 0;">Smart Pharmacy Support</h2>
//             </div>
//             <div style="padding: 20px;">
//               <p>Hello <strong>${message.name}</strong>,</p>
//               <p>Our support team has replied to your recent message:</p>
//               <div style="background-color: #f8fafc; border-left: 4px solid #2563eb; padding: 15px; margin: 20px 0; border-radius: 4px;">
//                 <p style="margin: 0; color: #334155;"><strong>Your Message:</strong><br/> "${message.text}"</p>
//               </div>
//               <div style="background-color: #ecfdf5; border-left: 4px solid #10b981; padding: 15px; margin: 20px 0; border-radius: 4px;">
//                 <p style="margin: 0; color: #065f46;"><strong>Admin Reply:</strong><br/> "${replyText}"</p>
//               </div>
//             </div>
//           </div>
//         `,
//       });
//     } catch (error) {
//       console.error("Email failed to send", error);
//     }

//     res.json(message);
//   } else {
//     res.status(404);
//     throw new Error("Message not found");
//   }
// });

// const markReplyAsRead = asyncHandler(async (req, res) => {
//   const message = await Message.findById(req.params.id);

//   if (
//     message &&
//     message.userId &&
//     message.userId.toString() === req.user._id.toString()
//   ) {
//     message.isReplyRead = true;
//     await message.save();
//     res.json(message);
//   } else {
//     res.status(404);
//     throw new Error("Message not found or not authorized");
//   }
// });

// // ===================================================================
// // 🩺 PART 2: DOCTOR & PATIENT REAL-TIME APPOINTMENT CHAT
// // ===================================================================

// const getAppointmentMessages = asyncHandler(async (req, res) => {
//   const messages = await Message.find({
//     appointment: req.params.appointmentId,
//   }).sort({ createdAt: 1 });

//   // Only auto-read messages if it is NOT a background notification poll!
//   if (req.query.background !== "true") {
//     const unreadMessages = messages.filter(
//       (m) =>
//         m.sender &&
//         m.sender.toString() !== req.user._id.toString() &&
//         m.isRead === false,
//     );

//     if (unreadMessages.length > 0) {
//       await Message.updateMany(
//         {
//           appointment: req.params.appointmentId,
//           sender: { $ne: req.user._id },
//           isRead: false,
//         },
//         { $set: { isRead: true } },
//       );
//     }
//   }

//   res.json(messages);
// });

// const sendAppointmentMessage = asyncHandler(async (req, res) => {
//   const { appointmentId, receiverId, text, senderModel } = req.body;

//   if (!appointmentId || !text) {
//     res.status(400);
//     throw new Error("Please provide appointmentId and text");
//   }

//   const actualSenderModel =
//     senderModel || (req.user.role === "doctor" ? "Doctor" : "Patient");

//   const message = await Message.create({
//     appointment: appointmentId,
//     sender: req.user._id,
//     senderModel: actualSenderModel,
//     receiver: receiverId || null,
//     text,
//     isRead: false,
//   });

//   res.status(201).json(message);
// });

// const User = require("../models/User");

// // @desc    Admin sends direct message/email to a user
// // @route   POST /api/messages/send
// // @access  Private/Admin
// const sendDirectMessage = asyncHandler(async (req, res) => {
//   const { userId, subject, body } = req.body;

//   if (!userId || !body) {
//     return res.status(400).json({
//       success: false,
//       message: "userId and body are required fields.",
//     });
//   }

//   const user = await User.findById(userId);

//   if (!user) {
//     return res.status(404).json({
//       success: false,
//       message: "User not found",
//     });
//   }

//   try {
//     await sendEmail({
//       email: user.email,
//       subject: subject || "Message from Smart Pharmacy",
//       message: `
//         <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #e0e0e0; border-radius: 8px; overflow: hidden;">
//           <div style="background-color: #007185; color: white; padding: 20px; text-align: center;">
//             <h2 style="margin: 0;">Smart Pharmacy</h2>
//           </div>
//           <div style="padding: 20px; color: #333;">
//             <p>Hello <strong>${user.name}</strong>,</p>
//             <p style="line-height: 1.6;">${(body || "").replace(/\n/g, "<br/>")}</p>
//             <br/>
//             <p style="color: #666; font-size: 0.9em;">
//               Regards,<br/>
//               <strong>The Smart Pharmacy Team</strong>
//             </p>
//           </div>
//         </div>
//       `,
//     });

//     return res.status(200).json({
//       success: true,
//       message: "Message sent successfully",
//     });
//   } catch (error) {
//     console.error("❌ Email send error:", error.message);
//     return res.status(500).json({
//       success: false,
//       message: `Email failed to send: ${error.message}`,
//     });
//   }
// });
// module.exports = {
//   sendMessage,
//   getMessages,
//   markMessageAsRead,
//   getMyMessages,
//   replyToMessage,
//   markReplyAsRead,
//   getAppointmentMessages,
//   sendAppointmentMessage,
//   sendDirectMessage,
// };

const asyncHandler = require("express-async-handler");
const Message = require("../models/Message");
const sendEmail = require("../utils/sendEmail");
const User = require("../models/User");

// ===================================================================
// 🛠️ PART 1: ADMIN & CUSTOMER SUPPORT TICKETS
// ===================================================================

const sendMessage = asyncHandler(async (req, res) => {
  const { name, email, text } = req.body;

  if (!name || !email || !text) {
    res.status(400);
    throw new Error("Please fill all fields");
  }

  const message = await Message.create({
    name,
    email,
    text,
    userId: req.user ? req.user._id : null,
  });

  res.status(201).json(message);
});

const getMessages = asyncHandler(async (req, res) => {
  const messages = await Message.find({}).sort({ createdAt: -1 });
  res.json(messages);
});

const markMessageAsRead = asyncHandler(async (req, res) => {
  const message = await Message.findById(req.params.id);
  if (message) {
    message.isRead = true;
    const updatedMessage = await message.save();
    res.json(updatedMessage);
  } else {
    res.status(404);
    throw new Error("Message not found");
  }
});

const getMyMessages = asyncHandler(async (req, res) => {
  const messages = await Message.find({
    $or: [
      { userId: req.user._id },
      { receiver: req.user._id },
      { sender: req.user._id },
    ],
  }).sort({ createdAt: -1 });

  res.json(messages);
});

const replyToMessage = asyncHandler(async (req, res) => {
  const { replyText } = req.body;
  const message = await Message.findById(req.params.id);

  if (message) {
    message.adminReply = replyText;
    message.isRead = true;
    message.isReplyRead = false;
    await message.save();

    try {
      await sendEmail({
        email: message.email,
        subject: "Reply to your inquiry - Smart Pharmacy",
        message: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #e0e0e0; border-radius: 8px; overflow: hidden;">
            <div style="background-color: #2563eb; color: white; padding: 20px; text-align: center;">
              <h2 style="margin: 0;">Smart Pharmacy Support</h2>
            </div>
            <div style="padding: 20px;">
              <p>Hello <strong>${message.name}</strong>,</p>
              <p>Our support team has replied to your recent message:</p>
              <div style="background-color: #f8fafc; border-left: 4px solid #2563eb; padding: 15px; margin: 20px 0; border-radius: 4px;">
                <p style="margin: 0; color: #334155;"><strong>Your Message:</strong><br/> "${message.text}"</p>
              </div>
              <div style="background-color: #ecfdf5; border-left: 4px solid #10b981; padding: 15px; margin: 20px 0; border-radius: 4px;">
                <p style="margin: 0; color: #065f46;"><strong>Admin Reply:</strong><br/> "${replyText}"</p>
              </div>
            </div>
          </div>
        `,
      });
    } catch (error) {
      console.error("Email failed to send", error);
    }

    res.json(message);
  } else {
    res.status(404);
    throw new Error("Message not found");
  }
});

const markReplyAsRead = asyncHandler(async (req, res) => {
  const message = await Message.findById(req.params.id);

  if (
    message &&
    message.userId &&
    message.userId.toString() === req.user._id.toString()
  ) {
    message.isReplyRead = true;
    await message.save();
    res.json(message);
  } else {
    res.status(404);
    throw new Error("Message not found or not authorized");
  }
});

// ===================================================================
// 🩺 PART 2: DOCTOR & PATIENT REAL-TIME APPOINTMENT CHAT
// ===================================================================

const getAppointmentMessages = asyncHandler(async (req, res) => {
  const messages = await Message.find({
    appointment: req.params.appointmentId,
  }).sort({ createdAt: 1 });

  if (req.query.background !== "true") {
    const unreadMessages = messages.filter(
      (m) =>
        m.sender &&
        m.sender.toString() !== req.user._id.toString() &&
        m.isRead === false,
    );

    if (unreadMessages.length > 0) {
      await Message.updateMany(
        {
          appointment: req.params.appointmentId,
          sender: { $ne: req.user._id },
          isRead: false,
        },
        { $set: { isRead: true } },
      );
    }
  }

  res.json(messages);
});

const sendAppointmentMessage = asyncHandler(async (req, res) => {
  const { appointmentId, receiverId, text, senderModel } = req.body;

  if (!appointmentId || !text) {
    res.status(400);
    throw new Error("Please provide appointmentId and text");
  }

  const actualSenderModel =
    senderModel || (req.user.role === "doctor" ? "Doctor" : "Patient");

  const message = await Message.create({
    appointment: appointmentId,
    sender: req.user._id,
    senderModel: actualSenderModel,
    receiver: receiverId || null,
    text,
    isRead: false,
  });

  res.status(201).json(message);
});

// ===================================================================
// 📨 PART 3: ADMIN DIRECT MESSAGE — FIXED (no more 60s hang)
// ===================================================================

// Root cause: sendEmail utility had no SMTP timeouts set, so when
// Gmail credentials are wrong or SMTP is unreachable it hangs forever.
// Fix: bypass sendEmail utility here and use nodemailer directly
// with explicit connectionTimeout / socketTimeout so it fails fast.

const nodemailer = require("nodemailer");

// Helper: build a transporter that fails fast instead of hanging
const createTransporter = () => {
  if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
    throw new Error(
      "EMAIL_USER or EMAIL_PASS is not set in your .env file. " +
        "Add them and restart the server.",
    );
  }

  return nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false, // STARTTLS — must be false for port 587
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS, // Gmail App Password (16 chars), NOT your real password
    },
    connectionTimeout: 8000, // give up connecting after 8s
    greetingTimeout: 8000, // give up on SMTP greeting after 8s
    socketTimeout: 10000, // give up if socket goes silent for 10s
  });
};

// @desc    Admin sends a direct email to a customer
// @route   POST /api/messages/send
// @access  Private/Admin
const sendDirectMessage = async (req, res) => {
  const { userId, subject, body } = req.body;

  // 1. Validate
  if (!userId || !subject?.trim() || !body?.trim()) {
    return res.status(400).json({
      success: false,
      message: "userId, subject, and body are all required.",
    });
  }

  // 2. Find user
  let user;
  try {
    user = await User.findById(userId).select("email name");
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found." });
    }
  } catch (dbErr) {
    console.error("[sendDirectMessage] DB error:", dbErr.message);
    return res
      .status(500)
      .json({ success: false, message: "Database error: " + dbErr.message });
  }

  // 3. Build transporter — throws immediately if .env vars missing
  let transporter;
  try {
    transporter = createTransporter();
  } catch (configErr) {
    console.error("[sendDirectMessage] Config error:", configErr.message);
    return res.status(500).json({ success: false, message: configErr.message });
  }

  // 4. Verify SMTP connection — fails in ~8s with a clear error
  //    instead of hanging for 60s silently
  try {
    await transporter.verify();
  } catch (verifyErr) {
    console.error("[sendDirectMessage] SMTP verify failed:", verifyErr.message);

    let friendlyMsg = "Email service connection failed.";
    if (
      verifyErr.message.includes("Invalid login") ||
      verifyErr.message.includes("Username and Password") ||
      verifyErr.message.includes("535")
    ) {
      friendlyMsg =
        "Gmail login failed. Your EMAIL_PASS must be a Gmail App Password " +
        "(not your real password). Generate one at: " +
        "myaccount.google.com → Security → App Passwords.";
    } else if (verifyErr.message.includes("timeout")) {
      friendlyMsg =
        "SMTP connection timed out. Check your network or firewall.";
    } else if (verifyErr.message.includes("ECONNREFUSED")) {
      friendlyMsg =
        "Gmail SMTP refused the connection. Check EMAIL_HOST and port.";
    }

    return res.status(500).json({
      success: false,
      message: friendlyMsg,
      detail: verifyErr.message,
    });
  }

  // 5. Send the email
  try {
    const info = await transporter.sendMail({
      from: `"Smart Pharmacy Admin" <${process.env.EMAIL_USER}>`,
      to: user.email,
      subject: subject.trim(),
      text: body.trim(),
      html: `
        <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;border:1px solid #e0e0e0;border-radius:8px;overflow:hidden;">
          <div style="background-color:#007185;color:white;padding:20px;text-align:center;">
            <h2 style="margin:0;">Smart Pharmacy</h2>
          </div>
          <div style="padding:20px;color:#333;">
            <p>Hello <strong>${user.name}</strong>,</p>
            <p style="line-height:1.7;white-space:pre-wrap;">${body.trim().replace(/\n/g, "<br/>")}</p>
            <br/>
            <p style="color:#666;font-size:0.9em;">
              Regards,<br/>
              <strong>The Smart Pharmacy Team</strong>
            </p>
          </div>
        </div>
      `,
    });

    console.log(
      `[sendDirectMessage] ✅ Sent to ${user.email} | id: ${info.messageId}`,
    );

    return res.status(200).json({
      success: true,
      message: `Message sent successfully to ${user.name || user.email}.`,
    });
  } catch (sendErr) {
    console.error("[sendDirectMessage] sendMail error:", sendErr.message);
    return res.status(500).json({
      success: false,
      message: "Failed to send email: " + sendErr.message,
    });
  }
};

module.exports = {
  sendMessage,
  getMessages,
  markMessageAsRead,
  getMyMessages,
  replyToMessage,
  markReplyAsRead,
  getAppointmentMessages,
  sendAppointmentMessage,
  sendDirectMessage,
};
