// const mongoose = require("mongoose");

// const messageSchema = new mongoose.Schema(
//   {
//     name: { type: String, required: true },
//     email: { type: String, required: true },
//     text: { type: String, required: true },
//     isRead: { type: Boolean, default: false }, // For Admin

//     // Link to logged-in customer
//     userId: {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: "User",
//       default: null,
//     },

//     // Admin Reply Fields
//     adminReply: { type: String, default: null },
//     isReplyRead: { type: Boolean, default: false }, // For Customer Dashboard Notification

//     // ✅ NEW: TTL Index Field
//     // This tells MongoDB to automatically delete the document 48 hours (172800 seconds) after the 'createdAt' timestamp.
//     createdAt: { type: Date, default: Date.now, expires: 172800 },
//   },
//   {
//     // We don't need Mongoose to manage timestamps anymore because we manually defined 'createdAt' above.
//     // If you want 'updatedAt' for other reasons, you can leave timestamps: true, but it's redundant here.
//     timestamps: false,
//   },
// );

// module.exports = mongoose.model("Message", messageSchema);

const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema(
  {
    // ===================================================================
    // 🛠️ PART 1: ADMIN SUPPORT TICKET FIELDS
    // ===================================================================

    // Conditionally required: Only required if this is NOT an appointment chat
    name: {
      type: String,
      required: function () {
        return !this.appointment;
      },
    },
    email: {
      type: String,
      required: function () {
        return !this.appointment;
      },
    },

    text: { type: String, required: true },
    isRead: { type: Boolean, default: false }, // For Admin

    // Link to logged-in customer (for Support Tickets)
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },

    // Admin Reply Fields
    adminReply: { type: String, default: null },
    isReplyRead: { type: Boolean, default: false }, // For Customer Dashboard Notification

    // ===================================================================
    // 🩺 PART 2: DOCTOR-PATIENT APPOINTMENT CHAT FIELDS
    // ===================================================================

    appointment: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Appointment",
      default: null,
    },
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
    receiver: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },

    // ===================================================================
    // ⏳ AUTO-DELETE (TTL) SETTINGS
    // ===================================================================

    // ✅ TTL Index Field
    // This tells MongoDB to automatically delete the document 48 hours (172800 seconds) after the 'createdAt' timestamp.
    // Note: This now means your Doctor-Patient chats will ALSO auto-delete after 48 hours (which is actually great for medical privacy!)
    createdAt: { type: Date, default: Date.now, expires: 172800 },
  },
  {
    // We don't need Mongoose to manage timestamps anymore because we manually defined 'createdAt' above.
    timestamps: false,
  },
);

module.exports = mongoose.model("Message", messageSchema);
