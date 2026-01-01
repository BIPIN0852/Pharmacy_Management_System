// const express = require("express");
// const { body, validationResult } = require("express-validator");
// const bcrypt = require("bcryptjs");
// const jwt = require("jsonwebtoken");
// const passport = require("passport");
// const nodemailer = require("nodemailer");

// const User = require("../models/User");
// const authenticateToken = require("../middleware/auth");

// const router = express.Router();

// // -------------------
// // EMAIL TRANSPORT (for codes)
// // -------------------
// const transporter = nodemailer.createTransport({
//   host: "smtp.gmail.com",
//   port: 587,
//   secure: false,
//   auth: {
//     user: process.env.SMTP_USER,
//     pass: process.env.SMTP_PASSWORD,
//   },
// });

// async function sendCodeEmail(to, subject, text) {
//   if (!process.env.SMTP_USER || !process.env.SMTP_PASSWORD) {
//     console.warn(
//       "⚠️ SMTP_USER or SMTP_PASSWORD not set; logging email instead."
//     );
//     console.log("TO:", to);
//     console.log("SUBJECT:", subject);
//     console.log("TEXT:", text);
//     return;
//   }

//   return transporter.sendMail({
//     from: `"Smart Pharmacy" <${process.env.SMTP_USER}>`,
//     to,
//     subject,
//     text,
//   });
// }

// // Utility to generate 6-digit OTP
// function generateOtp() {
//   return Math.floor(100000 + Math.random() * 900000).toString();
// }

// // // -------------------
// // // REGISTER (customer only, with OTP)
// // // -------------------
// router.post(
//   "/register",
//   [
//     body("name").isLength({ min: 2 }).withMessage("Name required"),
//     body("email").isEmail().withMessage("Valid email required"),
//     body("password").isLength({ min: 6 }).withMessage("Password min 6 chars"),
//     // no role here – always customer
//   ],
//   async (req, res) => {
//     const errors = validationResult(req);
//     if (!errors.isEmpty())
//       return res.status(400).json({ errors: errors.array() });

//     const { name, email, password, phone } = req.body;

//     try {
//       let user = await User.findOne({ email });

//       if (user) {
//         // If user already exists but not verified, allow regenerating OTP
//         if (!user.isVerified) {
//           const otpCode = generateOtp();
//           const expiry = new Date(Date.now() + 10 * 60 * 1000);

//           user.otpCode = otpCode;
//           user.otpExpires = expiry;
//           user.name = name;
//           user.phone = phone;
//           user.role = "customer"; // force customer
//           user.password = await bcrypt.hash(password, 10);
//           await user.save();

//           try {
//             await sendCodeEmail(
//               email,
//               "Your Smart Pharmacy verification code",
//               `Your verification code is: ${otpCode}\nThis code will expire in 10 minutes.`
//             );
//           } catch (mailErr) {
//             console.error("Nodemailer error in register:", mailErr);
//             return res
//               .status(500)
//               .json({ message: "Failed to send email, check email config" });
//           }

//           return res.json({
//             message: "Verification code resent to your email.",
//           });
//         }

//         return res
//           .status(400)
//           .json({ message: "User with that email already exists" });
//       }

//       const hashedPassword = await bcrypt.hash(password, 10);
//       const otpCode = generateOtp();
//       const expiry = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

//       user = new User({
//         name,
//         email,
//         password: hashedPassword,
//         role: "customer", // forced
//         phone,
//         isVerified: false,
//         otpCode,
//         otpExpires: expiry,
//       });
//       await user.save();

//       try {
//         await sendCodeEmail(
//           email,
//           "Your Smart Pharmacy verification code",
//           `Your verification code is: ${otpCode}\nThis code will expire in 10 minutes.`
//         );
//       } catch (mailErr) {
//         console.error("Nodemailer error in register:", mailErr);
//         return res
//           .status(500)
//           .json({ message: "Failed to send email, check email config" });
//       }

//       res.status(201).json({
//         message: "User registered. Verification code sent to your email.",
//       });
//     } catch (err) {
//       console.error("Register error:", err);
//       res.status(500).json({ message: "Server error" });
//     }
//   }
// );

// // -------------------
// // VERIFY OTP (registration)
// // -------------------
// router.post(
//   "/verify-otp",
//   [
//     body("email").isEmail().withMessage("Valid email required"),
//     body("otp").isLength({ min: 4 }).withMessage("OTP required"),
//   ],
//   async (req, res) => {
//     const errors = validationResult(req);
//     if (!errors.isEmpty())
//       return res.status(400).json({ errors: errors.array() });

//     const { email, otp } = req.body;

//     try {
//       const user = await User.findOne({ email });
//       console.log("VERIFY-OTP request:", { email, otp });
//       console.log(
//         "VERIFY-OTP user:",
//         user && {
//           isVerified: user.isVerified,
//           otpCode: user.otpCode,
//           otpExpires: user.otpExpires,
//           now: new Date(),
//         }
//       );

//       const cleanOtp = String(otp).trim();
//       if (
//         !user ||
//         !user.otpCode ||
//         String(user.otpCode).trim() !== cleanOtp ||
//         !user.otpExpires ||
//         user.otpExpires < Date.now()
//       ) {
//         return res.status(400).json({ message: "Invalid or expired OTP" });
//       }

//       user.isVerified = true;
//       user.otpCode = undefined;
//       user.otpExpires = undefined;
//       await user.save();

//       const payload = {
//         id: user._id,
//         role: user.role,
//         email: user.email,
//         name: user.name,
//       };
//       const token = jwt.sign(payload, process.env.JWT_SECRET, {
//         expiresIn: process.env.JWT_EXPIRES_IN || "7d",
//       });

//       res.json({
//         message: "Account verified successfully",
//         token,
//         role: user.role,
//         user: {
//           id: user._id,
//           name: user.name,
//           email: user.email,
//           role: user.role,
//         },
//       });
//     } catch (err) {
//       console.error("verify-otp error:", err);
//       res.status(500).json({ message: "Server error" });
//     }
//   }
// );

// // -------------------
// // RESEND OTP (registration)
// // -------------------
// router.post(
//   "/resend-otp",
//   [body("email").isEmail().withMessage("Valid email required")],
//   async (req, res) => {
//     const errors = validationResult(req);
//     if (!errors.isEmpty())
//       return res.status(400).json({ errors: errors.array() });

//     const { email } = req.body;

//     try {
//       const user = await User.findOne({ email });

//       if (!user) {
//         return res.status(404).json({
//           message: "User with this email not found. Please register.",
//         });
//       }

//       if (user.isVerified) {
//         return res
//           .status(400)
//           .json({ message: "Account already verified. Please log in." });
//       }

//       const otpCode = generateOtp();
//       const expiry = new Date(Date.now() + 10 * 60 * 1000);

//       user.otpCode = otpCode;
//       user.otpExpires = expiry;
//       await user.save();

//       try {
//         await sendCodeEmail(
//           email,
//           "Your Smart Pharmacy verification code",
//           `Your verification code is: ${otpCode}\nThis code will expire in 10 minutes.`
//         );
//       } catch (mailErr) {
//         console.error("Nodemailer error in resend-otp:", mailErr);
//         return res
//           .status(500)
//           .json({ message: "Failed to send email, check email config" });
//       }

//       res.json({ message: "Verification code resent to your email." });
//     } catch (err) {
//       console.error("resend-otp error:", err);
//       res.status(500).json({ message: "Server error" });
//     }
//   }
// );

// // -------------------
// // LOGIN (email + password)
// // -------------------
// router.post(
//   "/login",
//   [
//     body("email").isEmail().withMessage("Valid email required"),
//     body("password").exists().withMessage("Password required"),
//   ],
//   async (req, res) => {
//     const errors = validationResult(req);
//     if (!errors.isEmpty())
//       return res.status(400).json({ errors: errors.array() });

//     const { email, password } = req.body;

//     try {
//       const user = await User.findOne({ email });
//       if (!user)
//         return res.status(400).json({ message: "Invalid email or password" });

//       if (!user.isVerified) {
//         return res
//           .status(403)
//           .json({ message: "Account not verified. Please check your email." });
//       }

//       if (user.password) {
//         const isMatch = await bcrypt.compare(password, user.password);
//         if (!isMatch)
//           return res.status(400).json({ message: "Invalid email or password" });
//       }

//       const payload = {
//         id: user._id,
//         role: user.role,
//         email: user.email,
//         name: user.name,
//       };
//       const token = jwt.sign(payload, process.env.JWT_SECRET, {
//         expiresIn: process.env.JWT_EXPIRES_IN || "7d",
//       });

//       res.status(200).json({
//         message: "Logged in",
//         token,
//         user: {
//           id: user._id,
//           name: user.name,
//           email: user.email,
//           role: user.role,
//         },
//       });
//     } catch (err) {
//       console.error("Login error:", err);
//       res.status(500).json({ message: "Server error" });
//     }
//   }
// );

// // -------------------
// // ADMIN: create pharmacist/staff
// // -------------------
// router.post(
//   "/admin/create-user",
//   authenticateToken,
//   [
//     body("name").isLength({ min: 2 }).withMessage("Name required"),
//     body("email").isEmail().withMessage("Valid email required"),
//     body("password").isLength({ min: 6 }).withMessage("Password min 6 chars"),
//     body("role")
//       .isIn(["pharmacist", "staff"])
//       .withMessage("Role must be pharmacist or staff"),
//   ],
//   async (req, res) => {
//     if (req.user.role !== "admin") {
//       return res.status(403).json({ message: "Access denied. Admin only." });
//     }

//     const errors = validationResult(req);
//     if (!errors.isEmpty())
//       return res.status(400).json({ errors: errors.array() });

//     const { name, email, password, role, phone } = req.body;

//     try {
//       let user = await User.findOne({ email });
//       if (user) {
//         return res
//           .status(400)
//           .json({ message: "User with that email already exists" });
//       }

//       const hashedPassword = await bcrypt.hash(password, 10);

//       user = new User({
//         name,
//         email,
//         password: hashedPassword,
//         role, // pharmacist or staff
//         phone,
//         isVerified: true, // admin-created are auto-verified
//       });

//       await user.save();

//       res.status(201).json({
//         message: `User created as ${role}`,
//         user: {
//           id: user._id,
//           name: user.name,
//           email: user.email,
//           role: user.role,
//         },
//       });
//     } catch (err) {
//       console.error("admin create-user error:", err);
//       res.status(500).json({ message: "Server error" });
//     }
//   }
// );

// // -------------------
// // EMAIL CODE LOGIN
// // -------------------

// // send login verification code to email
// router.post(
//   "/send-login-code",
//   [body("email").isEmail().withMessage("Valid email required")],
//   async (req, res) => {
//     const errors = validationResult(req);
//     if (!errors.isEmpty())
//       return res.status(400).json({ errors: errors.array() });

//     const { email } = req.body;

//     try {
//       const user = await User.findOne({ email });
//       if (!user)
//         return res
//           .status(404)
//           .json({ message: "User with this email not found" });

//       const loginCode = generateOtp();
//       const expiry = Date.now() + 10 * 60 * 1000; // 10 minutes

//       user.loginCode = loginCode;
//       user.loginCodeExpires = expiry;
//       await user.save();

//       try {
//         await sendCodeEmail(
//           email,
//           "Your login verification code",
//           `Your Smart Pharmacy login code is: ${loginCode}\nThis code will expire in 10 minutes.`
//         );
//       } catch (mailErr) {
//         console.error("Nodemailer error in send-login-code:", mailErr);
//         return res
//           .status(500)
//           .json({ message: "Failed to send email, check email config" });
//       }

//       res.json({ message: "Verification code sent to email" });
//     } catch (err) {
//       console.error("send-login-code error:", err);
//       res.status(500).json({ message: "Server error" });
//     }
//   }
// );

// // verify login code and generate JWT
// router.post(
//   "/verify-login-code",
//   [
//     body("email").isEmail().withMessage("Valid email required"),
//     body("code").isLength({ min: 4 }).withMessage("Code required"),
//   ],
//   async (req, res) => {
//     const errors = validationResult(req);
//     if (!errors.isEmpty())
//       return res.status(400).json({ errors: errors.array() });

//     const { email, code } = req.body;

//     try {
//       const user = await User.findOne({ email });
//       if (
//         !user ||
//         !user.loginCode ||
//         user.loginCode !== code ||
//         !user.loginCodeExpires ||
//         user.loginCodeExpires < Date.now()
//       ) {
//         return res.status(400).json({ message: "Invalid or expired code" });
//       }

//       user.loginCode = undefined;
//       user.loginCodeExpires = undefined;
//       await user.save();

//       const payload = {
//         id: user._id,
//         role: user.role,
//         email: user.email,
//         name: user.name,
//       };
//       const token = jwt.sign(payload, process.env.JWT_SECRET, {
//         expiresIn: process.env.JWT_EXPIRES_IN || "7d",
//       });

//       res.json({
//         message: "Login successful",
//         token,
//         user: {
//           id: user._id,
//           name: user.name,
//           email: user.email,
//           role: user.role,
//         },
//       });
//     } catch (err) {
//       console.error("verify-login-code error:", err);
//       res.status(500).json({ message: "Server error" });
//     }
//   }
// );

// // -------------------
// // FORGOT / RESET PASSWORD
// // -------------------

// // send reset code to email
// router.post(
//   "/forgot-password",
//   [body("email").isEmail().withMessage("Valid email required")],
//   async (req, res) => {
//     const errors = validationResult(req);
//     if (!errors.isEmpty())
//       return res.status(400).json({ errors: errors.array() });

//     const { email } = req.body;

//     try {
//       const user = await User.findOne({ email });
//       if (!user)
//         return res
//           .status(404)
//           .json({ message: "User with this email not found" });

//       const resetCode = generateOtp();
//       const expiry = Date.now() + 10 * 60 * 1000; // 10 minutes

//       user.resetPasswordCode = resetCode;
//       user.resetPasswordExpires = expiry;
//       await user.save();

//       try {
//         await sendCodeEmail(
//           email,
//           "Password reset code",
//           `Your password reset code for Smart Pharmacy is: ${resetCode}\nThis code will expire in 10 minutes.`
//         );
//       } catch (mailErr) {
//         console.error("Nodemailer error in forgot-password:", mailErr);
//         return res
//           .status(500)
//           .json({ message: "Failed to send email, check email config" });
//       }

//       res.json({ message: "Reset code sent to email" });
//     } catch (err) {
//       console.error("forgot-password route error:", err);
//       res.status(500).json({ message: "Server error" });
//     }
//   }
// );

// // verify reset code and set new password
// router.post(
//   "/reset-password",
//   [
//     body("email").isEmail().withMessage("Valid email required"),
//     body("code").isLength({ min: 4 }).withMessage("Code required"),
//     body("newPassword")
//       .isLength({ min: 6 })
//       .withMessage("New password min 6 chars"),
//   ],
//   async (req, res) => {
//     const errors = validationResult(req);
//     if (!errors.isEmpty())
//       return res.status(400).json({ errors: errors.array() });

//     const { email, code, newPassword } = req.body;

//     try {
//       const user = await User.findOne({ email });
//       if (
//         !user ||
//         !user.resetPasswordCode ||
//         user.resetPasswordCode !== code ||
//         !user.resetPasswordExpires ||
//         user.resetPasswordExpires < Date.now()
//       ) {
//         return res
//           .status(400)
//           .json({ message: "Invalid or expired reset code" });
//       }

//       const hashedPassword = await bcrypt.hash(newPassword, 10);
//       user.password = hashedPassword;
//       user.resetPasswordCode = undefined;
//       user.resetPasswordExpires = undefined;
//       await user.save();

//       res.json({ message: "Password reset successfully" });
//     } catch (err) {
//       console.error("reset-password route error:", err);
//       res.status(500).json({ message: "Server error" });
//     }
//   }
// );

// // -------------------
// // GET CURRENT USER
// // -------------------
// router.get("/me", authenticateToken, async (req, res) => {
//   try {
//     const user = await User.findById(req.user.id).select("-password");
//     if (!user) return res.status(404).json({ message: "User not found" });
//     res.json(user);
//   } catch (err) {
//     console.error("Get me error:", err);
//     res.status(500).json({ message: "Server error" });
//   }
// });

// // -------------------
// // GOOGLE AUTH (if used)
// // -------------------
// router.get(
//   "/google",
//   passport.authenticate("google", { scope: ["profile", "email"] })
// );

// router.get(
//   "/google/callback",
//   passport.authenticate("google", {
//     failureRedirect: "http://localhost:3000/login",
//   }),
//   (req, res) => {
//     res.redirect(`http://localhost:3000/dashboard?token=${req.user.token}`);
//   }
// );

// module.exports = router;

// const express = require("express");
// const { body, validationResult } = require("express-validator");
// const bcrypt = require("bcryptjs");
// const jwt = require("jsonwebtoken");
// const passport = require("passport");
// const nodemailer = require("nodemailer");

// const User = require("../models/User");
// const authenticateToken = require("../middleware/auth");

// const router = express.Router();

// // -------------------
// // EMAIL TRANSPORT (for codes)
// // -------------------
// const transporter = nodemailer.createTransport({
//   host: "smtp.gmail.com",
//   port: 587,
//   secure: false,
//   auth: {
//     user: process.env.SMTP_USER,
//     pass: process.env.SMTP_PASSWORD,
//   },
// });

// async function sendCodeEmail(to, subject, text) {
//   if (!process.env.SMTP_USER || !process.env.SMTP_PASSWORD) {
//     console.warn(
//       "⚠️ SMTP_USER or SMTP_PASSWORD not set; logging email instead."
//     );
//     console.log("TO:", to);
//     console.log("SUBJECT:", subject);
//     console.log("TEXT:", text);
//     return;
//   }

//   return transporter.sendMail({
//     from: `"Smart Pharmacy" <${process.env.SMTP_USER}>`,
//     to,
//     subject,
//     text,
//   });
// }

// // Utility to generate 6-digit OTP
// function generateOtp() {
//   return Math.floor(100000 + Math.random() * 900000).toString();
// }

// // // -------------------
// // // REGISTER (customer only, with OTP)
// // // -------------------
// router.post(
//   "/register",
//   [
//     body("name").isLength({ min: 2 }).withMessage("Name required"),
//     body("email").isEmail().withMessage("Valid email required"),
//     body("password").isLength({ min: 6 }).withMessage("Password min 6 chars"),
//     // no role here – always customer
//   ],
//   async (req, res) => {
//     const errors = validationResult(req);
//     if (!errors.isEmpty())
//       return res.status(400).json({ errors: errors.array() });

//     const { name, email, password, phone } = req.body;

//     try {
//       let user = await User.findOne({ email });

//       if (user) {
//         // If user already exists but not verified, allow regenerating OTP
//         if (!user.isVerified) {
//           const otpCode = generateOtp();
//           const expiry = new Date(Date.now() + 10 * 60 * 1000);

//           user.otpCode = otpCode;
//           user.otpExpires = expiry;
//           user.name = name;
//           user.phone = phone;
//           user.role = "customer"; // force customer
//           user.password = await bcrypt.hash(password, 10);
//           await user.save();

//           try {
//             await sendCodeEmail(
//               email,
//               "Your Smart Pharmacy verification code",
//               `Your verification code is: ${otpCode}\nThis code will expire in 10 minutes.`
//             );
//           } catch (mailErr) {
//             console.error("Nodemailer error in register:", mailErr);
//             return res
//               .status(500)
//               .json({ message: "Failed to send email, check email config" });
//           }

//           return res.json({
//             message: "Verification code resent to your email.",
//           });
//         }

//         return res
//           .status(400)
//           .json({ message: "User with that email already exists" });
//       }

//       const hashedPassword = await bcrypt.hash(password, 10);
//       const otpCode = generateOtp();
//       const expiry = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

//       user = new User({
//         name,
//         email,
//         password: hashedPassword,
//         role: "customer", // forced
//         phone,
//         isVerified: false,
//         otpCode,
//         otpExpires: expiry,
//       });
//       await user.save();

//       try {
//         await sendCodeEmail(
//           email,
//           "Your Smart Pharmacy verification code",
//           `Your verification code is: ${otpCode}\nThis code will expire in 10 minutes.`
//         );
//       } catch (mailErr) {
//         console.error("Nodemailer error in register:", mailErr);
//         return res
//           .status(500)
//           .json({ message: "Failed to send email, check email config" });
//       }

//       res.status(201).json({
//         message: "User registered. Verification code sent to your email.",
//       });
//     } catch (err) {
//       console.error("Register error:", err);
//       res.status(500).json({ message: "Server error" });
//     }
//   }
// );

// // -------------------
// // VERIFY OTP (registration)
// // -------------------
// router.post(
//   "/verify-otp",
//   [
//     body("email").isEmail().withMessage("Valid email required"),
//     body("otp").isLength({ min: 4 }).withMessage("OTP required"),
//   ],
//   async (req, res) => {
//     const errors = validationResult(req);
//     if (!errors.isEmpty())
//       return res.status(400).json({ errors: errors.array() });

//     const { email, otp } = req.body;

//     try {
//       const user = await User.findOne({ email });
//       console.log("VERIFY-OTP request:", { email, otp });
//       console.log(
//         "VERIFY-OTP user:",
//         user && {
//           isVerified: user.isVerified,
//           otpCode: user.otpCode,
//           otpExpires: user.otpExpires,
//           now: new Date(),
//         }
//       );

//       const cleanOtp = String(otp).trim();
//       if (
//         !user ||
//         !user.otpCode ||
//         String(user.otpCode).trim() !== cleanOtp ||
//         !user.otpExpires ||
//         user.otpExpires < Date.now()
//       ) {
//         return res.status(400).json({ message: "Invalid or expired OTP" });
//       }

//       user.isVerified = true;
//       user.otpCode = undefined;
//       user.otpExpires = undefined;
//       await user.save();

//       const payload = {
//         id: user._id,
//         role: user.role,
//         email: user.email,
//         name: user.name,
//       };
//       const token = jwt.sign(payload, process.env.JWT_SECRET, {
//         expiresIn: process.env.JWT_EXPIRES_IN || "7d",
//       });

//       res.json({
//         message: "Account verified successfully",
//         token,
//         role: user.role,
//         user: {
//           id: user._id,
//           name: user.name,
//           email: user.email,
//           role: user.role,
//         },
//       });
//     } catch (err) {
//       console.error("verify-otp error:", err);
//       res.status(500).json({ message: "Server error" });
//     }
//   }
// );

// // -------------------
// // RESEND OTP (registration)
// // -------------------
// router.post(
//   "/resend-otp",
//   [body("email").isEmail().withMessage("Valid email required")],
//   async (req, res) => {
//     const errors = validationResult(req);
//     if (!errors.isEmpty())
//       return res.status(400).json({ errors: errors.array() });

//     const { email } = req.body;

//     try {
//       const user = await User.findOne({ email });

//       if (!user) {
//         return res.status(404).json({
//           message: "User with this email not found. Please register.",
//         });
//       }

//       if (user.isVerified) {
//         return res
//           .status(400)
//           .json({ message: "Account already verified. Please log in." });
//       }

//       const otpCode = generateOtp();
//       const expiry = new Date(Date.now() + 10 * 60 * 1000);

//       user.otpCode = otpCode;
//       user.otpExpires = expiry;
//       await user.save();

//       try {
//         await sendCodeEmail(
//           email,
//           "Your Smart Pharmacy verification code",
//           `Your verification code is: ${otpCode}\nThis code will expire in 10 minutes.`
//         );
//       } catch (mailErr) {
//         console.error("Nodemailer error in resend-otp:", mailErr);
//         return res
//           .status(500)
//           .json({ message: "Failed to send email, check email config" });
//       }

//       res.json({ message: "Verification code resent to your email." });
//     } catch (err) {
//       console.error("resend-otp error:", err);
//       res.status(500).json({ message: "Server error" });
//     }
//   }
// );

// // -------------------
// // LOGIN (email + password)
// // -------------------
// router.post(
//   "/login",
//   [
//     body("email").isEmail().withMessage("Valid email required"),
//     body("password").exists().withMessage("Password required"),
//   ],
//   async (req, res) => {
//     const errors = validationResult(req);
//     if (!errors.isEmpty())
//       return res.status(400).json({ errors: errors.array() });

//     const { email, password } = req.body;

//     try {
//       const user = await User.findOne({ email });
//       if (!user)
//         return res.status(400).json({ message: "Invalid email or password" });

//       if (!user.isVerified) {
//         return res
//           .status(403)
//           .json({ message: "Account not verified. Please check your email." });
//       }

//       if (user.password) {
//         const isMatch = await bcrypt.compare(password, user.password);
//         if (!isMatch)
//           return res.status(400).json({ message: "Invalid email or password" });
//       }

//       const payload = {
//         id: user._id,
//         role: user.role,
//         email: user.email,
//         name: user.name,
//       };
//       const token = jwt.sign(payload, process.env.JWT_SECRET, {
//         expiresIn: process.env.JWT_EXPIRES_IN || "7d",
//       });

//       res.status(200).json({
//         message: "Logged in",
//         token,
//         user: {
//           id: user._id,
//           name: user.name,
//           email: user.email,
//           role: user.role,
//         },
//       });
//     } catch (err) {
//       console.error("Login error:", err);
//       res.status(500).json({ message: "Server error" });
//     }
//   }
// );

// // -------------------
// // ADMIN: create pharmacist/staff
// // -------------------
// router.post(
//   "/admin/create-user",
//   authenticateToken,
//   [
//     body("name").isLength({ min: 2 }).withMessage("Name required"),
//     body("email").isEmail().withMessage("Valid email required"),
//     body("password").isLength({ min: 6 }).withMessage("Password min 6 chars"),
//     body("role")
//       .isIn(["pharmacist", "staff"])
//       .withMessage("Role must be pharmacist or staff"),
//   ],
//   async (req, res) => {
//     if (req.user.role !== "admin") {
//       return res.status(403).json({ message: "Access denied. Admin only." });
//     }

//     const errors = validationResult(req);
//     if (!errors.isEmpty())
//       return res.status(400).json({ errors: errors.array() });

//     const { name, email, password, role, phone } = req.body;

//     try {
//       let user = await User.findOne({ email });
//       if (user) {
//         return res
//           .status(400)
//           .json({ message: "User with that email already exists" });
//       }

//       const hashedPassword = await bcrypt.hash(password, 10);

//       user = new User({
//         name,
//         email,
//         password: hashedPassword,
//         role, // pharmacist or staff
//         phone,
//         isVerified: true, // admin-created are auto-verified
//       });

//       await user.save();

//       res.status(201).json({
//         message: `User created as ${role}`,
//         user: {
//           id: user._id,
//           name: user.name,
//           email: user.email,
//           role: user.role,
//         },
//       });
//     } catch (err) {
//       console.error("admin create-user error:", err);
//       res.status(500).json({ message: "Server error" });
//     }
//   }
// );

// // -------------------
// // EMAIL CODE LOGIN
// // -------------------

// // send login verification code to email
// router.post(
//   "/send-login-code",
//   [body("email").isEmail().withMessage("Valid email required")],
//   async (req, res) => {
//     const errors = validationResult(req);
//     if (!errors.isEmpty())
//       return res.status(400).json({ errors: errors.array() });

//     const { email } = req.body;

//     try {
//       const user = await User.findOne({ email });
//       if (!user)
//         return res
//           .status(404)
//           .json({ message: "User with this email not found" });

//       const loginCode = generateOtp();
//       const expiry = Date.now() + 10 * 60 * 1000; // 10 minutes

//       user.loginCode = loginCode;
//       user.loginCodeExpires = expiry;
//       await user.save();

//       try {
//         await sendCodeEmail(
//           email,
//           "Your login verification code",
//           `Your Smart Pharmacy login code is: ${loginCode}\nThis code will expire in 10 minutes.`
//         );
//       } catch (mailErr) {
//         console.error("Nodemailer error in send-login-code:", mailErr);
//         return res
//           .status(500)
//           .json({ message: "Failed to send email, check email config" });
//       }

//       res.json({ message: "Verification code sent to email" });
//     } catch (err) {
//       console.error("send-login-code error:", err);
//       res.status(500).json({ message: "Server error" });
//     }
//   }
// );

// // verify login code and generate JWT
// router.post(
//   "/verify-login-code",
//   [
//     body("email").isEmail().withMessage("Valid email required"),
//     body("code").isLength({ min: 4 }).withMessage("Code required"),
//   ],
//   async (req, res) => {
//     const errors = validationResult(req);
//     if (!errors.isEmpty())
//       return res.status(400).json({ errors: errors.array() });

//     const { email, code } = req.body;

//     try {
//       const user = await User.findOne({ email });
//       if (
//         !user ||
//         !user.loginCode ||
//         user.loginCode !== code ||
//         !user.loginCodeExpires ||
//         user.loginCodeExpires < Date.now()
//       ) {
//         return res.status(400).json({ message: "Invalid or expired code" });
//       }

//       user.loginCode = undefined;
//       user.loginCodeExpires = undefined;
//       await user.save();

//       const payload = {
//         id: user._id,
//         role: user.role,
//         email: user.email,
//         name: user.name,
//       };
//       const token = jwt.sign(payload, process.env.JWT_SECRET, {
//         expiresIn: process.env.JWT_EXPIRES_IN || "7d",
//       });

//       res.json({
//         message: "Login successful",
//         token,
//         user: {
//           id: user._id,
//           name: user.name,
//           email: user.email,
//           role: user.role,
//         },
//       });
//     } catch (err) {
//       console.error("verify-login-code error:", err);
//       res.status(500).json({ message: "Server error" });
//     }
//   }
// );

// // -------------------
// // FORGOT / RESET PASSWORD
// // -------------------

// // send reset code to email
// router.post(
//   "/forgot-password",
//   [body("email").isEmail().withMessage("Valid email required")],
//   async (req, res) => {
//     const errors = validationResult(req);
//     if (!errors.isEmpty())
//       return res.status(400).json({ errors: errors.array() });

//     const { email } = req.body;

//     try {
//       const user = await User.findOne({ email });
//       if (!user)
//         return res
//           .status(404)
//           .json({ message: "User with this email not found" });

//       const resetCode = generateOtp();
//       const expiry = Date.now() + 10 * 60 * 1000; // 10 minutes

//       user.resetPasswordCode = resetCode;
//       user.resetPasswordExpires = expiry;
//       await user.save();

//       try {
//         await sendCodeEmail(
//           email,
//           "Password reset code",
//           `Your password reset code for Smart Pharmacy is: ${resetCode}\nThis code will expire in 10 minutes.`
//         );
//       } catch (mailErr) {
//         console.error("Nodemailer error in forgot-password:", mailErr);
//         return res
//           .status(500)
//           .json({ message: "Failed to send email, check email config" });
//       }

//       res.json({ message: "Reset code sent to email" });
//     } catch (err) {
//       console.error("forgot-password route error:", err);
//       res.status(500).json({ message: "Server error" });
//     }
//   }
// );

// // verify reset code and set new password
// router.post(
//   "/reset-password",
//   [
//     body("email").isEmail().withMessage("Valid email required"),
//     body("code").isLength({ min: 4 }).withMessage("Code required"),
//     body("newPassword")
//       .isLength({ min: 6 })
//       .withMessage("New password min 6 chars"),
//   ],
//   async (req, res) => {
//     const errors = validationResult(req);
//     if (!errors.isEmpty())
//       return res.status(400).json({ errors: errors.array() });

//     const { email, code, newPassword } = req.body;

//     try {
//       const user = await User.findOne({ email });
//       if (
//         !user ||
//         !user.resetPasswordCode ||
//         user.resetPasswordCode !== code ||
//         !user.resetPasswordExpires ||
//         user.resetPasswordExpires < Date.now()
//       ) {
//         return res
//           .status(400)
//           .json({ message: "Invalid or expired reset code" });
//       }

//       const hashedPassword = await bcrypt.hash(newPassword, 10);
//       user.password = hashedPassword;
//       user.resetPasswordCode = undefined;
//       user.resetPasswordExpires = undefined;
//       await user.save();

//       res.json({ message: "Password reset successfully" });
//     } catch (err) {
//       console.error("reset-password route error:", err);
//       res.status(500).json({ message: "Server error" });
//     }
//   }
// );

// // -------------------
// // GET CURRENT USER
// // -------------------
// router.get("/me", authenticateToken, async (req, res) => {
//   try {
//     const user = await User.findById(req.user.id).select("-password");
//     if (!user) return res.status(404).json({ message: "User not found" });
//     res.json(user);
//   } catch (err) {
//     console.error("Get me error:", err);
//     res.status(500).json({ message: "Server error" });
//   }
// });

// // -------------------
// // PROFILE: GET & UPDATE (Added for Profile Page)
// // -------------------
// router.get("/profile", authenticateToken, async (req, res) => {
//   try {
//     const user = await User.findById(req.user.id).select("-password");
//     if (!user) return res.status(404).json({ message: "User not found" });
//     res.json(user);
//   } catch (err) {
//     console.error("Get profile error:", err);
//     res.status(500).json({ message: "Server error" });
//   }
// });

// router.put("/profile", authenticateToken, async (req, res) => {
//   try {
//     const user = await User.findById(req.user.id);
//     if (!user) return res.status(404).json({ message: "User not found" });

//     // Update fields if present in body
//     const {
//       name,
//       phone,
//       gender,
//       dob,
//       address,
//       bloodGroup,
//       allergies,
//       chronicConditions,
//       emergencyContact,
//     } = req.body;

//     if (name) user.name = name;
//     if (phone) user.phone = phone;
//     if (gender) user.gender = gender;
//     if (dob) user.dob = dob;
//     if (address) user.address = address;
//     if (bloodGroup) user.bloodGroup = bloodGroup;
//     if (allergies) user.allergies = allergies;
//     if (chronicConditions) user.chronicConditions = chronicConditions;
//     if (emergencyContact) user.emergencyContact = emergencyContact;

//     const updatedUser = await user.save();

//     // Return updated user without password
//     const userResponse = updatedUser.toObject();
//     delete userResponse.password;

//     res.json(userResponse);
//   } catch (err) {
//     console.error("Update profile error:", err);
//     res.status(500).json({ message: "Server error" });
//   }
// });

// // -------------------
// // GOOGLE AUTH (if used)
// // -------------------
// router.get(
//   "/google",
//   passport.authenticate("google", { scope: ["profile", "email"] })
// );

// router.get(
//   "/google/callback",
//   passport.authenticate("google", {
//     failureRedirect: "http://localhost:3000/login",
//   }),
//   (req, res) => {
//     res.redirect(`http://localhost:3000/dashboard?token=${req.user.token}`);
//   }
// );

// module.exports = router;

// const express = require("express");
// const { body, validationResult } = require("express-validator");
// const bcrypt = require("bcryptjs");
// const jwt = require("jsonwebtoken");
// const passport = require("passport");
// const nodemailer = require("nodemailer");

// const User = require("../models/User");
// const authenticateToken = require("../middleware/auth");

// const router = express.Router();

// // -------------------
// // EMAIL TRANSPORT
// // -------------------
// const transporter = nodemailer.createTransport({
//   host: "smtp.gmail.com",
//   port: 587,
//   secure: false,
//   auth: {
//     user: process.env.SMTP_USER,
//     pass: process.env.SMTP_PASSWORD,
//   },
// });

// async function sendCodeEmail(to, subject, text) {
//   if (!process.env.SMTP_USER || !process.env.SMTP_PASSWORD) {
//     console.warn(
//       "⚠️ SMTP_USER or SMTP_PASSWORD not set; logging email instead."
//     );
//     console.log("TO:", to, "SUBJECT:", subject, "TEXT:", text);
//     return;
//   }
//   return transporter.sendMail({
//     from: `"Smart Pharmacy" <${process.env.SMTP_USER}>`,
//     to,
//     subject,
//     text,
//   });
// }

// function generateOtp() {
//   return Math.floor(100000 + Math.random() * 900000).toString();
// }

// // -------------------
// // REGISTER
// // -------------------
// router.post(
//   "/register",
//   [
//     body("name").isLength({ min: 2 }).withMessage("Name required"),
//     body("email").isEmail().withMessage("Valid email required"),
//     body("password").isLength({ min: 6 }).withMessage("Password min 6 chars"),
//   ],
//   async (req, res) => {
//     const errors = validationResult(req);
//     if (!errors.isEmpty())
//       return res.status(400).json({ errors: errors.array() });

//     const { name, email, password, phone } = req.body;

//     try {
//       let user = await User.findOne({ email });

//       if (user) {
//         if (!user.isVerified) {
//           const otpCode = generateOtp();
//           const expiry = new Date(Date.now() + 10 * 60 * 1000);

//           user.otpCode = otpCode;
//           user.otpExpires = expiry;
//           user.name = name;
//           user.phone = phone;
//           user.role = "customer";
//           user.password = await bcrypt.hash(password, 10);
//           await user.save();

//           try {
//             await sendCodeEmail(email, "Verification Code", `Code: ${otpCode}`);
//           } catch (e) {
//             console.error(e);
//           }
//           return res.json({ message: "Verification code resent." });
//         }
//         return res.status(400).json({ message: "User already exists" });
//       }

//       const hashedPassword = await bcrypt.hash(password, 10);
//       const otpCode = generateOtp();
//       const expiry = new Date(Date.now() + 10 * 60 * 1000);

//       user = new User({
//         name,
//         email,
//         password: hashedPassword,
//         role: "customer",
//         phone,
//         isVerified: false,
//         otpCode,
//         otpExpires: expiry,
//       });
//       await user.save();

//       try {
//         await sendCodeEmail(email, "Verification Code", `Code: ${otpCode}`);
//       } catch (e) {
//         console.error(e);
//       }

//       res.status(201).json({ message: "Registered. Code sent to email." });
//     } catch (err) {
//       console.error(err);
//       res.status(500).json({ message: "Server error" });
//     }
//   }
// );

// // -------------------
// // VERIFY OTP
// // -------------------
// router.post(
//   "/verify-otp",
//   [body("email").isEmail(), body("otp").isLength({ min: 4 })],
//   async (req, res) => {
//     const { email, otp } = req.body;
//     try {
//       const user = await User.findOne({ email });
//       if (!user || user.otpCode !== otp || user.otpExpires < Date.now()) {
//         return res.status(400).json({ message: "Invalid/Expired OTP" });
//       }
//       user.isVerified = true;
//       user.otpCode = undefined;
//       user.otpExpires = undefined;
//       await user.save();

//       const token = jwt.sign(
//         { id: user._id, role: user.role },
//         process.env.JWT_SECRET,
//         { expiresIn: "7d" }
//       );
//       res.json({ message: "Verified", token, user });
//     } catch (err) {
//       res.status(500).json({ message: "Server error" });
//     }
//   }
// );

// // -------------------
// // RESEND OTP
// // -------------------
// router.post("/resend-otp", async (req, res) => {
//   const { email } = req.body;
//   try {
//     const user = await User.findOne({ email });
//     if (!user) return res.status(404).json({ message: "User not found" });
//     if (user.isVerified)
//       return res.status(400).json({ message: "Already verified" });

//     const otpCode = generateOtp();
//     user.otpCode = otpCode;
//     user.otpExpires = Date.now() + 10 * 60 * 1000;
//     await user.save();

//     await sendCodeEmail(email, "Verification Code", `Code: ${otpCode}`);
//     res.json({ message: "Code resent" });
//   } catch (err) {
//     res.status(500).json({ message: "Server error" });
//   }
// });

// // -------------------
// // LOGIN
// // -------------------
// router.post("/login", async (req, res) => {
//   const { email, password } = req.body;
//   try {
//     const user = await User.findOne({ email });
//     if (!user) return res.status(400).json({ message: "Invalid credentials" });
//     if (!user.isVerified)
//       return res.status(403).json({ message: "Not verified" });

//     const isMatch = await bcrypt.compare(password, user.password);
//     if (!isMatch)
//       return res.status(400).json({ message: "Invalid credentials" });

//     const token = jwt.sign(
//       { id: user._id, role: user.role },
//       process.env.JWT_SECRET,
//       { expiresIn: "7d" }
//     );
//     res.json({ message: "Logged in", token, user });
//   } catch (err) {
//     res.status(500).json({ message: "Server error" });
//   }
// });

// // -------------------
// // ADMIN CREATE USER
// // -------------------
// router.post("/admin/create-user", authenticateToken, async (req, res) => {
//   if (req.user.role !== "admin")
//     return res.status(403).json({ message: "Admin only" });
//   const { name, email, password, role, phone } = req.body;
//   try {
//     if (await User.findOne({ email }))
//       return res.status(400).json({ message: "User exists" });
//     const user = new User({
//       name,
//       email,
//       password: await bcrypt.hash(password, 10),
//       role,
//       phone,
//       isVerified: true,
//     });
//     await user.save();
//     res.status(201).json({ message: "User created", user });
//   } catch (err) {
//     res.status(500).json({ message: "Server error" });
//   }
// });

// // -------------------
// // EMAIL CODE LOGIN (Send & Verify)
// // -------------------
// router.post("/send-login-code", async (req, res) => {
//   const { email } = req.body;
//   try {
//     const user = await User.findOne({ email });
//     if (!user) return res.status(404).json({ message: "User not found" });
//     const code = generateOtp();
//     user.loginCode = code;
//     user.loginCodeExpires = Date.now() + 10 * 60 * 1000;
//     await user.save();
//     await sendCodeEmail(email, "Login Code", `Code: ${code}`);
//     res.json({ message: "Code sent" });
//   } catch (err) {
//     res.status(500).json({ message: "Server error" });
//   }
// });

// router.post("/verify-login-code", async (req, res) => {
//   const { email, code } = req.body;
//   try {
//     const user = await User.findOne({ email });
//     if (
//       !user ||
//       user.loginCode !== code ||
//       user.loginCodeExpires < Date.now()
//     ) {
//       return res.status(400).json({ message: "Invalid code" });
//     }
//     user.loginCode = undefined;
//     user.loginCodeExpires = undefined;
//     await user.save();
//     const token = jwt.sign(
//       { id: user._id, role: user.role },
//       process.env.JWT_SECRET,
//       { expiresIn: "7d" }
//     );
//     res.json({ message: "Logged in", token, user });
//   } catch (err) {
//     res.status(500).json({ message: "Server error" });
//   }
// });

// // -------------------
// // PASSWORD RESET
// // -------------------
// router.post("/forgot-password", async (req, res) => {
//   const { email } = req.body;
//   try {
//     const user = await User.findOne({ email });
//     if (!user) return res.status(404).json({ message: "User not found" });
//     const code = generateOtp();
//     user.resetPasswordCode = code;
//     user.resetPasswordExpires = Date.now() + 10 * 60 * 1000;
//     await user.save();
//     await sendCodeEmail(email, "Reset Code", `Code: ${code}`);
//     res.json({ message: "Code sent" });
//   } catch (err) {
//     res.status(500).json({ message: "Server error" });
//   }
// });

// router.post("/reset-password", async (req, res) => {
//   const { email, code, newPassword } = req.body;
//   try {
//     const user = await User.findOne({ email });
//     if (
//       !user ||
//       user.resetPasswordCode !== code ||
//       user.resetPasswordExpires < Date.now()
//     ) {
//       return res.status(400).json({ message: "Invalid code" });
//     }
//     user.password = await bcrypt.hash(newPassword, 10);
//     user.resetPasswordCode = undefined;
//     user.resetPasswordExpires = undefined;
//     await user.save();
//     res.json({ message: "Password reset" });
//   } catch (err) {
//     res.status(500).json({ message: "Server error" });
//   }
// });

// // -------------------
// // GET CURRENT USER (/me)
// // -------------------
// router.get("/me", authenticateToken, async (req, res) => {
//   try {
//     const user = await User.findById(req.user.id).select("-password");
//     res.json(user);
//   } catch (err) {
//     res.status(500).json({ message: "Server error" });
//   }
// });

// // -------------------
// // PROFILE ROUTES (GET & PUT) - ✅ FIXED 500 ERROR LOGIC
// // -------------------
// router.get("/profile", authenticateToken, async (req, res) => {
//   try {
//     const user = await User.findById(req.user.id).select("-password");
//     if (!user) return res.status(404).json({ message: "User not found" });
//     res.json(user);
//   } catch (err) {
//     console.error("Get profile error:", err);
//     res.status(500).json({ message: "Server error" });
//   }
// });

// router.put("/profile", authenticateToken, async (req, res) => {
//   try {
//     const user = await User.findById(req.user.id);
//     if (!user) return res.status(404).json({ message: "User not found" });

//     const {
//       name,
//       phone,
//       gender,
//       dob,
//       address, // Can be string or object
//       bloodGroup,
//       allergies,
//       chronicConditions,
//       emergencyContact,
//     } = req.body;

//     if (name) user.name = name;
//     if (phone) user.phone = phone;
//     if (gender) user.gender = gender;
//     if (dob) user.dob = dob;

//     // ✅ FIX: Handle Address Mismatch (String vs Object)
//     if (address) {
//       if (typeof address === "string") {
//         // If frontend sends a string, map it to the 'city' or 'street' field
//         // preserving existing object structure if possible
//         user.address = {
//           street: address,
//           city: address,
//           province: user.address?.province || "",
//           postalCode: user.address?.postalCode || "",
//         };
//       } else {
//         // If frontend sends an object, save it directly
//         user.address = address;
//       }
//     }

//     if (bloodGroup) user.bloodGroup = bloodGroup;
//     if (allergies) user.allergies = allergies;
//     if (chronicConditions) user.chronicConditions = chronicConditions;
//     if (emergencyContact) user.emergencyContact = emergencyContact;

//     const updatedUser = await user.save();

//     // Return updated user without password
//     const userResponse = updatedUser.toObject();
//     delete userResponse.password;

//     res.json(userResponse);
//   } catch (err) {
//     console.error("Update profile error:", err); // Logs specific error to terminal
//     res.status(500).json({ message: "Server error: " + err.message });
//   }
// });

// // -------------------
// // GOOGLE AUTH
// // -------------------
// router.get(
//   "/google",
//   passport.authenticate("google", { scope: ["profile", "email"] })
// );
// router.get(
//   "/google/callback",
//   passport.authenticate("google", { failureRedirect: "/login" }),
//   (req, res) => {
//     res.redirect(`http://localhost:3000/dashboard?token=${req.user.token}`);
//   }
// );

// module.exports = router;

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
// EMAIL TRANSPORT SETUP
// -------------------
const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false, // true for 465, false for other ports
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
    console.log("TO:", to, "SUBJECT:", subject, "TEXT:", text);
    return;
  }
  return transporter.sendMail({
    from: `"Smart Pharmacy" <${process.env.SMTP_USER}>`,
    to,
    subject,
    text,
  });
}

// Utility: Generate 6-digit OTP
function generateOtp() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

// -------------------
// REGISTER (Customer)
// -------------------
router.post(
  "/register",
  [
    body("name").isLength({ min: 2 }).withMessage("Name required"),
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
          const otpCode = generateOtp();
          const expiry = new Date(Date.now() + 10 * 60 * 1000); // 10 mins

          user.otpCode = otpCode;
          user.otpExpires = expiry;
          user.name = name;
          user.phone = phone;
          user.role = "customer";
          user.password = await bcrypt.hash(password, 10);
          await user.save();

          try {
            await sendCodeEmail(
              email,
              "Verification Code",
              `Your verification code is: ${otpCode}`
            );
          } catch (e) {
            console.error("Email Error:", e);
          }
          return res.json({ message: "Verification code resent." });
        }
        return res
          .status(400)
          .json({ message: "User with this email already exists." });
      }

      // Create New User
      const hashedPassword = await bcrypt.hash(password, 10);
      const otpCode = generateOtp();
      const expiry = new Date(Date.now() + 10 * 60 * 1000);

      user = new User({
        name,
        email,
        password: hashedPassword,
        role: "customer",
        phone,
        isVerified: false,
        otpCode,
        otpExpires: expiry,
      });
      await user.save();

      try {
        await sendCodeEmail(
          email,
          "Verification Code",
          `Your verification code is: ${otpCode}`
        );
      } catch (e) {
        console.error("Email Error:", e);
      }

      res
        .status(201)
        .json({ message: "User registered. Verification code sent to email." });
    } catch (err) {
      console.error("Register Error:", err);
      res.status(500).json({ message: "Server error" });
    }
  }
);

// -------------------
// VERIFY OTP (Registration)
// -------------------
router.post(
  "/verify-otp",
  [body("email").isEmail(), body("otp").isLength({ min: 4 })],
  async (req, res) => {
    const { email, otp } = req.body;
    try {
      const user = await User.findOne({ email });

      // Check if code matches and hasn't expired
      if (!user || user.otpCode !== otp || user.otpExpires < Date.now()) {
        return res.status(400).json({ message: "Invalid or Expired OTP" });
      }

      // Mark verified
      user.isVerified = true;
      user.otpCode = undefined;
      user.otpExpires = undefined;
      await user.save();

      // Generate Token
      const token = jwt.sign(
        { id: user._id, role: user.role },
        process.env.JWT_SECRET,
        { expiresIn: "7d" }
      );

      res.json({
        message: "Verified successfully",
        token,
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
        },
      });
    } catch (err) {
      console.error("Verify OTP Error:", err);
      res.status(500).json({ message: "Server error" });
    }
  }
);

// -------------------
// RESEND OTP
// -------------------
router.post("/resend-otp", async (req, res) => {
  const { email } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "User not found" });
    if (user.isVerified)
      return res.status(400).json({ message: "Account already verified" });

    const otpCode = generateOtp();
    user.otpCode = otpCode;
    user.otpExpires = Date.now() + 10 * 60 * 1000;
    await user.save();

    await sendCodeEmail(email, "Verification Code", `Code: ${otpCode}`);
    res.json({ message: "Verification code resent." });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

// -------------------
// LOGIN (Password)
// -------------------
router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "Invalid credentials" });

    if (!user.isVerified) {
      return res
        .status(403)
        .json({ message: "Account not verified. Please verify OTP." });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res.status(400).json({ message: "Invalid credentials" });

    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.json({
      message: "Logged in successfully",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (err) {
    console.error("Login Error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// -------------------
// ADMIN: CREATE USER (Pharmacist/Staff)
// -------------------
router.post("/admin/create-user", authenticateToken, async (req, res) => {
  if (req.user.role !== "admin")
    return res.status(403).json({ message: "Admin only" });

  const { name, email, password, role, phone } = req.body;
  try {
    if (await User.findOne({ email }))
      return res.status(400).json({ message: "User already exists" });

    const user = new User({
      name,
      email,
      password: await bcrypt.hash(password, 10),
      role,
      phone,
      isVerified: true, // Admin created accounts are verified by default
    });

    await user.save();
    res.status(201).json({ message: `User created as ${role}`, user });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

// -------------------
// LOGIN VIA EMAIL CODE (Passwordless)
// -------------------
router.post("/send-login-code", async (req, res) => {
  const { email } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "User not found" });

    const code = generateOtp();
    user.loginCode = code;
    user.loginCodeExpires = Date.now() + 10 * 60 * 1000;
    await user.save();

    await sendCodeEmail(email, "Login Code", `Your login code is: ${code}`);
    res.json({ message: "Login code sent to email" });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

router.post("/verify-login-code", async (req, res) => {
  const { email, code } = req.body;
  try {
    const user = await User.findOne({ email });
    if (
      !user ||
      user.loginCode !== code ||
      user.loginCodeExpires < Date.now()
    ) {
      return res.status(400).json({ message: "Invalid or expired login code" });
    }

    user.loginCode = undefined;
    user.loginCodeExpires = undefined;
    await user.save();

    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.json({ message: "Logged in", token, user });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

// -------------------
// PASSWORD RESET FLOW
// -------------------
router.post("/forgot-password", async (req, res) => {
  const { email } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "User not found" });

    const code = generateOtp();
    user.resetPasswordCode = code;
    user.resetPasswordExpires = Date.now() + 10 * 60 * 1000;
    await user.save();

    await sendCodeEmail(
      email,
      "Password Reset Code",
      `Your reset code is: ${code}`
    );
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

    user.password = await bcrypt.hash(newPassword, 10);
    user.resetPasswordCode = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();

    res.json({ message: "Password has been reset successfully" });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

// -------------------
// GET CURRENT USER (/me)
// -------------------
router.get("/me", authenticateToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

// -------------------
// PROFILE MANAGEMENT (GET & UPDATE)
// -------------------
router.get("/profile", authenticateToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json(user);
  } catch (err) {
    console.error("Get Profile Error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

router.put("/profile", authenticateToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    const {
      name,
      phone,
      gender,
      dob,
      address, // Can be string or object
      bloodGroup,
      allergies,
      chronicConditions,
      emergencyContact,
    } = req.body;

    if (name) user.name = name;
    if (phone) user.phone = phone;
    if (gender) user.gender = gender;
    if (dob) user.dob = dob;

    // ✅ FIX: Handle Address Mismatch (String vs Object) to prevent 500 error
    if (address) {
      if (typeof address === "string") {
        // Map string to object if backend expects object
        user.address = {
          street: address,
          city: address,
          province: user.address?.province || "",
          postalCode: user.address?.postalCode || "",
        };
      } else {
        // Save direct object
        user.address = address;
      }
    }

    if (bloodGroup) user.bloodGroup = bloodGroup;
    if (allergies) user.allergies = allergies;
    if (chronicConditions) user.chronicConditions = chronicConditions;
    if (emergencyContact) user.emergencyContact = emergencyContact;

    const updatedUser = await user.save();

    // Return without password
    const userResponse = updatedUser.toObject();
    delete userResponse.password;

    res.json(userResponse);
  } catch (err) {
    console.error("Update Profile Error:", err);
    res.status(500).json({ message: "Server error: " + err.message });
  }
});

// -------------------
// GOOGLE AUTH
// -------------------
router.get(
  "/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

router.get(
  "/google/callback",
  passport.authenticate("google", { failureRedirect: "/login" }),
  (req, res) => {
    // Redirect to frontend dashboard with token
    res.redirect(`http://localhost:3000/dashboard?token=${req.user.token}`);
  }
);

module.exports = router;
