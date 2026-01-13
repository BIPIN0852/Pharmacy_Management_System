// const User = require("../models/User");
// const { generateToken } = require("../middleware/auth");

// // Register a new user (Admin only)
// const registerUser = async (req, res) => {
//   try {
//     const { username, password, role, fullName, email } = req.body;

//     // Check if user exists
//     const userExists = await User.findOne({ username });
//     if (userExists) {
//       return res.status(400).json({ message: "User already exists" });
//     }

//     // Create user
//     const user = await User.create({
//       username,
//       password,
//       role,
//       fullName,
//       email,
//     });

//     if (user) {
//       res.status(201).json({
//         _id: user._id,
//         username: user.username,
//         role: user.role,
//         fullName: user.fullName,
//         email: user.email,
//         token: generateToken(user._id),
//       });
//     } else {
//       res.status(400).json({ message: "Invalid user data" });
//     }
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };

// // Login user
// const loginUser = async (req, res) => {
//   try {
//     const { username, password } = req.body;

//     const user = await User.findOne({ username, isActive: true });

//     if (user && (await user.matchPassword(password))) {
//       res.json({
//         _id: user._id,
//         username: user.username,
//         role: user.role,
//         fullName: user.fullName,
//         email: user.email,
//         token: generateToken(user._id),
//       });
//     } else {
//       res.status(401).json({ message: "Invalid username or password" });
//     }
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };

// // Get user profile
// const getUserProfile = async (req, res) => {
//   try {
//     const user = await User.findById(req.user._id);

//     if (user) {
//       res.json({
//         _id: user._id,
//         username: user.username,
//         role: user.role,
//         fullName: user.fullName,
//         email: user.email,
//         isActive: user.isActive,
//         createdAt: user.createdAt,
//       });
//     } else {
//       res.status(404).json({ message: "User not found" });
//     }
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };

// // Update user profile
// const updateUserProfile = async (req, res) => {
//   try {
//     const user = await User.findById(req.user._id);

//     if (user) {
//       user.username = req.body.username || user.username;
//       user.fullName = req.body.fullName || user.fullName;
//       user.email = req.body.email || user.email;

//       if (req.body.password) {
//         user.password = req.body.password;
//       }

//       const updatedUser = await user.save();

//       res.json({
//         _id: updatedUser._id,
//         username: updatedUser.username,
//         role: updatedUser.role,
//         fullName: updatedUser.fullName,
//         email: updatedUser.email,
//         token: generateToken(updatedUser._id),
//       });
//     } else {
//       res.status(404).json({ message: "User not found" });
//     }
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };

// // Get all users (Admin only)
// const getUsers = async (req, res) => {
//   try {
//     const users = await User.find({}).select("-password");
//     res.json(users);
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };

// // Update user (Admin only)
// const updateUser = async (req, res) => {
//   try {
//     const user = await User.findById(req.params.id);

//     if (user) {
//       user.username = req.body.username || user.username;
//       user.role = req.body.role || user.role;
//       user.fullName = req.body.fullName || user.fullName;
//       user.email = req.body.email || user.email;
//       user.isActive =
//         req.body.isActive !== undefined ? req.body.isActive : user.isActive;

//       if (req.body.password) {
//         user.password = req.body.password;
//       }

//       const updatedUser = await user.save();

//       res.json({
//         _id: updatedUser._id,
//         username: updatedUser.username,
//         role: updatedUser.role,
//         fullName: updatedUser.fullName,
//         email: updatedUser.email,
//         isActive: updatedUser.isActive,
//       });
//     } else {
//       res.status(404).json({ message: "User not found" });
//     }
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };

// // Delete user (Admin only - soft delete)
// const deleteUser = async (req, res) => {
//   try {
//     const user = await User.findByIdAndUpdate(
//       req.params.id,
//       { isActive: false },
//       { new: true }
//     );

//     if (!user) {
//       return res.status(404).json({ message: "User not found" });
//     }

//     res.json({ message: "User deactivated successfully" });
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };

// module.exports = {
//   registerUser,
//   loginUser,
//   getUserProfile,
//   updateUserProfile,
//   getUsers,
//   updateUser,
//   deleteUser,
// };

// // backend/controllers/authController.js
// const User = require("../models/User");
// const { generateToken } = require("../middleware/auth");
// const nodemailer = require("nodemailer");
// const bcrypt = require("bcryptjs");

// // ----------------------
// // Email transport
// // ----------------------
// const transporter = nodemailer.createTransport({
//   service: "gmail", // or custom SMTP
//   auth: {
//     user: process.env.EMAIL_USER,
//     pass: process.env.EMAIL_PASS,
//   },
// });

// async function sendCodeEmail(to, subject, text) {
//   await transporter.sendMail({
//     from: `"Smart Pharmacy" <${process.env.EMAIL_USER}>`,
//     to,
//     subject,
//     text,
//   });
// }

// // ----------------------
// // Register a new user (Admin only)
// // ----------------------
// const registerUser = async (req, res) => {
//   try {
//     const { username, password, role, fullName, email } = req.body;

//     // Check if user exists
//     const userExists = await User.findOne({ username });
//     if (userExists) {
//       return res.status(400).json({ message: "User already exists" });
//     }

//     // Create user
//     const user = await User.create({
//       username,
//       password,
//       role,
//       fullName,
//       email,
//     });

//     if (user) {
//       res.status(201).json({
//         _id: user._id,
//         username: user.username,
//         role: user.role,
//         fullName: user.fullName,
//         email: user.email,
//         token: generateToken(user._id),
//       });
//     } else {
//       res.status(400).json({ message: "Invalid user data" });
//     }
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };

// // ----------------------
// // Login user (username + password)
// // ----------------------
// const loginUser = async (req, res) => {
//   try {
//     const { username, password } = req.body;

//     const user = await User.findOne({ username, isActive: true });

//     if (user && (await user.matchPassword(password))) {
//       res.json({
//         _id: user._id,
//         username: user.username,
//         role: user.role,
//         fullName: user.fullName,
//         email: user.email,
//         token: generateToken(user._id),
//       });
//     } else {
//       res.status(401).json({ message: "Invalid username or password" });
//     }
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };

// // ----------------------
// // EMAIL CODE LOGIN
// // ----------------------

// // POST /api/auth/send-login-code
// const sendLoginCode = async (req, res) => {
//   try {
//     const { email } = req.body;
//     if (!email) return res.status(400).json({ message: "Email is required" });

//     const user = await User.findOne({ email, isActive: true });
//     if (!user)
//       return res
//         .status(404)
//         .json({ message: "User with this email not found" });

//     const loginCode = Math.floor(100000 + Math.random() * 900000).toString();
//     const expiry = Date.now() + 10 * 60 * 1000; // 10 minutes

//     user.loginCode = loginCode;
//     user.loginCodeExpires = expiry;
//     await user.save();

//     await sendCodeEmail(
//       email,
//       "Your login verification code",
//       `Your Smart Pharmacy login code is: ${loginCode}\nThis code will expire in 10 minutes.`
//     );

//     res.json({ message: "Verification code sent to email" });
//   } catch (error) {
//     console.error("sendLoginCode error:", error);
//     res.status(500).json({ message: "Server error" });
//   }
// };

// // POST /api/auth/verify-login-code
// const verifyLoginCode = async (req, res) => {
//   try {
//     const { email, code } = req.body;
//     if (!email || !code) {
//       return res.status(400).json({ message: "Email and code are required" });
//     }

//     const user = await User.findOne({ email, isActive: true });
//     if (
//       !user ||
//       !user.loginCode ||
//       user.loginCode !== code ||
//       !user.loginCodeExpires ||
//       user.loginCodeExpires < Date.now()
//     ) {
//       return res.status(400).json({ message: "Invalid or expired code" });
//     }

//     // Clear the code
//     user.loginCode = undefined;
//     user.loginCodeExpires = undefined;
//     await user.save();

//     // use same token generator
//     const token = generateToken(user._id);

//     res.json({
//       message: "Login successful",
//       token,
//       user: {
//         _id: user._id,
//         username: user.username,
//         role: user.role,
//         fullName: user.fullName,
//         email: user.email,
//       },
//     });
//   } catch (error) {
//     console.error("verifyLoginCode error:", error);
//     res.status(500).json({ message: "Server error" });
//   }
// };

// // ----------------------
// // FORGOT / RESET PASSWORD (by email + 6 digit code)
// // ----------------------

// // POST /api/auth/forgot-password
// const forgotPassword = async (req, res) => {
//   try {
//     const { email } = req.body;
//     if (!email) return res.status(400).json({ message: "Email is required" });

//     const user = await User.findOne({ email, isActive: true });
//     if (!user)
//       return res
//         .status(404)
//         .json({ message: "User with this email not found" });

//     const resetCode = Math.floor(100000 + Math.random() * 900000).toString();
//     const expiry = Date.now() + 10 * 60 * 1000; // 10 minutes

//     user.resetPasswordCode = resetCode;
//     user.resetPasswordExpires = expiry;
//     await user.save();

//     await sendCodeEmail(
//       email,
//       "Password reset code",
//       `Your password reset code for Smart Pharmacy is: ${resetCode}\nThis code will expire in 10 minutes.`
//     );

//     res.json({ message: "Reset code sent to email" });
//   } catch (error) {
//     console.error("forgotPassword error:", error);
//     res.status(500).json({ message: "Server error" });
//   }
// };

// // POST /api/auth/reset-password
// const resetPassword = async (req, res) => {
//   try {
//     const { email, code, newPassword } = req.body;
//     if (!email || !code || !newPassword) {
//       return res
//         .status(400)
//         .json({ message: "Email, code and newPassword are required" });
//     }

//     const user = await User.findOne({ email, isActive: true });
//     if (
//       !user ||
//       !user.resetPasswordCode ||
//       user.resetPasswordCode !== code ||
//       !user.resetPasswordExpires ||
//       user.resetPasswordExpires < Date.now()
//     ) {
//       return res.status(400).json({ message: "Invalid or expired reset code" });
//     }

//     // Hash new password (if your model does not already hash via pre-save hook)
//     if (typeof user.matchPassword === "function") {
//       // likely you hash in a pre-save hook already
//       user.password = newPassword;
//     } else {
//       const salt = await bcrypt.genSalt(10);
//       user.password = await bcrypt.hash(newPassword, salt);
//     }

//     user.resetPasswordCode = undefined;
//     user.resetPasswordExpires = undefined;
//     await user.save();

//     res.json({ message: "Password reset successfully" });
//   } catch (error) {
//     console.error("resetPassword error:", error);
//     res.status(500).json({ message: "Server error" });
//   }
// };

// // ----------------------
// // Get user profile
// // ----------------------
// const getUserProfile = async (req, res) => {
//   try {
//     const user = await User.findById(req.user._id);

//     if (user) {
//       res.json({
//         _id: user._id,
//         username: user.username,
//         role: user.role,
//         fullName: user.fullName,
//         email: user.email,
//         isActive: user.isActive,
//         createdAt: user.createdAt,
//       });
//     } else {
//       res.status(404).json({ message: "User not found" });
//     }
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };

// // ----------------------
// // Update user profile
// // ----------------------
// const updateUserProfile = async (req, res) => {
//   try {
//     const user = await User.findById(req.user._id);

//     if (user) {
//       user.username = req.body.username || user.username;
//       user.fullName = req.body.fullName || user.fullName;
//       user.email = req.body.email || user.email;

//       if (req.body.password) {
//         user.password = req.body.password;
//       }

//       const updatedUser = await user.save();

//       res.json({
//         _id: updatedUser._id,
//         username: updatedUser.username,
//         role: updatedUser.role,
//         fullName: updatedUser.fullName,
//         email: updatedUser.email,
//         token: generateToken(updatedUser._id),
//       });
//     } else {
//       res.status(404).json({ message: "User not found" });
//     }
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };

// // ----------------------
// // Get all users (Admin only)
// // ----------------------
// const getUsers = async (req, res) => {
//   try {
//     const users = await User.find({}).select("-password");
//     res.json(users);
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };

// // ----------------------
// // Update user (Admin only)
// // ----------------------
// const updateUser = async (req, res) => {
//   try {
//     const user = await User.findById(req.params.id);

//     if (user) {
//       user.username = req.body.username || user.username;
//       user.role = req.body.role || user.role;
//       user.fullName = req.body.fullName || user.fullName;
//       user.email = req.body.email || user.email;
//       user.isActive =
//         req.body.isActive !== undefined ? req.body.isActive : user.isActive;

//       if (req.body.password) {
//         user.password = req.body.password;
//       }

//       const updatedUser = await user.save();

//       res.json({
//         _id: updatedUser._id,
//         username: updatedUser.username,
//         role: updatedUser.role,
//         fullName: updatedUser.fullName,
//         email: updatedUser.email,
//         isActive: updatedUser.isActive,
//       });
//     } else {
//       res.status(404).json({ message: "User not found" });
//     }
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };

// // ----------------------
// // Delete user (soft delete, Admin only)
// // ----------------------
// const deleteUser = async (req, res) => {
//   try {
//     const user = await User.findByIdAndUpdate(
//       req.params.id,
//       { isActive: false },
//       { new: true }
//     );

//     if (!user) {
//       return res.status(404).json({ message: "User not found" });
//     }

//     res.json({ message: "User deactivated successfully" });
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };

// module.exports = {
//   registerUser,
//   loginUser,
//   sendLoginCode,
//   verifyLoginCode,
//   forgotPassword,
//   resetPassword,
//   getUserProfile,
//   updateUserProfile,
//   getUsers,
//   updateUser,
//   deleteUser,
// };

const User = require("../models/User");
const { generateToken } = require("../middleware/auth");
const nodemailer = require("nodemailer");
const bcrypt = require("bcryptjs");
const { getEmailTemplate } = require("../utils/emailTemplates"); // ✅ Import Template

// ----------------------
// Email transport
// ----------------------
const transporter = nodemailer.createTransport({
  service: "gmail", // or custom SMTP
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// ✅ Updated to send HTML instead of plain text
async function sendCodeEmail(to, subject, htmlContent) {
  await transporter.sendMail({
    from: `"Smart Pharmacy" <${process.env.EMAIL_USER}>`,
    to,
    subject,
    html: htmlContent, // Send HTML content
  });
}

// ----------------------
// Register a new user (Admin only)
// ----------------------
const registerUser = async (req, res) => {
  try {
    const { username, password, role, fullName, email } = req.body;

    // Check if user exists
    const userExists = await User.findOne({ username });
    if (userExists) {
      return res.status(400).json({ message: "User already exists" });
    }

    // Create user
    const user = await User.create({
      username,
      password,
      role,
      fullName,
      email,
    });

    if (user) {
      // Optional: Send Welcome Email
      const emailHtml = getEmailTemplate(
        user.fullName,
        "Welcome to Smart Pharmacy! Your account has been created successfully."
      );
      // await sendCodeEmail(user.email, "Welcome to Smart Pharmacy", emailHtml);

      res.status(201).json({
        _id: user._id,
        username: user.username,
        role: user.role,
        fullName: user.fullName,
        email: user.email,
        token: generateToken(user._id),
      });
    } else {
      res.status(400).json({ message: "Invalid user data" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ----------------------
// Login user (username + password)
// ----------------------
const loginUser = async (req, res) => {
  try {
    const { username, password } = req.body;

    const user = await User.findOne({ username, isActive: true });

    if (user && (await user.matchPassword(password))) {
      res.json({
        _id: user._id,
        username: user.username,
        role: user.role,
        fullName: user.fullName,
        email: user.email,
        token: generateToken(user._id),
      });
    } else {
      res.status(401).json({ message: "Invalid username or password" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ----------------------
// EMAIL CODE LOGIN
// ----------------------

// POST /api/auth/send-login-code
const sendLoginCode = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ message: "Email is required" });

    const user = await User.findOne({ email, isActive: true });
    if (!user)
      return res
        .status(404)
        .json({ message: "User with this email not found" });

    const loginCode = Math.floor(100000 + Math.random() * 900000).toString();
    const expiry = Date.now() + 10 * 60 * 1000; // 10 minutes

    user.loginCode = loginCode;
    user.loginCodeExpires = expiry;
    await user.save();

    // ✅ Use Professional HTML Template
    const emailHtml = getEmailTemplate(
      user.fullName || "User",
      "Please use the code below to verify your login. This code expires in 10 minutes.",
      loginCode
    );

    await sendCodeEmail(
      email,
      "Your Verification Code - Smart Pharmacy", // Subject
      emailHtml
    );

    res.json({ message: "Verification code sent to email" });
  } catch (error) {
    console.error("sendLoginCode error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// POST /api/auth/verify-login-code
const verifyLoginCode = async (req, res) => {
  try {
    const { email, code } = req.body;
    if (!email || !code) {
      return res.status(400).json({ message: "Email and code are required" });
    }

    const user = await User.findOne({ email, isActive: true });
    if (
      !user ||
      !user.loginCode ||
      user.loginCode !== code ||
      !user.loginCodeExpires ||
      user.loginCodeExpires < Date.now()
    ) {
      return res.status(400).json({ message: "Invalid or expired code" });
    }

    // Clear the code
    user.loginCode = undefined;
    user.loginCodeExpires = undefined;
    await user.save();

    const token = generateToken(user._id);

    res.json({
      message: "Login successful",
      token,
      user: {
        _id: user._id,
        username: user.username,
        role: user.role,
        fullName: user.fullName,
        email: user.email,
      },
    });
  } catch (error) {
    console.error("verifyLoginCode error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// ----------------------
// FORGOT / RESET PASSWORD (by email + 6 digit code)
// ----------------------

// POST /api/auth/forgot-password
const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ message: "Email is required" });

    const user = await User.findOne({ email, isActive: true });
    if (!user)
      return res
        .status(404)
        .json({ message: "User with this email not found" });

    const resetCode = Math.floor(100000 + Math.random() * 900000).toString();
    const expiry = Date.now() + 10 * 60 * 1000; // 10 minutes

    user.resetPasswordCode = resetCode;
    user.resetPasswordExpires = expiry;
    await user.save();

    // ✅ Use Professional HTML Template
    const emailHtml = getEmailTemplate(
      user.fullName || "User",
      "We received a request to reset your password. Use the code below to proceed:",
      resetCode
    );

    await sendCodeEmail(
      email,
      "Password Reset Request - Smart Pharmacy", // Subject
      emailHtml
    );

    res.json({ message: "Reset code sent to email" });
  } catch (error) {
    console.error("forgotPassword error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// POST /api/auth/reset-password
const resetPassword = async (req, res) => {
  try {
    const { email, code, newPassword } = req.body;
    if (!email || !code || !newPassword) {
      return res
        .status(400)
        .json({ message: "Email, code and newPassword are required" });
    }

    const user = await User.findOne({ email, isActive: true });
    if (
      !user ||
      !user.resetPasswordCode ||
      user.resetPasswordCode !== code ||
      !user.resetPasswordExpires ||
      user.resetPasswordExpires < Date.now()
    ) {
      return res.status(400).json({ message: "Invalid or expired reset code" });
    }

    if (typeof user.matchPassword === "function") {
      user.password = newPassword;
    } else {
      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(newPassword, salt);
    }

    user.resetPasswordCode = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();

    // ✅ Optional: Send confirmation email
    const emailHtml = getEmailTemplate(
      user.fullName || "User",
      "Your password has been successfully reset. You can now login with your new password."
    );
    await sendCodeEmail(email, "Password Changed Successfully", emailHtml);

    res.json({ message: "Password reset successfully" });
  } catch (error) {
    console.error("resetPassword error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// ----------------------
// Get user profile
// ----------------------
const getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    if (user) {
      res.json({
        _id: user._id,
        username: user.username,
        role: user.role,
        fullName: user.fullName,
        email: user.email,
        isActive: user.isActive,
        createdAt: user.createdAt,
      });
    } else {
      res.status(404).json({ message: "User not found" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ----------------------
// Update user profile
// ----------------------
const updateUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    if (user) {
      user.username = req.body.username || user.username;
      user.fullName = req.body.fullName || user.fullName;
      user.email = req.body.email || user.email;

      if (req.body.password) {
        user.password = req.body.password;
      }

      const updatedUser = await user.save();

      res.json({
        _id: updatedUser._id,
        username: updatedUser.username,
        role: updatedUser.role,
        fullName: updatedUser.fullName,
        email: updatedUser.email,
        token: generateToken(updatedUser._id),
      });
    } else {
      res.status(404).json({ message: "User not found" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ----------------------
// Get all users (Admin only)
// ----------------------
const getUsers = async (req, res) => {
  try {
    const users = await User.find({}).select("-password");
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ----------------------
// Update user (Admin only)
// ----------------------
const updateUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (user) {
      user.username = req.body.username || user.username;
      user.role = req.body.role || user.role;
      user.fullName = req.body.fullName || user.fullName;
      user.email = req.body.email || user.email;
      user.isActive =
        req.body.isActive !== undefined ? req.body.isActive : user.isActive;

      if (req.body.password) {
        user.password = req.body.password;
      }

      const updatedUser = await user.save();

      res.json({
        _id: updatedUser._id,
        username: updatedUser.username,
        role: updatedUser.role,
        fullName: updatedUser.fullName,
        email: updatedUser.email,
        isActive: updatedUser.isActive,
      });
    } else {
      res.status(404).json({ message: "User not found" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ----------------------
// Delete user (soft delete, Admin only)
// ----------------------
const deleteUser = async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { isActive: false },
      { new: true }
    );

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({ message: "User deactivated successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  registerUser,
  loginUser,
  sendLoginCode,
  verifyLoginCode,
  forgotPassword,
  resetPassword,
  getUserProfile,
  updateUserProfile,
  getUsers,
  updateUser,
  deleteUser,
};
