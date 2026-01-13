require("dotenv").config();
const mongoose = require("mongoose");
const User = require("./models/User"); // Ensure path is correct

// 1. Setup Connection
const connectDB = async () => {
  try {
    const conn = await mongoose.connect(
      process.env.MONGO_URI || "mongodb://localhost:27017/pharmacy"
    );
    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`❌ Connection Error: ${error.message}`);
    process.exit(1);
  }
};

// 2. Admin Promotion + Password Reset Logic
const promoteUser = async () => {
  const emailToPromote = "aryalbipin001@gmail.com";

  try {
    await connectDB();

    // Find the user
    const user = await User.findOne({ email: emailToPromote });

    if (!user) {
      console.log(`❌ User with email '${emailToPromote}' not found!`);
      console.log("   -> You must REGISTER this user on the frontend first.");
      process.exit(1);
    }

    // ✅ FORCE UPDATE ROLE
    user.role = "admin";
    user.isAdmin = true;

    // ✅ FORCE RESET PASSWORD (to "password123")
    // The User model's pre-save hook will automatically hash this
    user.password = "bipin001";

    await user.save();

    console.log("================================================");
    console.log(`🎉 SUCCESS! Account Updated.`);
    console.log(`👤 User:  ${user.name} (${user.email})`);
    console.log(`🔰 Role:  ADMIN`);
    console.log(`🔑 Pass:  password123  (Login with this!)`);
    console.log("================================================");
    process.exit();
  } catch (error) {
    console.error(`❌ Error: ${error.message}`);
    process.exit(1);
  }
};

promoteUser();
