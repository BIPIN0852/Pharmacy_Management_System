// // PUT /api/users/profile
// const updateUserProfile = async (req, res) => {
//   const user = await User.findById(req.user._id);

//   if (user) {
//     // Update basic fields
//     user.name = req.body.name || user.name;
//     user.email = req.body.email || user.email;
//     user.phone = req.body.phone || user.phone;
//     if (req.body.password) {
//       user.password = req.body.password;
//     }

//     // Update Personal & Medical Fields
//     user.gender = req.body.gender || user.gender;
//     user.dob = req.body.dob || user.dob;
//     user.address = req.body.address || user.address; // Expecting object or string based on your implementation

//     user.bloodGroup = req.body.bloodGroup || user.bloodGroup;
//     user.allergies = req.body.allergies || user.allergies;
//     user.chronicConditions =
//       req.body.chronicConditions || user.chronicConditions;
//     user.emergencyContact = req.body.emergencyContact || user.emergencyContact;

//     const updatedUser = await user.save();

//     res.json({
//       _id: updatedUser._id,
//       name: updatedUser.name,
//       email: updatedUser.email,
//       role: updatedUser.role,
//       token: generateToken(updatedUser._id), // Optional: Refresh token if needed
//       // Return new fields so frontend updates immediately
//       phone: updatedUser.phone,
//       gender: updatedUser.gender,
//       dob: updatedUser.dob,
//       address: updatedUser.address,
//       bloodGroup: updatedUser.bloodGroup,
//       allergies: updatedUser.allergies,
//       chronicConditions: updatedUser.chronicConditions,
//       emergencyContact: updatedUser.emergencyContact,
//     });
//   } else {
//     res.status(404);
//     throw new Error("User not found");
//   }
// };

// const asyncHandler = require("express-async-handler");
// const User = require("../models/User");
// const generateToken = require("../utils/generateToken");

// // @desc    Auth user & get token
// // @route   POST /api/users/login
// // @access  Public
// const authUser = asyncHandler(async (req, res) => {
//   const { email, password } = req.body;

//   const user = await User.findOne({ email });

//   if (user && (await user.matchPassword(password))) {
//     res.json({
//       _id: user._id,
//       name: user.name,
//       email: user.email,
//       isAdmin: user.isAdmin,
//       role: user.role, // Important for your redirect logic
//       token: generateToken(user._id),
//     });
//   } else {
//     res.status(401);
//     throw new Error("Invalid email or password");
//   }
// });

// // @desc    Register a new user
// // @route   POST /api/users
// // @access  Public
// const registerUser = asyncHandler(async (req, res) => {
//   const { name, email, password, role } = req.body;

//   const userExists = await User.findOne({ email });

//   if (userExists) {
//     res.status(400);
//     throw new Error("User already exists");
//   }

//   const user = await User.create({
//     name,
//     email,
//     password,
//     role: role || "customer", // Default to customer
//   });

//   if (user) {
//     res.status(201).json({
//       _id: user._id,
//       name: user.name,
//       email: user.email,
//       role: user.role,
//       token: generateToken(user._id),
//     });
//   } else {
//     res.status(400);
//     throw new Error("Invalid user data");
//   }
// });

// // @desc    Get user profile
// // @route   GET /api/users/profile
// // @access  Private
// const getUserProfile = asyncHandler(async (req, res) => {
//   const user = await User.findById(req.user._id);

//   if (user) {
//     res.json({
//       _id: user._id,
//       name: user.name,
//       email: user.email,
//       role: user.role,
//     });
//   } else {
//     res.status(404);
//     throw new Error("User not found");
//   }
// });

// // @desc    Update user profile
// // @route   PUT /api/users/profile
// // @access  Private
// const updateUserProfile = asyncHandler(async (req, res) => {
//   const user = await User.findById(req.user._id);

//   if (user) {
//     user.name = req.body.name || user.name;
//     user.email = req.body.email || user.email;
//     if (req.body.password) {
//       user.password = req.body.password;
//     }

//     const updatedUser = await user.save();

//     res.json({
//       _id: updatedUser._id,
//       name: updatedUser.name,
//       email: updatedUser.email,
//       role: updatedUser.role,
//       token: generateToken(updatedUser._id),
//     });
//   } else {
//     res.status(404);
//     throw new Error("User not found");
//   }
// });

// // @desc    Get all users
// // @route   GET /api/users
// // @access  Private/Admin
// const getUsers = asyncHandler(async (req, res) => {
//   const users = await User.find({});
//   res.json(users);
// });

// // @desc    Delete user
// // @route   DELETE /api/users/:id
// // @access  Private/Admin
// const deleteUser = asyncHandler(async (req, res) => {
//   const user = await User.findById(req.params.id);

//   if (user) {
//     await user.deleteOne();
//     res.json({ message: "User removed" });
//   } else {
//     res.status(404);
//     throw new Error("User not found");
//   }
// });

// // @desc    Get user by ID
// // @route   GET /api/users/:id
// // @access  Private/Admin
// const getUserById = asyncHandler(async (req, res) => {
//   const user = await User.findById(req.params.id).select("-password");
//   if (user) {
//     res.json(user);
//   } else {
//     res.status(404);
//     throw new Error("User not found");
//   }
// });

// // @desc    Update user
// // @route   PUT /api/users/:id
// // @access  Private/Admin
// const updateUser = asyncHandler(async (req, res) => {
//   const user = await User.findById(req.params.id);

//   if (user) {
//     user.name = req.body.name || user.name;
//     user.email = req.body.email || user.email;
//     user.role = req.body.role || user.role; // Allow admin to change role

//     const updatedUser = await user.save();

//     res.json({
//       _id: updatedUser._id,
//       name: updatedUser.name,
//       email: updatedUser.email,
//       role: updatedUser.role,
//     });
//   } else {
//     res.status(404);
//     throw new Error("User not found");
//   }
// });

// // ✅ Make sure ALL functions are exported here
// module.exports = {
//   authUser,
//   registerUser,
//   getUserProfile,
//   updateUserProfile,
//   getUsers,
//   deleteUser,
//   getUserById,
//   updateUser,
// };

// const asyncHandler = require("express-async-handler");
// const User = require("../models/User");
// const generateToken = require("../utils/generateToken");
// const nodemailer = require("nodemailer");
// const { getEmailTemplate } = require("../utils/emailTemplates"); // ✅ Import Template

// // ----------------------
// // Email Transport Setup
// // ----------------------
// const transporter = nodemailer.createTransport({
//   service: "gmail",
//   auth: {
//     user: process.env.EMAIL_USER,
//     pass: process.env.EMAIL_PASS,
//   },
// });

// // Helper to send user-related emails
// async function sendUserEmail(to, subject, htmlContent) {
//   try {
//     await transporter.sendMail({
//       from: `"Smart Pharmacy" <${process.env.EMAIL_USER}>`,
//       to,
//       subject,
//       html: htmlContent,
//     });
//     console.log(`📧 User email sent to ${to}`);
//   } catch (error) {
//     console.error("❌ Email send failed:", error.message);
//   }
// }

// // @desc    Auth user & get token
// // @route   POST /api/users/login
// // @access  Public
// const authUser = asyncHandler(async (req, res) => {
//   const { email, password } = req.body;

//   const user = await User.findOne({ email });

//   if (user && (await user.matchPassword(password))) {
//     res.json({
//       _id: user._id,
//       name: user.name,
//       email: user.email,
//       isAdmin: user.isAdmin,
//       role: user.role,
//       token: generateToken(user._id),
//     });
//   } else {
//     res.status(401);
//     throw new Error("Invalid email or password");
//   }
// });

// // @desc    Register a new user
// // @route   POST /api/users
// // @access  Public
// const registerUser = asyncHandler(async (req, res) => {
//   const { name, email, password, role } = req.body;

//   const userExists = await User.findOne({ email });

//   if (userExists) {
//     res.status(400);
//     throw new Error("User already exists");
//   }

//   const user = await User.create({
//     name,
//     email,
//     password,
//     role: role || "customer",
//   });

//   if (user) {
//     // ✅ Send Welcome Email
//     const emailHtml = getEmailTemplate(
//       user.name,
//       "Welcome to Smart Pharmacy! Your account has been created successfully. You can now login to manage your prescriptions and orders."
//     );
//     await sendUserEmail(user.email, "Welcome to Smart Pharmacy", emailHtml);

//     res.status(201).json({
//       _id: user._id,
//       name: user.name,
//       email: user.email,
//       role: user.role,
//       token: generateToken(user._id),
//     });
//   } else {
//     res.status(400);
//     throw new Error("Invalid user data");
//   }
// });

// // @desc    Get user profile
// // @route   GET /api/users/profile
// // @access  Private
// const getUserProfile = asyncHandler(async (req, res) => {
//   const user = await User.findById(req.user._id);

//   if (user) {
//     res.json({
//       _id: user._id,
//       name: user.name,
//       email: user.email,
//       role: user.role,
//     });
//   } else {
//     res.status(404);
//     throw new Error("User not found");
//   }
// });

// // @desc    Update user profile
// // @route   PUT /api/users/profile
// // @access  Private
// const updateUserProfile = asyncHandler(async (req, res) => {
//   const user = await User.findById(req.user._id);

//   if (user) {
//     user.name = req.body.name || user.name;
//     user.email = req.body.email || user.email;
//     if (req.body.password) {
//       user.password = req.body.password;
//     }

//     const updatedUser = await user.save();

//     // ✅ Send Security Notification Email
//     const emailHtml = getEmailTemplate(
//       updatedUser.name,
//       "Your profile information has been updated successfully. If you did not make this change, please contact support immediately."
//     );
//     await sendUserEmail(
//       updatedUser.email,
//       "Profile Updated - Smart Pharmacy",
//       emailHtml
//     );

//     res.json({
//       _id: updatedUser._id,
//       name: updatedUser.name,
//       email: updatedUser.email,
//       role: updatedUser.role,
//       token: generateToken(updatedUser._id),
//     });
//   } else {
//     res.status(404);
//     throw new Error("User not found");
//   }
// });

// // @desc    Get all users
// // @route   GET /api/users
// // @access  Private/Admin
// const getUsers = asyncHandler(async (req, res) => {
//   const users = await User.find({});
//   res.json(users);
// });

// // @desc    Delete user
// // @route   DELETE /api/users/:id
// // @access  Private/Admin
// const deleteUser = asyncHandler(async (req, res) => {
//   const user = await User.findById(req.params.id);

//   if (user) {
//     await user.deleteOne();
//     res.json({ message: "User removed" });
//   } else {
//     res.status(404);
//     throw new Error("User not found");
//   }
// });

// // @desc    Get user by ID
// // @route   GET /api/users/:id
// // @access  Private/Admin
// const getUserById = asyncHandler(async (req, res) => {
//   const user = await User.findById(req.params.id).select("-password");
//   if (user) {
//     res.json(user);
//   } else {
//     res.status(404);
//     throw new Error("User not found");
//   }
// });

// // @desc    Update user
// // @route   PUT /api/users/:id
// // @access  Private/Admin
// const updateUser = asyncHandler(async (req, res) => {
//   const user = await User.findById(req.params.id);

//   if (user) {
//     user.name = req.body.name || user.name;
//     user.email = req.body.email || user.email;
//     user.role = req.body.role || user.role;

//     const updatedUser = await user.save();

//     // ✅ Optional: Notify user that Admin updated their account
//     // const emailHtml = getEmailTemplate(updatedUser.name, "Your account details have been updated by an administrator.");
//     // await sendUserEmail(updatedUser.email, "Account Update", emailHtml);

//     res.json({
//       _id: updatedUser._id,
//       name: updatedUser.name,
//       email: updatedUser.email,
//       role: updatedUser.role,
//     });
//   } else {
//     res.status(404);
//     throw new Error("User not found");
//   }
// });

// module.exports = {
//   authUser,
//   registerUser,
//   getUserProfile,
//   updateUserProfile,
//   getUsers,
//   deleteUser,
//   getUserById,
//   updateUser,
// };

// const asyncHandler = require("express-async-handler");
// const User = require("../models/User");
// const generateToken = require("../utils/generateToken");
// const nodemailer = require("nodemailer");
// const { getEmailTemplate } = require("../utils/emailTemplates");

// // ----------------------
// // Email Transport Setup
// // ----------------------
// const transporter = nodemailer.createTransport({
//   service: "gmail",
//   auth: {
//     user: process.env.EMAIL_USER,
//     pass: process.env.EMAIL_PASS,
//   },
// });

// // Helper to send user-related emails
// async function sendUserEmail(to, subject, htmlContent) {
//   try {
//     await transporter.sendMail({
//       from: `"Smart Pharmacy" <${process.env.EMAIL_USER}>`,
//       to,
//       subject,
//       html: htmlContent,
//     });
//     console.log(`📧 User email sent to ${to}`);
//   } catch (error) {
//     console.error("❌ Email send failed:", error.message);
//   }
// }

// // @desc    Auth user & get token
// // @route   POST /api/users/login
// // @access  Public
// const authUser = asyncHandler(async (req, res) => {
//   const { email, password } = req.body;

//   const user = await User.findOne({ email });

//   if (user && (await user.matchPassword(password))) {
//     res.json({
//       _id: user._id,
//       name: user.name,
//       email: user.email,
//       phone: user.phone, // ✅ Added phone
//       isAdmin: user.isAdmin,
//       role: user.role,
//       token: generateToken(user._id),
//     });
//   } else {
//     res.status(401);
//     throw new Error("Invalid email or password");
//   }
// });

// // @desc    Register a new user
// // @route   POST /api/users
// // @access  Public (Customer) / Private (Admin Create)
// const registerUser = asyncHandler(async (req, res) => {
//   const { name, email, password, role, phone } = req.body;

//   const userExists = await User.findOne({ email });

//   if (userExists) {
//     res.status(400);
//     throw new Error("User already exists");
//   }

//   /**
//    * ✅ Logic Enhancement:
//    * If the request is coming from an Admin (verified via middleware in routes),
//    * allow the role and phone to be set. Otherwise, default to customer.
//    */
//   const user = await User.create({
//     name,
//     email,
//     password,
//     phone, // ✅ Added phone
//     role: role || "customer",
//   });

//   if (user) {
//     // ✅ Send Welcome Email
//     const emailHtml = getEmailTemplate(
//       user.name,
//       `Welcome to Smart Pharmacy! Your account (${user.role}) has been created successfully. You can now login to manage prescriptions and orders.`
//     );
//     await sendUserEmail(user.email, "Welcome to Smart Pharmacy", emailHtml);

//     res.status(201).json({
//       _id: user._id,
//       name: user.name,
//       email: user.email,
//       phone: user.phone,
//       role: user.role,
//       token: generateToken(user._id),
//     });
//   } else {
//     res.status(400);
//     throw new Error("Invalid user data");
//   }
// });

// // @desc    Get user profile
// // @route   GET /api/users/profile
// // @access  Private
// const getUserProfile = asyncHandler(async (req, res) => {
//   const user = await User.findById(req.user._id);

//   if (user) {
//     res.json({
//       _id: user._id,
//       name: user.name,
//       email: user.email,
//       phone: user.phone, // ✅ Added phone
//       role: user.role,
//       gender: user.gender,
//       address: user.address,
//       bloodGroup: user.bloodGroup,
//     });
//   } else {
//     res.status(404);
//     throw new Error("User not found");
//   }
// });

// // @desc    Update user profile
// // @route   PUT /api/users/profile
// // @access  Private
// const updateUserProfile = asyncHandler(async (req, res) => {
//   const user = await User.findById(req.user._id);

//   if (user) {
//     user.name = req.body.name || user.name;
//     user.email = req.body.email || user.email;
//     user.phone = req.body.phone || user.phone; // ✅ Added phone update

//     if (req.body.password) {
//       user.password = req.body.password;
//     }

//     const updatedUser = await user.save();

//     // ✅ Send Security Notification Email
//     const emailHtml = getEmailTemplate(
//       updatedUser.name,
//       "Your profile information has been updated successfully. If you did not make this change, please contact support immediately."
//     );
//     await sendUserEmail(
//       updatedUser.email,
//       "Profile Updated - Smart Pharmacy",
//       emailHtml
//     );

//     res.json({
//       _id: updatedUser._id,
//       name: updatedUser.name,
//       email: updatedUser.email,
//       phone: updatedUser.phone,
//       role: updatedUser.role,
//       token: generateToken(updatedUser._id),
//     });
//   } else {
//     res.status(404);
//     throw new Error("User not found");
//   }
// });

// // @desc    Get all users
// // @route   GET /api/users
// // @access  Private/Admin
// const getUsers = asyncHandler(async (req, res) => {
//   const users = await User.find({}).select("-password");
//   res.json(users);
// });

// // @desc    Delete user
// // @route   DELETE /api/users/:id
// // @access  Private/Admin
// const deleteUser = asyncHandler(async (req, res) => {
//   const user = await User.findById(req.params.id);

//   if (user) {
//     await user.deleteOne();
//     res.json({ message: "User removed" });
//   } else {
//     res.status(404);
//     throw new Error("User not found");
//   }
// });

// // @desc    Get user by ID
// // @route   GET /api/users/:id
// // @access  Private/Admin
// const getUserById = asyncHandler(async (req, res) => {
//   const user = await User.findById(req.params.id).select("-password");
//   if (user) {
//     res.json(user);
//   } else {
//     res.status(404);
//     throw new Error("User not found");
//   }
// });

// // @desc    Update user
// // @route   PUT /api/users/:id
// // @access  Private/Admin
// const updateUser = asyncHandler(async (req, res) => {
//   const user = await User.findById(req.params.id);

//   if (user) {
//     user.name = req.body.name || user.name;
//     user.email = req.body.email || user.email;
//     user.phone = req.body.phone || user.phone; // ✅ Added phone
//     user.role = req.body.role || user.role;

//     const updatedUser = await user.save();

//     res.json({
//       _id: updatedUser._id,
//       name: updatedUser.name,
//       email: updatedUser.email,
//       phone: updatedUser.phone,
//       role: updatedUser.role,
//     });
//   } else {
//     res.status(404);
//     throw new Error("User not found");
//   }
// });

// module.exports = {
//   authUser,
//   registerUser,
//   getUserProfile,
//   updateUserProfile,
//   getUsers,
//   deleteUser,
//   getUserById,
//   updateUser,
// };

// const asyncHandler = require("express-async-handler");
// const User = require("../models/User");
// const generateToken = require("../utils/generateToken");
// const nodemailer = require("nodemailer");
// const { getEmailTemplate } = require("../utils/emailTemplates");

// // ----------------------
// // Email Transport Setup
// // ----------------------
// const transporter = nodemailer.createTransport({
//   service: "gmail",
//   auth: {
//     user: process.env.EMAIL_USER,
//     pass: process.env.EMAIL_PASS,
//   },
// });

// // Helper to send user-related emails
// async function sendUserEmail(to, subject, htmlContent) {
//   try {
//     await transporter.sendMail({
//       from: `"Smart Pharmacy" <${process.env.EMAIL_USER}>`,
//       to,
//       subject,
//       html: htmlContent,
//     });
//     console.log(`📧 User email sent to ${to}`);
//   } catch (error) {
//     console.error("❌ Email send failed:", error.message);
//   }
// }

// // @desc    Auth user & get token
// // @route   POST /api/users/login
// // @access  Public
// const authUser = asyncHandler(async (req, res) => {
//   const { email, password } = req.body;

//   const user = await User.findOne({ email });

//   if (user && (await user.matchPassword(password))) {
//     res.json({
//       _id: user._id,
//       name: user.name,
//       email: user.email,
//       phone: user.phone,
//       role: user.role,
//       token: generateToken(user._id),
//     });
//   } else {
//     res.status(401);
//     throw new Error("Invalid email or password");
//   }
// });

// // @desc    Register a new user
// // @route   POST /api/users
// // @access  Public (Customer) / Private (Admin Create)
// const registerUser = asyncHandler(async (req, res) => {
//   const { name, email, password, role, phone } = req.body;

//   const userExists = await User.findOne({ email });

//   if (userExists) {
//     res.status(400);
//     throw new Error("User already exists");
//   }

//   const user = await User.create({
//     name,
//     email,
//     password,
//     phone,
//     role: role || "customer",
//   });

//   if (user) {
//     const emailHtml = getEmailTemplate(
//       user.name,
//       `Welcome to Smart Pharmacy! Your account (${user.role}) has been created successfully.`
//     );
//     await sendUserEmail(user.email, "Welcome to Smart Pharmacy", emailHtml);

//     res.status(201).json({
//       _id: user._id,
//       name: user.name,
//       email: user.email,
//       phone: user.phone,
//       role: user.role,
//       token: generateToken(user._id),
//     });
//   } else {
//     res.status(400);
//     throw new Error("Invalid user data");
//   }
// });

// // @desc    Get user profile
// // @route   GET /api/users/profile
// // @access  Private
// // ✅ FIX: Enhanced with additional fields to prevent frontend blank screens
// const getUserProfile = asyncHandler(async (req, res) => {
//   const user = await User.findById(req.user._id);

//   if (user) {
//     res.json({
//       _id: user._id,
//       name: user.name,
//       email: user.email,
//       phone: user.phone || "",
//       role: user.role,
//       address: user.address || "",
//       allergies: user.allergies || "",
//       loyaltyPoints: user.loyaltyPoints || 0,
//       totalSpent: user.totalSpent || 0,
//     });
//   } else {
//     res.status(404);
//     throw new Error("User not found");
//   }
// });

// // @desc    Update user profile
// // @route   PUT /api/users/profile
// // @access  Private
// // ✅ FIX: Allows customers to self-update medical and contact info
// const updateUserProfile = asyncHandler(async (req, res) => {
//   const user = await User.findById(req.user._id);

//   if (user) {
//     user.name = req.body.name || user.name;
//     user.phone = req.body.phone || user.phone;
//     user.address = req.body.address || user.address;
//     user.allergies = req.body.allergies || user.allergies;

//     if (req.body.password) {
//       user.password = req.body.password;
//     }

//     const updatedUser = await user.save();

//     const emailHtml = getEmailTemplate(
//       updatedUser.name,
//       "Your profile information has been updated successfully."
//     );
//     await sendUserEmail(
//       updatedUser.email,
//       "Profile Updated - Smart Pharmacy",
//       emailHtml
//     );

//     res.json({
//       _id: updatedUser._id,
//       name: updatedUser.name,
//       email: updatedUser.email,
//       phone: updatedUser.phone,
//       role: updatedUser.role,
//       address: updatedUser.address,
//       allergies: updatedUser.allergies,
//       token: generateToken(updatedUser._id),
//     });
//   } else {
//     res.status(404);
//     throw new Error("User not found");
//   }
// });

// // @desc    Get all users (Search logic integrated)
// // @route   GET /api/users
// // @access  Private/Admin
// const getUsers = asyncHandler(async (req, res) => {
//   const keyword = req.query.search
//     ? {
//         $or: [
//           { name: { $regex: req.query.search, $options: "i" } },
//           { email: { $regex: req.query.search, $options: "i" } },
//           { phone: { $regex: req.query.search, $options: "i" } },
//         ],
//       }
//     : {};

//   // If role is specified in query (e.g. customer)
//   const roleQuery = req.query.role ? { role: req.query.role } : {};

//   const users = await User.find({ ...keyword, ...roleQuery }).select(
//     "-password"
//   );
//   res.json(users);
// });

// // @desc    Delete user
// // @route   DELETE /api/users/:id
// // @access  Private/Admin
// const deleteUser = asyncHandler(async (req, res) => {
//   const user = await User.findById(req.params.id);
//   if (user) {
//     await user.deleteOne();
//     res.json({ message: "User removed" });
//   } else {
//     res.status(404);
//     throw new Error("User not found");
//   }
// });

// // @desc    Get user by ID
// // @route   GET /api/users/:id
// // @access  Private/Admin
// const getUserById = asyncHandler(async (req, res) => {
//   const user = await User.findById(req.params.id).select("-password");
//   if (user) {
//     res.json(user);
//   } else {
//     res.status(404);
//     throw new Error("User not found");
//   }
// });

// // @desc    Update user
// // @route   PUT /api/users/:id
// // @access  Private/Admin
// const updateUser = asyncHandler(async (req, res) => {
//   const user = await User.findById(req.params.id);

//   if (user) {
//     user.name = req.body.name || user.name;
//     user.email = req.body.email || user.email;
//     user.phone = req.body.phone || user.phone;
//     user.role = req.body.role || user.role;
//     user.loyaltyPoints = req.body.loyaltyPoints || user.loyaltyPoints;
//     user.allergies = req.body.allergies || user.allergies;
//     user.notes = req.body.notes || user.notes;

//     const updatedUser = await user.save();

//     res.json({
//       _id: updatedUser._id,
//       name: updatedUser.name,
//       email: updatedUser.email,
//       role: updatedUser.role,
//     });
//   } else {
//     res.status(404);
//     throw new Error("User not found");
//   }
// });

// module.exports = {
//   authUser,
//   registerUser,
//   getUserProfile,
//   updateUserProfile,
//   getUsers,
//   deleteUser,
//   getUserById,
//   updateUser,
// };

const asyncHandler = require("express-async-handler");
const User = require("../models/User");
const generateToken = require("../utils/generateToken");
const sendEmail = require("../utils/sendEmail"); // ✅ Use shared utility

// -------------------------------------------------------------------
// 🔐 AUTHENTICATION
// -------------------------------------------------------------------

// @desc    Auth user & get token
// @route   POST /api/users/login
// @access  Public
const authUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });

  if (user && (await user.matchPassword(password))) {
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      role: user.role,
      isAdmin: user.role === "admin",
      token: generateToken(user._id),
    });
  } else {
    res.status(401);
    throw new Error("Invalid email or password");
  }
});

// @desc    Register a new user
// @route   POST /api/users
// @access  Public (Customer) / Private (Admin Create)
const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password, role, phone } = req.body;

  // 1. Validation
  if (!name || !email || !password || !phone) {
    res.status(400);
    throw new Error("All fields (Name, Email, Password, Phone) are required");
  }

  // 2. Check existence
  const userExists = await User.findOne({ email });
  if (userExists) {
    res.status(400);
    throw new Error("User already exists");
  }

  // 3. Create User
  const user = await User.create({
    name,
    email,
    password,
    phone,
    role: role || "customer",
  });

  if (user) {
    // 4. Send Welcome Email (Using Shared Utility)
    const message = `
      <h3>Welcome to Smart Pharmacy!</h3>
      <p>Hi ${user.name},</p>
      <p>Your account has been created successfully.</p>
      <p><strong>Role:</strong> ${user.role}</p>
      <p>You can now log in to manage prescriptions and appointments.</p>
    `;

    try {
      await sendEmail({
        email: user.email,
        subject: "Welcome to Smart Pharmacy",
        message,
      });
    } catch (error) {
      console.error("Welcome email failed:", error);
    }

    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      role: user.role,
      token: generateToken(user._id),
    });
  } else {
    res.status(400);
    throw new Error("Invalid user data");
  }
});

// -------------------------------------------------------------------
// 👤 PROFILE MANAGEMENT
// -------------------------------------------------------------------

// @desc    Get user profile
// @route   GET /api/users/profile
// @access  Private
const getUserProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);

  if (user) {
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      phone: user.phone || "",
      role: user.role,
      address: user.address || "",
      allergies: user.allergies || "",
      loyaltyPoints: user.loyaltyPoints || 0,
      totalSpent: user.totalSpent || 0,
    });
  } else {
    res.status(404);
    throw new Error("User not found");
  }
});

// @desc    Update user profile
// @route   PUT /api/users/profile
// @access  Private
const updateUserProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);

  if (user) {
    user.name = req.body.name || user.name;
    user.email = req.body.email || user.email;
    user.phone = req.body.phone || user.phone;
    user.address = req.body.address || user.address;
    user.allergies = req.body.allergies || user.allergies;

    if (req.body.password) {
      user.password = req.body.password;
    }

    const updatedUser = await user.save();

    // Security Notification
    try {
      await sendEmail({
        email: updatedUser.email,
        subject: "Security Alert: Profile Updated",
        message: `<p>Your profile information was updated on ${new Date().toLocaleString()}.</p>`,
      });
    } catch (e) {
      console.error("Profile update email failed");
    }

    res.json({
      _id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      phone: updatedUser.phone,
      role: updatedUser.role,
      address: updatedUser.address,
      allergies: updatedUser.allergies,
      token: generateToken(updatedUser._id),
    });
  } else {
    res.status(404);
    throw new Error("User not found");
  }
});

// -------------------------------------------------------------------
// 🛠️ ADMIN MANAGEMENT
// -------------------------------------------------------------------

// @desc    Get all users (Search + Pagination)
// @route   GET /api/users
// @access  Private/Admin
const getUsers = asyncHandler(async (req, res) => {
  const pageSize = 15;
  const page = Number(req.query.page) || 1;

  // Search Logic
  const keyword = req.query.search
    ? {
        $or: [
          { name: { $regex: req.query.search, $options: "i" } },
          { email: { $regex: req.query.search, $options: "i" } },
          { phone: { $regex: req.query.search, $options: "i" } },
        ],
      }
    : {};

  const roleFilter = req.query.role ? { role: req.query.role } : {};

  const count = await User.countDocuments({ ...keyword, ...roleFilter });
  const users = await User.find({ ...keyword, ...roleFilter })
    .select("-password")
    .sort({ createdAt: -1 })
    .limit(pageSize)
    .skip(pageSize * (page - 1));

  // ✅ Returns structure expected by AdminCustomers.jsx
  res.json({
    users,
    pagination: {
      page,
      pages: Math.ceil(count / pageSize),
      total: count,
    },
  });
});

// @desc    Delete user
// @route   DELETE /api/users/:id
// @access  Private/Admin
const deleteUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);
  if (user) {
    await user.deleteOne();
    res.json({ message: "User removed" });
  } else {
    res.status(404);
    throw new Error("User not found");
  }
});

// @desc    Get user by ID
// @route   GET /api/users/:id
// @access  Private/Admin
const getUserById = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id).select("-password");
  if (user) {
    res.json(user);
  } else {
    res.status(404);
    throw new Error("User not found");
  }
});

// @desc    Update user (Admin Override)
// @route   PUT /api/users/:id
// @access  Private/Admin
const updateUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);

  if (user) {
    user.name = req.body.name || user.name;
    user.email = req.body.email || user.email;
    user.phone = req.body.phone || user.phone;
    user.role = req.body.role || user.role;

    // Admin specific fields
    if (req.body.loyaltyPoints !== undefined)
      user.loyaltyPoints = req.body.loyaltyPoints;
    if (req.body.notes !== undefined) user.notes = req.body.notes;
    if (req.body.allergies !== undefined) user.allergies = req.body.allergies;

    const updatedUser = await user.save();

    res.json({
      _id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      phone: updatedUser.phone,
      role: updatedUser.role,
      loyaltyPoints: updatedUser.loyaltyPoints,
    });
  } else {
    res.status(404);
    throw new Error("User not found");
  }
});

module.exports = {
  authUser,
  registerUser,
  getUserProfile,
  updateUserProfile,
  getUsers,
  deleteUser,
  getUserById,
  updateUser,
};
