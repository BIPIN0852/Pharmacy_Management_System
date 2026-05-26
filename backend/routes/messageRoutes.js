// const express = require("express");
// const router = express.Router();
// const jwt = require("jsonwebtoken");
// const User = require("../models/User"); // Ensure path is correct
// const { protect } = require("../middleware/authMiddleware");
// const authorizeRoles = require("../middleware/role");

// const {
//   sendMessage,
//   getMessages,
//   markMessageAsRead,
//   getMyMessages,
//   replyToMessage,
//   markReplyAsRead,
//   // ✅ IMPORTED NEW CHAT FUNCTIONS
//   getAppointmentMessages,
//   sendAppointmentMessage,
//   sendDirectMessage,
// } = require("../controllers/messageController");

// // ✅ OPTIONAL AUTH MIDDLEWARE
// // Allows guests to send support messages, but if a logged-in user sends one, it attaches their user ID.
// const optionalAuth = async (req, res, next) => {
//   let token;
//   if (
//     req.headers.authorization &&
//     req.headers.authorization.startsWith("Bearer")
//   ) {
//     try {
//       token = req.headers.authorization.split(" ")[1];
//       const decoded = jwt.verify(token, process.env.JWT_SECRET);
//       req.user = await User.findById(decoded.id).select("-password");
//     } catch (error) {
//       console.error(
//         "Optional Auth Token Failed (treating as guest):",
//         error.message,
//       );
//     }
//   }
//   next();
// };

// // ===================================================================
// // 🩺 DOCTOR & PATIENT APPOINTMENT CHAT ROUTES
// // ===================================================================

// // Send a message in an appointment chat (Requires login)
// // Logic updated in controller to detect senderModel (Doctor vs Patient)
// router.post("/appointment", protect, sendAppointmentMessage);

// // Get all messages for a specific appointment chat (Requires login)
// // Logic updated in controller to automatically mark incoming messages as READ
// router.get("/appointment/:appointmentId", protect, getAppointmentMessages);

// // ===================================================================
// // 🛠️ PUBLIC / CUSTOMER SUPPORT TICKET ROUTES
// // ===================================================================

// // Route to send a support message (Handles both Guests and Logged-In Users)
// router.post("/", optionalAuth, sendMessage);

// // Route for a logged-in customer to fetch their message history
// // ⚠️ MUST BE ABOVE `/:id` routes!
// // Logic updated in controller to fetch BOTH support tickets AND doctor chats
// router.get("/my", protect, getMyMessages);

// // Route for a logged-in customer to mark an admin's support reply as read
// router.put("/:id/read-reply", protect, markReplyAsRead);

// // ===================================================================
// // 👔 ADMIN ONLY ROUTES
// // ===================================================================

// // View all support messages from all users
// router.get("/", protect, authorizeRoles("admin"), getMessages);

// // Mark a support message as read (without replying)
// router.put("/:id/read", protect, authorizeRoles("admin"), markMessageAsRead);

// // Reply to a support message (sends email & updates DB)
// router.put("/:id/reply", protect, authorizeRoles("admin"), replyToMessage);

// // Add this new route for Admin sending direct messages
// router.post("/send", protect, authorizeRoles("admin"), sendDirectMessage);

// module.exports = router;

const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const { protect } = require("../middleware/authMiddleware");
const authorizeRoles = require("../middleware/role");

const {
  sendMessage,
  getMessages,
  markMessageAsRead,
  getMyMessages,
  replyToMessage,
  markReplyAsRead,
  getAppointmentMessages,
  sendAppointmentMessage,
  sendDirectMessage,
} = require("../controllers/messageController");

// ✅ OPTIONAL AUTH MIDDLEWARE
const optionalAuth = async (req, res, next) => {
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      token = req.headers.authorization.split(" ")[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = await User.findById(decoded.id).select("-password");
    } catch (error) {
      console.error(
        "Optional Auth Token Failed (treating as guest):",
        error.message,
      );
    }
  }
  next();
};

// ===================================================================
// 🩺 DOCTOR & PATIENT APPOINTMENT CHAT ROUTES
// ===================================================================
router.post("/appointment", protect, sendAppointmentMessage);
router.get("/appointment/:appointmentId", protect, getAppointmentMessages);

// ===================================================================
// 🛠️ PUBLIC / CUSTOMER SUPPORT TICKET ROUTES
// ===================================================================
router.post("/", optionalAuth, sendMessage);
router.get("/my", protect, getMyMessages);
router.put("/:id/read-reply", protect, markReplyAsRead);

// ===================================================================
// 👔 ADMIN ONLY ROUTES
// ===================================================================
router.get("/", protect, authorizeRoles("admin"), getMessages);
router.put("/:id/read", protect, authorizeRoles("admin"), markMessageAsRead);
router.put("/:id/reply", protect, authorizeRoles("admin"), replyToMessage);

// ✅ DIRECT MESSAGE — with route-level timeout so it never hangs >20s
router.post(
  "/send",
  protect,
  authorizeRoles("admin"),
  (req, res, next) => {
    // Hard timeout at route level — catches hung controllers
    res.setTimeout(20000, () => {
      if (!res.headersSent) {
        return res.status(504).json({
          message:
            "Request timed out. Email service may be misconfigured — check EMAIL_USER and EMAIL_PASS in your .env.",
        });
      }
    });
    next();
  },
  sendDirectMessage,
);

module.exports = router;
