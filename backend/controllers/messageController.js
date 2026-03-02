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

const asyncHandler = require("express-async-handler");
const Message = require("../models/Message");
const sendEmail = require("../utils/sendEmail"); // Ensure this path matches your project structure

// ===================================================================
// 🛠️ PART 1: ADMIN & CUSTOMER SUPPORT TICKETS
// ===================================================================

// @desc    Create a new message (Guest or Customer)
// @route   POST /api/messages
// @access  Public
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
    // req.user is set by the optionalAuth middleware if the user is logged in
    userId: req.user ? req.user._id : null,
  });

  res.status(201).json(message);
});

// @desc    Get all messages (Admin Dashboard)
// @route   GET /api/messages
// @access  Private/Admin
const getMessages = asyncHandler(async (req, res) => {
  const messages = await Message.find({}).sort({ createdAt: -1 }); // Newest first
  res.json(messages);
});

// @desc    Mark message as read (Admin Dashboard)
// @route   PUT /api/messages/:id/read
// @access  Private/Admin
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

// @desc    Get logged-in user's message history
// @route   GET /api/messages/my
// @access  Private (Customer)
const getMyMessages = asyncHandler(async (req, res) => {
  const messages = await Message.find({ userId: req.user._id }).sort({
    createdAt: -1,
  });
  res.json(messages);
});

// @desc    Admin replies to a message
// @route   PUT /api/messages/:id/reply
// @access  Private/Admin
const replyToMessage = asyncHandler(async (req, res) => {
  const { replyText } = req.body;
  const message = await Message.findById(req.params.id);

  if (message) {
    message.adminReply = replyText;
    message.isRead = true; // Mark as read since admin replied
    message.isReplyRead = false; // Customer hasn't read the reply yet
    await message.save();

    // ✅ Send Email Notification to the user (Guest or Customer)
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

              <p style="color: #64748b; font-size: 14px; margin-top: 30px;">
                If you have an account with us, you can also view this conversation directly in your Customer Dashboard.
              </p>
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

// @desc    Customer marks reply as read on their dashboard
// @route   PUT /api/messages/:id/read-reply
// @access  Private (Customer)
const markReplyAsRead = asyncHandler(async (req, res) => {
  const message = await Message.findById(req.params.id);

  // Ensure the message belongs to the logged-in user
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

// @desc    Get messages for a specific appointment chat
// @route   GET /api/messages/appointment/:appointmentId
// @access  Private (Doctor or Customer)
const getAppointmentMessages = asyncHandler(async (req, res) => {
  // Sort by oldest first so chat reads top-to-bottom
  const messages = await Message.find({
    appointment: req.params.appointmentId,
  }).sort({ createdAt: 1 });
  res.json(messages);
});

// @desc    Send a message in an appointment chat
// @route   POST /api/messages/appointment
// @access  Private (Doctor or Customer)
const sendAppointmentMessage = asyncHandler(async (req, res) => {
  const { appointmentId, receiverId, text } = req.body;

  if (!appointmentId || !receiverId || !text) {
    res.status(400);
    throw new Error("Please provide appointmentId, receiverId, and text");
  }

  const message = await Message.create({
    appointment: appointmentId,
    sender: req.user._id, // Whoever is logged in (Doctor or Patient)
    receiver: receiverId,
    text,
  });

  res.status(201).json(message);
});

module.exports = {
  // Admin & Support exports
  sendMessage,
  getMessages,
  markMessageAsRead,
  getMyMessages,
  replyToMessage,
  markReplyAsRead,
  // New Appointment Chat exports
  getAppointmentMessages,
  sendAppointmentMessage,
};
