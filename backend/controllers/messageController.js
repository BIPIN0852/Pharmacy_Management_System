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
// 📨 PART 3: ADMIN DIRECT MESSAGE
// Uses sendEmail utility (now Resend-based — works on Render free tier)
// ===================================================================

// @desc    Admin sends a direct email to a customer
// @route   POST /api/messages/send
// @access  Private/Admin
const sendDirectMessage = asyncHandler(async (req, res) => {
  const { userId, subject, body } = req.body;

  // 1. Validate
  if (!userId || !subject?.trim() || !body?.trim()) {
    return res.status(400).json({
      success: false,
      message: "userId, subject, and body are all required.",
    });
  }

  // 2. Find the user
  const user = await User.findById(userId).select("email name");
  if (!user) {
    return res.status(404).json({
      success: false,
      message: "User not found.",
    });
  }

  // 3. Send via sendEmail utility (Resend API — no SMTP, works on Render)
  try {
    await sendEmail({
      email: user.email,
      subject: subject.trim(),
      message: `
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

    console.log(`[sendDirectMessage] ✅ Sent to ${user.email}`);

    return res.status(200).json({
      success: true,
      message: `Message sent successfully to ${user.name || user.email}.`,
    });
  } catch (error) {
    console.error("❌ sendDirectMessage error:", error.message);
    return res.status(500).json({
      success: false,
      message: error.message || "Failed to send message.",
    });
  }
});

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
