const asyncHandler = require("express-async-handler");
const Order = require("../models/Order");
const sendEmail = require("../utils/sendEmail");

// @desc    Get customers needing refills
// @route   GET /api/refill-reminders
// @access  Private/Pharmacist
const getRefillReminders = asyncHandler(async (req, res) => {
  // 1. Look for medicines that will run out within the next 100 days
  const targetDate = new Date();
  targetDate.setDate(targetDate.getDate() + 100);

  // 2. Query the exact refillDate we calculated during checkout
  const rawOrders = await Order.find({
    isPaid: true,
    isCancelled: false, // Ignore cancelled orders
    "orderItems.refillDate": { $lte: targetDate },
  })
    .populate("user", "name email phone")
    .sort({ createdAt: -1 });

  // 3. Clean up and format the response
  const formattedRefills = [];

  rawOrders.forEach((order) => {
    if (!order.user) return; // Make sure user exists

    order.orderItems.forEach((item) => {
      // Check if this specific item needs a refill alert
      if (item.refillDate && new Date(item.refillDate) <= targetDate) {
        formattedRefills.push({
          orderId: order._id,
          user: order.user,
          medicineName: item.name,
          qtyBought: item.qty * (item.buyingMultiplier || 1),
          refillDate: item.refillDate,
          reminderSentAutomated: item.refillReminderSent || false,
          originalOrderDate: order.createdAt,
        });
      }
    });
  });

  // 4. Sort the list so the most urgent/past-due refills are at the very top
  formattedRefills.sort(
    (a, b) => new Date(a.refillDate) - new Date(b.refillDate),
  );

  res.json(formattedRefills);
});

// @desc    Send manual refill reminder email from Pharmacist Dashboard
// @route   POST /api/refill-reminders/send
// @access  Private/Pharmacist
const sendRefillReminder = asyncHandler(async (req, res) => {
  const { orderId, userId, medicineName, email, name } = req.body;

  if (!orderId || !medicineName || !email) {
    return res
      .status(400)
      .json({ message: "Missing required fields to send email." });
  }

  // 1. Send the email using your existing Nodemailer utility
  try {
    const message = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #e0e0e0; border-radius: 8px; overflow: hidden;">
        <div style="background-color: #007185; color: white; padding: 20px; text-align: center;">
          <h2 style="margin: 0;">Prescription Refill Reminder</h2>
        </div>
        <div style="padding: 20px; color: #333;">
          <p>Hello <strong>${name || "Valued Customer"}</strong>,</p>
          <p>This is a friendly reminder from Smart Pharmacy. According to our records, you are running low on your prescription for <strong>${medicineName}</strong>.</p>
          <p>To ensure you don't run out, please log in to your account and place a refill order at your earliest convenience.</p>
          <br/>
          <p style="color: #666; font-size: 0.9em;">Stay healthy,<br/><strong>The Smart Pharmacy Team</strong></p>
        </div>
      </div>
    `;

    await sendEmail({
      email: email,
      subject: `Refill Reminder: ${medicineName}`,
      message: message,
    });
  } catch (emailError) {
    console.error("Failed to send refill email:", emailError);
    return res.status(500).json({ message: "Failed to send email via SMTP." });
  }

  // 2. If the email successfully sent, update the database to mark it as sent!
  // We use the positional operator `$` to update the specific item inside the orderItems array
  const updatedOrder = await Order.findOneAndUpdate(
    {
      _id: orderId,
      "orderItems.name": medicineName,
    },
    {
      $set: { "orderItems.$.refillReminderSent": true },
    },
    { new: true },
  );

  if (!updatedOrder) {
    return res.status(404).json({
      message: "Order or Medicine not found in database to update status.",
    });
  }

  res
    .status(200)
    .json({ success: true, message: "Reminder sent successfully" });
});

module.exports = { getRefillReminders, sendRefillReminder };
