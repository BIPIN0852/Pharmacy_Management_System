const express = require("express");
const { body, validationResult } = require("express-validator");
const passport = require("passport");
const jwt = require("jsonwebtoken");

// Models & Middleware
const User = require("../models/User");
const {
  protect,
  admin,
  generateToken,
} = require("../middleware/authMiddleware");

// Utilities
const sendEmail = require("../utils/sendEmail");
const { getEmailTemplate } = require("../utils/emailTemplates");

const router = express.Router();

// Utility: Generate 6-digit OTP
const generateOtp = () =>
  Math.floor(100000 + Math.random() * 900000).toString();

// -------------------------------------------------------------------
// 1. REGISTER (Customer)
// -------------------------------------------------------------------
router.post(
  "/register",
  [
    body("name").trim().isLength({ min: 2 }).withMessage("Name required"),
    body("email").isEmail().withMessage("Valid email required"),
    body("password").isLength({ min: 6 }).withMessage("Password min 6 chars"),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty())
      return res.status(400).json({ errors: errors.array() });

    const { name, email, password, phone } = req.body;

    try {
      let user = await User.findOne({ email });

      // Handle existing unverified user (Resend OTP case)
      if (user) {
        if (!user.isVerified) {
          const otp = generateOtp();
          user.otp = otp;
          user.otpExpires = Date.now() + 10 * 60 * 1000; // 10 mins
          user.name = name;
          user.phone = phone;
          user.password = password; // Model will re-hash
          await user.save();

          // Send Email
          const htmlMsg = getEmailTemplate(
            user.name,
            "Here is your new verification code.",
            otp,
          );
          await sendEmail({
            email: user.email,
            subject: "Verify Your Account",
            message: htmlMsg,
          });

          return res.json({
            message: "Account exists but unverified. Verification code resent.",
          });
        }
        return res
          .status(400)
          .json({ message: "User with this email already exists." });
      }

      // Create New User
      const otp = generateOtp();
      user = new User({
        name,
        email,
        password,
        phone,
        role: "customer",
        isVerified: false,
        otp: otp, // Standardized field name
        otpExpires: Date.now() + 10 * 60 * 1000,
      });

      await user.save();

      console.log(`🆕 Registered ${email} | OTP: ${otp}`);

      // Send Email
      const htmlMsg = getEmailTemplate(
        user.name,
        "Welcome! Please verify your email.",
        otp,
      );
      await sendEmail({
        email: user.email,
        subject: "Verify Your Account",
        message: htmlMsg,
      });

      res.status(201).json({
        message: "User registered. Verification code sent to email.",
        email: user.email,
      });
    } catch (err) {
      console.error("❌ Register Error:", err);
      res.status(500).json({ message: "Server error during registration" });
    }
  },
);

// -------------------------------------------------------------------
// 2. VERIFY OTP (Robust Logic)
// -------------------------------------------------------------------
router.post("/verify-otp", async (req, res) => {
  const { email, otp } = req.body;
  console.log(`🔍 Verifying: ${email} with code: ${otp}`);

  try {
    const user = await User.findOne({ email });

    if (!user) return res.status(400).json({ message: "User not found" });

    // Debugging Logs
    console.log(`   ➜ DB OTP: ${user.otp}`);
    console.log(`   ➜ DB Expires: ${user.otpExpires}`);

    // Check Match (String conversion + Trim for safety)
    if (String(user.otp).trim() !== String(otp).trim()) {
      return res.status(400).json({ message: "Invalid OTP code" });
    }

    // Check Expiry
    if (new Date(user.otpExpires) < new Date()) {
      return res.status(400).json({ message: "OTP has expired" });
    }

    // Mark verified
    user.isVerified = true;
    user.otp = undefined;
    user.otpExpires = undefined;
    await user.save();

    console.log(`✅ Verified ${email}`);

    res.json({
      message: "Verified successfully",
      token: generateToken(user._id),
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (err) {
    console.error("❌ Verify OTP Error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// -------------------------------------------------------------------
// 3. RESEND OTP
// -------------------------------------------------------------------
router.post("/resend-otp", async (req, res) => {
  const { email } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "User not found" });
    if (user.isVerified)
      return res.status(400).json({ message: "Account already verified" });

    const otp = generateOtp();
    user.otp = otp;
    user.otpExpires = Date.now() + 10 * 60 * 1000;
    await user.save();

    const htmlMsg = getEmailTemplate(
      user.name,
      "Here is your new verification code.",
      otp,
    );
    await sendEmail({
      email: user.email,
      subject: "New Verification Code",
      message: htmlMsg,
    });

    res.json({ message: "Verification code resent." });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

// -------------------------------------------------------------------
// 4. LOGIN (Password)
// -------------------------------------------------------------------
router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });

    if (user && (await user.matchPassword(password))) {
      if (!user.isVerified) {
        return res
          .status(403)
          .json({ message: "Account not verified. Please verify OTP." });
      }

      res.json({
        message: "Logged in successfully",
        token: generateToken(user._id),
        user: {
          _id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          image: user.profilePhoto || "",
        },
      });
    } else {
      res.status(401).json({ message: "Invalid email or password" });
    }
  } catch (err) {
    console.error("Login Error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// -------------------------------------------------------------------
// 5. ADMIN: CREATE USER
// -------------------------------------------------------------------
router.post("/admin/create-user", protect, admin, async (req, res) => {
  const { name, email, password, role, phone } = req.body;

  try {
    if (await User.findOne({ email }))
      return res.status(400).json({ message: "User already exists" });

    const user = new User({
      name,
      email,
      password,
      role,
      phone,
      isVerified: true,
    });

    await user.save();

    res.status(201).json({
      message: `User created as ${role}`,
      user: { _id: user._id, name: user.name, role: user.role },
    });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

// -------------------------------------------------------------------
// 6. PASSWORD RESET FLOW
// -------------------------------------------------------------------
router.post("/forgot-password", async (req, res) => {
  const { email } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "User not found" });

    const code = generateOtp();
    user.resetPasswordCode = code;
    user.resetPasswordExpires = Date.now() + 10 * 60 * 1000;
    await user.save();

    const htmlMsg = getEmailTemplate(
      user.name,
      "Use this code to reset your password.",
      code,
    );
    await sendEmail({
      email: user.email,
      subject: "Password Reset Request",
      message: htmlMsg,
    });

    res.json({ message: "Reset code sent to email" });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

router.post("/reset-password", async (req, res) => {
  const { email, code, newPassword } = req.body;
  try {
    const user = await User.findOne({ email });
    if (
      !user ||
      user.resetPasswordCode !== code ||
      user.resetPasswordExpires < Date.now()
    ) {
      return res.status(400).json({ message: "Invalid or expired reset code" });
    }

    user.password = newPassword;
    user.resetPasswordCode = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();

    res.json({ message: "Password has been reset successfully" });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

// -------------------------------------------------------------------
// 7. PROFILE ROUTES
// -------------------------------------------------------------------
router.get("/me", protect, async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select("-password");
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

router.get("/profile", protect, async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select("-password");
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

router.put("/profile", protect, async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).json({ message: "User not found" });

    const {
      name,
      phone,
      gender,
      dob,
      address,
      bloodGroup,
      allergies,
      chronicConditions,
      emergencyContact,
    } = req.body;

    if (name) user.name = name;
    if (phone) user.phone = phone;
    if (gender) user.gender = gender;
    if (dob) user.dob = dob;

    if (address) {
      if (typeof address === "string") {
        user.address = {
          street: address,
          city: user.address?.city || "",
          province: user.address?.province || "",
          postalCode: user.address?.postalCode || "",
        };
      } else {
        user.address = { ...user.address, ...address };
      }
    }

    if (bloodGroup) user.bloodGroup = bloodGroup;
    if (allergies) user.allergies = allergies;
    if (chronicConditions) user.chronicConditions = chronicConditions;
    if (emergencyContact) user.emergencyContact = emergencyContact;

    const updatedUser = await user.save();
    const userResponse = updatedUser.toObject();
    delete userResponse.password;

    res.json(userResponse);
  } catch (err) {
    console.error("Update Profile Error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// -------------------------------------------------------------------
// 8. GOOGLE AUTH
// -------------------------------------------------------------------
router.get(
  "/google",
  passport.authenticate("google", { scope: ["profile", "email"] }),
);

router.get(
  "/google/callback",
  passport.authenticate("google", { failureRedirect: "/login" }),
  (req, res) => {
    const token = generateToken(req.user._id);
    // Use FRONTEND_URL environment variable, defaulting to localhost for local dev
    const frontendUrl = process.env.FRONTEND_URL || "http://localhost:5173";
    res.redirect(`${frontendUrl}/login?token=${token}`);
  },
);

module.exports = router;
