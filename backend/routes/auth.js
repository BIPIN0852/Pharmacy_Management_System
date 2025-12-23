const express = require("express");
const { body, validationResult } = require("express-validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const passport = require("passport");
const nodemailer = require("nodemailer");

const User = require("../models/User");
const authenticateToken = require("../middleware/auth");

const router = express.Router();

// -------------------
// EMAIL TRANSPORT (for codes)
// -------------------
const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASSWORD,
  },
});

async function sendCodeEmail(to, subject, text) {
  if (!process.env.SMTP_USER || !process.env.SMTP_PASSWORD) {
    console.warn(
      "⚠️ SMTP_USER or SMTP_PASSWORD not set; logging email instead."
    );
    console.log("TO:", to);
    console.log("SUBJECT:", subject);
    console.log("TEXT:", text);
    return;
  }

  return transporter.sendMail({
    from: `"Smart Pharmacy" <${process.env.SMTP_USER}>`,
    to,
    subject,
    text,
  });
}

// Utility to generate 6-digit OTP
function generateOtp() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

// // -------------------
// // REGISTER (customer only, with OTP)
// // -------------------
router.post(
  "/register",
  [
    body("name").isLength({ min: 2 }).withMessage("Name required"),
    body("email").isEmail().withMessage("Valid email required"),
    body("password").isLength({ min: 6 }).withMessage("Password min 6 chars"),
    // no role here – always customer
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty())
      return res.status(400).json({ errors: errors.array() });

    const { name, email, password, phone } = req.body;

    try {
      let user = await User.findOne({ email });

      if (user) {
        // If user already exists but not verified, allow regenerating OTP
        if (!user.isVerified) {
          const otpCode = generateOtp();
          const expiry = new Date(Date.now() + 10 * 60 * 1000);

          user.otpCode = otpCode;
          user.otpExpires = expiry;
          user.name = name;
          user.phone = phone;
          user.role = "customer"; // force customer
          user.password = await bcrypt.hash(password, 10);
          await user.save();

          try {
            await sendCodeEmail(
              email,
              "Your Smart Pharmacy verification code",
              `Your verification code is: ${otpCode}\nThis code will expire in 10 minutes.`
            );
          } catch (mailErr) {
            console.error("Nodemailer error in register:", mailErr);
            return res
              .status(500)
              .json({ message: "Failed to send email, check email config" });
          }

          return res.json({
            message: "Verification code resent to your email.",
          });
        }

        return res
          .status(400)
          .json({ message: "User with that email already exists" });
      }

      const hashedPassword = await bcrypt.hash(password, 10);
      const otpCode = generateOtp();
      const expiry = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

      user = new User({
        name,
        email,
        password: hashedPassword,
        role: "customer", // forced
        phone,
        isVerified: false,
        otpCode,
        otpExpires: expiry,
      });
      await user.save();

      try {
        await sendCodeEmail(
          email,
          "Your Smart Pharmacy verification code",
          `Your verification code is: ${otpCode}\nThis code will expire in 10 minutes.`
        );
      } catch (mailErr) {
        console.error("Nodemailer error in register:", mailErr);
        return res
          .status(500)
          .json({ message: "Failed to send email, check email config" });
      }

      res.status(201).json({
        message: "User registered. Verification code sent to your email.",
      });
    } catch (err) {
      console.error("Register error:", err);
      res.status(500).json({ message: "Server error" });
    }
  }
);

// -------------------
// VERIFY OTP (registration)
// -------------------
router.post(
  "/verify-otp",
  [
    body("email").isEmail().withMessage("Valid email required"),
    body("otp").isLength({ min: 4 }).withMessage("OTP required"),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty())
      return res.status(400).json({ errors: errors.array() });

    const { email, otp } = req.body;

    try {
      const user = await User.findOne({ email });
      console.log("VERIFY-OTP request:", { email, otp });
      console.log(
        "VERIFY-OTP user:",
        user && {
          isVerified: user.isVerified,
          otpCode: user.otpCode,
          otpExpires: user.otpExpires,
          now: new Date(),
        }
      );

      const cleanOtp = String(otp).trim();
      if (
        !user ||
        !user.otpCode ||
        String(user.otpCode).trim() !== cleanOtp ||
        !user.otpExpires ||
        user.otpExpires < Date.now()
      ) {
        return res.status(400).json({ message: "Invalid or expired OTP" });
      }

      user.isVerified = true;
      user.otpCode = undefined;
      user.otpExpires = undefined;
      await user.save();

      const payload = {
        id: user._id,
        role: user.role,
        email: user.email,
        name: user.name,
      };
      const token = jwt.sign(payload, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES_IN || "7d",
      });

      res.json({
        message: "Account verified successfully",
        token,
        role: user.role,
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
        },
      });
    } catch (err) {
      console.error("verify-otp error:", err);
      res.status(500).json({ message: "Server error" });
    }
  }
);

// -------------------
// RESEND OTP (registration)
// -------------------
router.post(
  "/resend-otp",
  [body("email").isEmail().withMessage("Valid email required")],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty())
      return res.status(400).json({ errors: errors.array() });

    const { email } = req.body;

    try {
      const user = await User.findOne({ email });

      if (!user) {
        return res.status(404).json({
          message: "User with this email not found. Please register.",
        });
      }

      if (user.isVerified) {
        return res
          .status(400)
          .json({ message: "Account already verified. Please log in." });
      }

      const otpCode = generateOtp();
      const expiry = new Date(Date.now() + 10 * 60 * 1000);

      user.otpCode = otpCode;
      user.otpExpires = expiry;
      await user.save();

      try {
        await sendCodeEmail(
          email,
          "Your Smart Pharmacy verification code",
          `Your verification code is: ${otpCode}\nThis code will expire in 10 minutes.`
        );
      } catch (mailErr) {
        console.error("Nodemailer error in resend-otp:", mailErr);
        return res
          .status(500)
          .json({ message: "Failed to send email, check email config" });
      }

      res.json({ message: "Verification code resent to your email." });
    } catch (err) {
      console.error("resend-otp error:", err);
      res.status(500).json({ message: "Server error" });
    }
  }
);

// -------------------
// LOGIN (email + password)
// -------------------
router.post(
  "/login",
  [
    body("email").isEmail().withMessage("Valid email required"),
    body("password").exists().withMessage("Password required"),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty())
      return res.status(400).json({ errors: errors.array() });

    const { email, password } = req.body;

    try {
      const user = await User.findOne({ email });
      if (!user)
        return res.status(400).json({ message: "Invalid email or password" });

      if (!user.isVerified) {
        return res
          .status(403)
          .json({ message: "Account not verified. Please check your email." });
      }

      if (user.password) {
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch)
          return res.status(400).json({ message: "Invalid email or password" });
      }

      const payload = {
        id: user._id,
        role: user.role,
        email: user.email,
        name: user.name,
      };
      const token = jwt.sign(payload, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES_IN || "7d",
      });

      res.status(200).json({
        message: "Logged in",
        token,
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
        },
      });
    } catch (err) {
      console.error("Login error:", err);
      res.status(500).json({ message: "Server error" });
    }
  }
);

// -------------------
// ADMIN: create pharmacist/staff
// -------------------
router.post(
  "/admin/create-user",
  authenticateToken,
  [
    body("name").isLength({ min: 2 }).withMessage("Name required"),
    body("email").isEmail().withMessage("Valid email required"),
    body("password").isLength({ min: 6 }).withMessage("Password min 6 chars"),
    body("role")
      .isIn(["pharmacist", "staff"])
      .withMessage("Role must be pharmacist or staff"),
  ],
  async (req, res) => {
    if (req.user.role !== "admin") {
      return res.status(403).json({ message: "Access denied. Admin only." });
    }

    const errors = validationResult(req);
    if (!errors.isEmpty())
      return res.status(400).json({ errors: errors.array() });

    const { name, email, password, role, phone } = req.body;

    try {
      let user = await User.findOne({ email });
      if (user) {
        return res
          .status(400)
          .json({ message: "User with that email already exists" });
      }

      const hashedPassword = await bcrypt.hash(password, 10);

      user = new User({
        name,
        email,
        password: hashedPassword,
        role, // pharmacist or staff
        phone,
        isVerified: true, // admin-created are auto-verified
      });

      await user.save();

      res.status(201).json({
        message: `User created as ${role}`,
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
        },
      });
    } catch (err) {
      console.error("admin create-user error:", err);
      res.status(500).json({ message: "Server error" });
    }
  }
);

// -------------------
// EMAIL CODE LOGIN
// -------------------

// send login verification code to email
router.post(
  "/send-login-code",
  [body("email").isEmail().withMessage("Valid email required")],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty())
      return res.status(400).json({ errors: errors.array() });

    const { email } = req.body;

    try {
      const user = await User.findOne({ email });
      if (!user)
        return res
          .status(404)
          .json({ message: "User with this email not found" });

      const loginCode = generateOtp();
      const expiry = Date.now() + 10 * 60 * 1000; // 10 minutes

      user.loginCode = loginCode;
      user.loginCodeExpires = expiry;
      await user.save();

      try {
        await sendCodeEmail(
          email,
          "Your login verification code",
          `Your Smart Pharmacy login code is: ${loginCode}\nThis code will expire in 10 minutes.`
        );
      } catch (mailErr) {
        console.error("Nodemailer error in send-login-code:", mailErr);
        return res
          .status(500)
          .json({ message: "Failed to send email, check email config" });
      }

      res.json({ message: "Verification code sent to email" });
    } catch (err) {
      console.error("send-login-code error:", err);
      res.status(500).json({ message: "Server error" });
    }
  }
);

// verify login code and generate JWT
router.post(
  "/verify-login-code",
  [
    body("email").isEmail().withMessage("Valid email required"),
    body("code").isLength({ min: 4 }).withMessage("Code required"),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty())
      return res.status(400).json({ errors: errors.array() });

    const { email, code } = req.body;

    try {
      const user = await User.findOne({ email });
      if (
        !user ||
        !user.loginCode ||
        user.loginCode !== code ||
        !user.loginCodeExpires ||
        user.loginCodeExpires < Date.now()
      ) {
        return res.status(400).json({ message: "Invalid or expired code" });
      }

      user.loginCode = undefined;
      user.loginCodeExpires = undefined;
      await user.save();

      const payload = {
        id: user._id,
        role: user.role,
        email: user.email,
        name: user.name,
      };
      const token = jwt.sign(payload, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES_IN || "7d",
      });

      res.json({
        message: "Login successful",
        token,
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
        },
      });
    } catch (err) {
      console.error("verify-login-code error:", err);
      res.status(500).json({ message: "Server error" });
    }
  }
);

// -------------------
// FORGOT / RESET PASSWORD
// -------------------

// send reset code to email
router.post(
  "/forgot-password",
  [body("email").isEmail().withMessage("Valid email required")],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty())
      return res.status(400).json({ errors: errors.array() });

    const { email } = req.body;

    try {
      const user = await User.findOne({ email });
      if (!user)
        return res
          .status(404)
          .json({ message: "User with this email not found" });

      const resetCode = generateOtp();
      const expiry = Date.now() + 10 * 60 * 1000; // 10 minutes

      user.resetPasswordCode = resetCode;
      user.resetPasswordExpires = expiry;
      await user.save();

      try {
        await sendCodeEmail(
          email,
          "Password reset code",
          `Your password reset code for Smart Pharmacy is: ${resetCode}\nThis code will expire in 10 minutes.`
        );
      } catch (mailErr) {
        console.error("Nodemailer error in forgot-password:", mailErr);
        return res
          .status(500)
          .json({ message: "Failed to send email, check email config" });
      }

      res.json({ message: "Reset code sent to email" });
    } catch (err) {
      console.error("forgot-password route error:", err);
      res.status(500).json({ message: "Server error" });
    }
  }
);

// verify reset code and set new password
router.post(
  "/reset-password",
  [
    body("email").isEmail().withMessage("Valid email required"),
    body("code").isLength({ min: 4 }).withMessage("Code required"),
    body("newPassword")
      .isLength({ min: 6 })
      .withMessage("New password min 6 chars"),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty())
      return res.status(400).json({ errors: errors.array() });

    const { email, code, newPassword } = req.body;

    try {
      const user = await User.findOne({ email });
      if (
        !user ||
        !user.resetPasswordCode ||
        user.resetPasswordCode !== code ||
        !user.resetPasswordExpires ||
        user.resetPasswordExpires < Date.now()
      ) {
        return res
          .status(400)
          .json({ message: "Invalid or expired reset code" });
      }

      const hashedPassword = await bcrypt.hash(newPassword, 10);
      user.password = hashedPassword;
      user.resetPasswordCode = undefined;
      user.resetPasswordExpires = undefined;
      await user.save();

      res.json({ message: "Password reset successfully" });
    } catch (err) {
      console.error("reset-password route error:", err);
      res.status(500).json({ message: "Server error" });
    }
  }
);

// -------------------
// GET CURRENT USER
// -------------------
router.get("/me", authenticateToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json(user);
  } catch (err) {
    console.error("Get me error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// -------------------
// GOOGLE AUTH (if used)
// -------------------
router.get(
  "/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

router.get(
  "/google/callback",
  passport.authenticate("google", {
    failureRedirect: "http://localhost:3000/login",
  }),
  (req, res) => {
    res.redirect(`http://localhost:3000/dashboard?token=${req.user.token}`);
  }
);

module.exports = router;
