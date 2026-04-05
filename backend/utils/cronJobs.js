const cron = require("node-cron");
const Order = require("../models/Order");
const sendEmail = require("./sendEmail"); // Use your existing email utility

const startRefillReminders = () => {
  console.log("⏰ Refill Reminder Cron Job Initialized");

  // This weird string means: "Run at 8:00 AM every single day"
  cron.schedule("0 8 * * *", async () => {
    console.log("🔍 Scanning database for upcoming refills...");

    try {
      // Find orders where the refill date is exactly today OR in the next 3 days,
      // and we haven't sent a reminder yet.
      const targetDate = new Date();
      targetDate.setDate(targetDate.getDate() + 3); // 3 days warning

      // Find all delivered orders that contain items needing a refill
      const orders = await Order.find({
        isDelivered: true,
        "orderItems.refillDate": { $lte: targetDate },
        "orderItems.refillReminderSent": false,
      }).populate("user", "name email");

      for (let order of orders) {
        let itemsToUpdate = false;

        for (let item of order.orderItems) {
          // Check if this specific item is due for a refill and hasn't been notified
          if (item.refillDate <= targetDate && !item.refillReminderSent) {
            // 1. Send the Email
            const message = `
              <h3>Time for a Refill, ${order.user.name}!</h3>
              <p>Our records show you might be running low on <strong>${item.name}</strong>.</p>
              <p>To ensure you don't miss a dose, please click below to order your refill from PharmaStore.</p>
              <br/>
              <a href="http://localhost:3000/product/${item.product}" style="padding: 10px 20px; background-color: #007185; color: white; text-decoration: none; border-radius: 5px;">Order Refill Now</a>
            `;

            await sendEmail({
              email: order.user.email,
              subject: `Refill Reminder: ${item.name}`,
              message: message,
            });

            console.log(
              `📧 Refill email sent to ${order.user.email} for ${item.name}`,
            );

            // 2. Mark as sent so we don't spam them tomorrow
            item.refillReminderSent = true;
            itemsToUpdate = true;
          }
        }

        // 3. Save the order to lock in the "Sent" status
        if (itemsToUpdate) {
          await order.save();
        }
      }
    } catch (error) {
      console.error("❌ Cron Job Error:", error);
    }
  });
};

module.exports = startRefillReminders;
