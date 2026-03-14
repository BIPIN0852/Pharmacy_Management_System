// const asyncHandler = require("express-async-handler");
// const Message = require("../models/Message");
// const sendEmail = require("../utils/sendEmail"); // Ensure this path matches your project structure

// // @desc    Create a new message (Guest or Customer)
// // @route   POST /api/messages
// // @access  Public
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
//     // req.user is set by the optionalAuth middleware if the user is logged in
//     userId: req.user ? req.user._id : null,
//   });

//   res.status(201).json(message);
// });

// // @desc    Get all messages (Admin Dashboard)
// // @route   GET /api/messages
// // @access  Private/Admin
// const getMessages = asyncHandler(async (req, res) => {
//   const messages = await Message.find({}).sort({ createdAt: -1 }); // Newest first
//   res.json(messages);
// });

// // @desc    Mark message as read (Admin Dashboard)
// // @route   PUT /api/messages/:id/read
// // @access  Private/Admin
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

// // @desc    Get logged-in user's message history
// // @route   GET /api/messages/my
// // @access  Private (Customer)
// const getMyMessages = asyncHandler(async (req, res) => {
//   const messages = await Message.find({ userId: req.user._id }).sort({
//     createdAt: -1,
//   });
//   res.json(messages);
// });

// // @desc    Admin replies to a message
// // @route   PUT /api/messages/:id/reply
// // @access  Private/Admin
// const replyToMessage = asyncHandler(async (req, res) => {
//   const { replyText } = req.body;
//   const message = await Message.findById(req.params.id);

//   if (message) {
//     message.adminReply = replyText;
//     message.isRead = true; // Mark as read since admin replied
//     message.isReplyRead = false; // Customer hasn't read the reply yet
//     await message.save();

//     // ✅ Send Email Notification to the user (Guest or Customer)
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

//               <p style="color: #64748b; font-size: 14px; margin-top: 30px;">
//                 If you have an account with us, you can also view this conversation directly in your Customer Dashboard.
//               </p>
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

// // @desc    Customer marks reply as read on their dashboard
// // @route   PUT /api/messages/:id/read-reply
// // @access  Private (Customer)
// const markReplyAsRead = asyncHandler(async (req, res) => {
//   const message = await Message.findById(req.params.id);

//   // Ensure the message belongs to the logged-in user
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

// module.exports = {
//   sendMessage,
//   getMessages,
//   markMessageAsRead,
//   getMyMessages,
//   replyToMessage,
//   markReplyAsRead,
// };

// const asyncHandler = require("express-async-handler");
// const Message = require("../models/Message");
// const sendEmail = require("../utils/sendEmail"); // Ensure this path matches your project structure

// // ===================================================================
// // 🛠️ PART 1: ADMIN & CUSTOMER SUPPORT TICKETS
// // ===================================================================

// // @desc    Create a new message (Guest or Customer)
// // @route   POST /api/messages
// // @access  Public
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
//     // req.user is set by the optionalAuth middleware if the user is logged in
//     userId: req.user ? req.user._id : null,
//   });

//   res.status(201).json(message);
// });

// // @desc    Get all messages (Admin Dashboard)
// // @route   GET /api/messages
// // @access  Private/Admin
// const getMessages = asyncHandler(async (req, res) => {
//   const messages = await Message.find({}).sort({ createdAt: -1 }); // Newest first
//   res.json(messages);
// });

// // @desc    Mark message as read (Admin Dashboard)
// // @route   PUT /api/messages/:id/read
// // @access  Private/Admin
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

// // @desc    Get logged-in user's message history
// // @route   GET /api/messages/my
// // @access  Private (Customer)
// const getMyMessages = asyncHandler(async (req, res) => {
//   const messages = await Message.find({ userId: req.user._id }).sort({
//     createdAt: -1,
//   });
//   res.json(messages);
// });

// // @desc    Admin replies to a message
// // @route   PUT /api/messages/:id/reply
// // @access  Private/Admin
// const replyToMessage = asyncHandler(async (req, res) => {
//   const { replyText } = req.body;
//   const message = await Message.findById(req.params.id);

//   if (message) {
//     message.adminReply = replyText;
//     message.isRead = true; // Mark as read since admin replied
//     message.isReplyRead = false; // Customer hasn't read the reply yet
//     await message.save();

//     // ✅ Send Email Notification to the user (Guest or Customer)
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

//               <p style="color: #64748b; font-size: 14px; margin-top: 30px;">
//                 If you have an account with us, you can also view this conversation directly in your Customer Dashboard.
//               </p>
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

// // @desc    Customer marks reply as read on their dashboard
// // @route   PUT /api/messages/:id/read-reply
// // @access  Private (Customer)
// const markReplyAsRead = asyncHandler(async (req, res) => {
//   const message = await Message.findById(req.params.id);

//   // Ensure the message belongs to the logged-in user
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

// // @desc    Get messages for a specific appointment chat
// // @route   GET /api/messages/appointment/:appointmentId
// // @access  Private (Doctor or Customer)
// const getAppointmentMessages = asyncHandler(async (req, res) => {
//   // Sort by oldest first so chat reads top-to-bottom
//   const messages = await Message.find({
//     appointment: req.params.appointmentId,
//   }).sort({ createdAt: 1 });
//   res.json(messages);
// });

// // @desc    Send a message in an appointment chat
// // @route   POST /api/messages/appointment
// // @access  Private (Doctor or Customer)
// const sendAppointmentMessage = asyncHandler(async (req, res) => {
//   const { appointmentId, receiverId, text } = req.body;

//   if (!appointmentId || !receiverId || !text) {
//     res.status(400);
//     throw new Error("Please provide appointmentId, receiverId, and text");
//   }

//   const message = await Message.create({
//     appointment: appointmentId,
//     sender: req.user._id, // Whoever is logged in (Doctor or Patient)
//     receiver: receiverId,
//     text,
//   });

//   res.status(201).json(message);
// });

// module.exports = {
//   // Admin & Support exports
//   sendMessage,
//   getMessages,
//   markMessageAsRead,
//   getMyMessages,
//   replyToMessage,
//   markReplyAsRead,
//   // New Appointment Chat exports
//   getAppointmentMessages,
//   sendAppointmentMessage,
// };

// const asyncHandler = require("express-async-handler");
// const Message = require("../models/Message");
// const sendEmail = require("../utils/sendEmail");

// // ===================================================================
// // 🛠️ PART 1: ADMIN & CUSTOMER SUPPORT TICKETS
// // ===================================================================

// // @desc    Create a new message (Guest or Customer)
// // @route   POST /api/messages
// // @access  Public
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
//     // req.user is set by the optionalAuth middleware if the user is logged in
//     userId: req.user ? req.user._id : null,
//   });

//   res.status(201).json(message);
// });

// // @desc    Get all messages (Admin Dashboard)
// // @route   GET /api/messages
// // @access  Private/Admin
// const getMessages = asyncHandler(async (req, res) => {
//   const messages = await Message.find({}).sort({ createdAt: -1 }); // Newest first
//   res.json(messages);
// });

// // @desc    Mark message as read (Admin Dashboard)
// // @route   PUT /api/messages/:id/read
// // @access  Private/Admin
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

// // @desc    Get logged-in user's message history (AND their doctor chats)
// // @route   GET /api/messages/my
// // @access  Private (Customer)
// const getMyMessages = asyncHandler(async (req, res) => {
//   // ✅ UPDATED: Now fetches BOTH support tickets AND Doctor-Patient chats where the user is the receiver
//   const messages = await Message.find({
//     $or: [
//       { userId: req.user._id }, // Support tickets created by this user
//       { receiver: req.user._id }, // Chats sent TO this user by a Doctor
//     ],
//   }).sort({ createdAt: -1 });

//   res.json(messages);
// });

// // @desc    Admin replies to a message
// // @route   PUT /api/messages/:id/reply
// // @access  Private/Admin
// const replyToMessage = asyncHandler(async (req, res) => {
//   const { replyText } = req.body;
//   const message = await Message.findById(req.params.id);

//   if (message) {
//     message.adminReply = replyText;
//     message.isRead = true; // Mark as read since admin replied
//     message.isReplyRead = false; // Customer hasn't read the reply yet
//     await message.save();

//     // ✅ Send Email Notification to the user (Guest or Customer)
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

//               <p style="color: #64748b; font-size: 14px; margin-top: 30px;">
//                 If you have an account with us, you can also view this conversation directly in your Customer Dashboard.
//               </p>
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

// // @desc    Customer marks reply as read on their dashboard
// // @route   PUT /api/messages/:id/read-reply
// // @access  Private (Customer)
// const markReplyAsRead = asyncHandler(async (req, res) => {
//   const message = await Message.findById(req.params.id);

//   // Ensure the message belongs to the logged-in user
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

// // @desc    Get messages for a specific appointment chat
// // @route   GET /api/messages/appointment/:appointmentId
// // @access  Private (Doctor or Customer)
// const getAppointmentMessages = asyncHandler(async (req, res) => {
//   // Sort by oldest first so chat reads top-to-bottom
//   const messages = await Message.find({
//     appointment: req.params.appointmentId,
//   }).sort({ createdAt: 1 });

//   // ✅ NEW: Automatically mark incoming messages as read when the chat is opened!
//   // If the logged-in user is the receiver of any unread messages in this chat, mark them read.
//   const unreadMessages = messages.filter(
//     (m) =>
//       m.receiver &&
//       m.receiver.toString() === req.user._id.toString() &&
//       m.isRead === false,
//   );

//   if (unreadMessages.length > 0) {
//     await Message.updateMany(
//       {
//         appointment: req.params.appointmentId,
//         receiver: req.user._id,
//         isRead: false,
//       },
//       { $set: { isRead: true } },
//     );
//   }

//   res.json(messages);
// });

// // @desc    Send a message in an appointment chat
// // @route   POST /api/messages/appointment
// // @access  Private (Doctor or Customer)
// const sendAppointmentMessage = asyncHandler(async (req, res) => {
//   const { appointmentId, receiverId, text, senderModel } = req.body;

//   if (!appointmentId || !receiverId || !text) {
//     res.status(400);
//     throw new Error("Please provide appointmentId, receiverId, and text");
//   }

//   // ✅ UPDATED: Include senderModel (Doctor or Patient) so frontend knows who sent it
//   const actualSenderModel =
//     senderModel || (req.user.role === "doctor" ? "Doctor" : "Patient");

//   const message = await Message.create({
//     appointment: appointmentId,
//     sender: req.user._id, // Whoever is logged in
//     senderModel: actualSenderModel,
//     receiver: receiverId,
//     text,
//     isRead: false, // Starts as unread for the notification system
//   });

//   res.status(201).json(message);
// });

// module.exports = {
//   // Admin & Support exports
//   sendMessage,
//   getMessages,
//   markMessageAsRead,
//   getMyMessages,
//   replyToMessage,
//   markReplyAsRead,
//   // Appointment Chat exports
//   getAppointmentMessages,
//   sendAppointmentMessage,
// };

const asyncHandler = require("express-async-handler");
const Message = require("../models/Message");
const sendEmail = require("../utils/sendEmail");

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

  // ✅ CRITICAL FIX: Only auto-read messages if it is NOT a background notification poll!
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

const User = require("../models/User"); // Make sure User model is imported at the top!

// @desc    Admin sends direct message/email to a user
// @route   POST /api/messages/send
// @access  Private/Admin
const sendDirectMessage = asyncHandler(async (req, res) => {
  const { userId, subject, body } = req.body;

  const user = await User.findById(userId);

  if (!user) {
    res.status(404);
    throw new Error("User not found");
  }

  try {
    await sendEmail({
      email: user.email,
      subject: subject || "Message from Smart Pharmacy",
      message: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #e0e0e0; border-radius: 8px; overflow: hidden;">
          <div style="background-color: #007185; color: white; padding: 20px; text-align: center;">
            <h2 style="margin: 0;">Smart Pharmacy</h2>
          </div>
          <div style="padding: 20px; color: #333;">
            <p>Hello <strong>${user.name}</strong>,</p>
            <p style="line-height: 1.6;">${body.replace(/\n/g, "<br/>")}</p>
            <br/>
            <p style="color: #666; font-size: 0.9em;">
              Regards,<br/>
              <strong>The Smart Pharmacy Team</strong>
            </p>
          </div>
        </div>
      `,
    });

    res.status(200).json({ message: "Message sent successfully" });
  } catch (error) {
    console.error("Email send error:", error);
    res.status(500);
    throw new Error("Email failed to send. Check your email configuration.");
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
