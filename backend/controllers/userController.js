// const asyncHandler = require("express-async-handler");
// const User = require("../models/User");
// const Medicine = require("../models/Medicine");
// const generateToken = require("../utils/generateToken");
// const sendEmail = require("../utils/sendEmail");

// // -------------------------------------------------------------------
// // 🔐 AUTHENTICATION
// // -------------------------------------------------------------------

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
//       isAdmin: user.role === "admin",
//       profilePhoto: user.profilePhoto || "",
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

//   if (!name || !email || !password || !phone) {
//     res.status(400);
//     throw new Error("All fields (Name, Email, Password, Phone) are required");
//   }

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
//     const message = `
//       <h3>Welcome to Smart Pharmacy!</h3>
//       <p>Hi ${user.name},</p>
//       <p>Your account has been created successfully.</p>
//       <p><strong>Role:</strong> ${user.role}</p>
//       <p>You can now log in to manage prescriptions and appointments.</p>
//     `;

//     try {
//       await sendEmail({
//         email: user.email,
//         subject: "Welcome to Smart Pharmacy",
//         message,
//       });
//     } catch (error) {
//       console.error("Welcome email failed:", error);
//     }

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

// // -------------------------------------------------------------------
// // 👤 PROFILE MANAGEMENT
// // -------------------------------------------------------------------

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
//       phone: user.phone || "",
//       role: user.role,
//       address: user.address || "",
//       profilePhoto: user.profilePhoto || "",
//       gender: user.gender || "",
//       dob: user.dob || null,
//       bloodGroup: user.bloodGroup || "",
//       allergies: user.allergies || "",
//       chronicConditions: user.chronicConditions || "",
//       emergencyContact: user.emergencyContact || "",
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
// const updateUserProfile = async (req, res) => {
//   try {
//     const user = await User.findById(req.user._id);

//     if (user) {
//       user.name = req.body.name || user.name;
//       user.phone = req.body.phone || user.phone;
//       user.gender = req.body.gender || user.gender;
//       user.dob = req.body.dob || user.dob;
//       user.bloodGroup = req.body.bloodGroup || user.bloodGroup;
//       user.allergies = req.body.allergies || user.allergies;
//       user.chronicConditions =
//         req.body.chronicConditions || user.chronicConditions;
//       user.emergencyContact =
//         req.body.emergencyContact || user.emergencyContact;

//       // Safely handle the address
//       if (req.body.address) {
//         if (typeof req.body.address === "string") {
//           user.address = {
//             street: req.body.address,
//             city: user.address?.city || "",
//             province: user.address?.province || "",
//             postalCode: user.address?.postalCode || "",
//           };
//         }
//       }

//       // If Multer caught a file, forcefully save the new image path
//       if (req.file) {
//         user.profilePhoto = `/images/${req.file.filename}`;
//       }
//       // If no new file, but a string exists (and isn't a crashed object), keep it
//       else if (
//         req.body.profilePhoto &&
//         typeof req.body.profilePhoto === "string" &&
//         req.body.profilePhoto !== "[object Object]" &&
//         req.body.profilePhoto !== "{}"
//       ) {
//         user.profilePhoto = req.body.profilePhoto;
//       }

//       if (req.body.password) {
//         user.password = req.body.password;
//       }

//       const updatedUser = await user.save();

//       res.json({
//         _id: updatedUser._id,
//         name: updatedUser.name,
//         email: updatedUser.email,
//         phone: updatedUser.phone,
//         address: updatedUser.address?.street || "",
//         profilePhoto: updatedUser.profilePhoto, // Send back the saved photo path
//         gender: updatedUser.gender,
//         dob: updatedUser.dob,
//         bloodGroup: updatedUser.bloodGroup,
//         allergies: updatedUser.allergies,
//         chronicConditions: updatedUser.chronicConditions,
//         emergencyContact: updatedUser.emergencyContact,
//       });
//     } else {
//       res.status(404);
//       throw new Error("User not found");
//     }
//   } catch (error) {
//     console.error("Profile Update Error:", error.message);
//     res.status(400).json({ message: error.message });
//   }
// };

// // -------------------------------------------------------------------
// // ❤️ WISHLIST MANAGEMENT
// // -------------------------------------------------------------------

// // @desc    Get user saved medicines (Wishlist)
// // @route   GET /api/customer/saved-medicines OR /api/users/saved-medicines
// // @access  Private
// const getSavedMedicines = asyncHandler(async (req, res) => {
//   if (!req.user || !req.user._id) {
//     res.status(401);
//     throw new Error("Not authorized, no user found");
//   }

//   const user = await User.findById(req.user._id);

//   if (!user) {
//     res.status(404);
//     throw new Error("User not found in database");
//   }

//   if (user.savedMedicines && user.savedMedicines.length > 0) {
//     const userData = await User.findById(req.user._id).populate({
//       path: "savedMedicines",
//       select: "name image price manufacturer category countInStock description",
//       model: "Medicine",
//     });
//     res.json(userData.savedMedicines || []);
//   } else {
//     res.json([]);
//   }
// });

// // @desc    Toggle saved medicine (Add/Remove)
// // @route   POST /api/users/saved-medicines
// // @access  Private
// const toggleSavedMedicine = asyncHandler(async (req, res) => {
//   const { medicineId } = req.body;
//   const user = await User.findById(req.user._id);

//   if (user) {
//     // Check if medicine is already in the wishlist
//     const alreadySaved = user.savedMedicines.find(
//       (id) => id.toString() === medicineId,
//     );

//     if (alreadySaved) {
//       // REMOVE it
//       user.savedMedicines = user.savedMedicines.filter(
//         (id) => id.toString() !== medicineId,
//       );
//       await user.save();
//       res.json({ message: "Removed from wishlist", isSaved: false });
//     } else {
//       // ADD it
//       user.savedMedicines.push(medicineId);
//       await user.save();
//       res.json({ message: "Added to wishlist", isSaved: true });
//     }
//   } else {
//     res.status(404);
//     throw new Error("User not found");
//   }
// });

// // @desc    Remove specific item (For Delete Button)
// // @route   DELETE /api/users/saved-medicines/:id
// // @access  Private
// const removeSavedMedicine = asyncHandler(async (req, res) => {
//   const user = await User.findById(req.user._id);
//   if (user) {
//     user.savedMedicines = user.savedMedicines.filter(
//       (id) => id.toString() !== req.params.id,
//     );
//     await user.save();
//     res.json({ message: "Item removed" });
//   } else {
//     res.status(404);
//     throw new Error("User not found");
//   }
// });

// // -------------------------------------------------------------------
// // 🛠️ ADMIN MANAGEMENT
// // -------------------------------------------------------------------

// // @desc    Get all users (Search + Pagination)
// // @route   GET /api/users
// // @access  Private/Admin
// const getUsers = asyncHandler(async (req, res) => {
//   const pageSize = 15;
//   const page = Number(req.query.page) || 1;

//   const keyword = req.query.search
//     ? {
//         $or: [
//           { name: { $regex: req.query.search, $options: "i" } },
//           { email: { $regex: req.query.search, $options: "i" } },
//           { phone: { $regex: req.query.search, $options: "i" } },
//         ],
//       }
//     : {};

//   let roleFilter = req.query.role ? { role: req.query.role } : {};

//   if (req.user && req.user.role === "pharmacist") {
//     roleFilter = { role: "customer" };
//   }

//   const count = await User.countDocuments({ ...keyword, ...roleFilter });
//   const users = await User.find({ ...keyword, ...roleFilter })
//     .select("-password")
//     .sort({ createdAt: -1 })
//     .limit(pageSize)
//     .skip(pageSize * (page - 1));

//   res.json({
//     users,
//     pagination: {
//       page,
//       pages: Math.ceil(count / pageSize),
//       total: count,
//     },
//   });
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

// // @desc    Update user (Admin Override)
// // @route   PUT /api/users/:id
// // @access  Private/Admin
// const updateUser = asyncHandler(async (req, res) => {
//   const user = await User.findById(req.params.id);

//   if (user) {
//     user.name = req.body.name || user.name;
//     user.email = req.body.email || user.email;
//     user.phone = req.body.phone || user.phone;
//     user.role = req.body.role || user.role;

//     if (req.body.loyaltyPoints !== undefined)
//       user.loyaltyPoints = req.body.loyaltyPoints;
//     if (req.body.notes !== undefined) user.notes = req.body.notes;
//     if (req.body.allergies !== undefined) user.allergies = req.body.allergies;

//     const updatedUser = await user.save();

//     res.json({
//       _id: updatedUser._id,
//       name: updatedUser.name,
//       email: updatedUser.email,
//       phone: updatedUser.phone,
//       role: updatedUser.role,
//       loyaltyPoints: updatedUser.loyaltyPoints,
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
//   getSavedMedicines,
//   toggleSavedMedicine,
//   removeSavedMedicine,
//   getUsers,
//   deleteUser,
//   getUserById,
//   updateUser,
// };

const asyncHandler = require("express-async-handler");
const User = require("../models/User");
const Medicine = require("../models/Medicine");
const generateToken = require("../utils/generateToken");
const sendEmail = require("../utils/sendEmail");

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
      profilePhoto: user.profilePhoto || "",
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

  if (!name || !email || !password || !phone) {
    res.status(400);
    throw new Error("All fields (Name, Email, Password, Phone) are required");
  }

  const userExists = await User.findOne({ email });
  if (userExists) {
    res.status(400);
    throw new Error("User already exists");
  }

  const user = await User.create({
    name,
    email,
    password,
    phone,
    role: role || "customer",
  });

  if (user) {
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
      profilePhoto: user.profilePhoto || "",
      gender: user.gender || "",
      dob: user.dob || null,
      bloodGroup: user.bloodGroup || "",
      allergies: user.allergies || "",
      chronicConditions: user.chronicConditions || "",
      emergencyContact: user.emergencyContact || "",
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
const updateUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    if (user) {
      user.name = req.body.name || user.name;
      user.phone = req.body.phone || user.phone;
      user.gender = req.body.gender || user.gender;
      user.dob = req.body.dob || user.dob;
      user.bloodGroup = req.body.bloodGroup || user.bloodGroup;
      user.allergies = req.body.allergies || user.allergies;
      user.chronicConditions =
        req.body.chronicConditions || user.chronicConditions;
      user.emergencyContact =
        req.body.emergencyContact || user.emergencyContact;

      // Safely handle the address
      if (req.body.address) {
        if (typeof req.body.address === "string") {
          user.address = {
            street: req.body.address,
            city: user.address?.city || "",
            province: user.address?.province || "",
            postalCode: user.address?.postalCode || "",
          };
        }
      }

      // If Multer caught a file, forcefully save the new image path
      if (req.file) {
        user.profilePhoto = `/images/${req.file.filename}`;
      }
      // If no new file, but a string exists (and isn't a crashed object), keep it
      else if (
        req.body.profilePhoto &&
        typeof req.body.profilePhoto === "string" &&
        req.body.profilePhoto !== "[object Object]" &&
        req.body.profilePhoto !== "{}"
      ) {
        user.profilePhoto = req.body.profilePhoto;
      }

      if (req.body.password) {
        user.password = req.body.password;
      }

      const updatedUser = await user.save();

      res.json({
        _id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
        phone: updatedUser.phone,
        address: updatedUser.address?.street || "",
        profilePhoto: updatedUser.profilePhoto, // Send back the saved photo path
        gender: updatedUser.gender,
        dob: updatedUser.dob,
        bloodGroup: updatedUser.bloodGroup,
        allergies: updatedUser.allergies,
        chronicConditions: updatedUser.chronicConditions,
        emergencyContact: updatedUser.emergencyContact,
      });
    } else {
      res.status(404);
      throw new Error("User not found");
    }
  } catch (error) {
    console.error("Profile Update Error:", error.message);
    res.status(400).json({ message: error.message });
  }
};

// -------------------------------------------------------------------
// ❤️ WISHLIST MANAGEMENT
// -------------------------------------------------------------------

// @desc    Get user saved medicines (Wishlist)
// @route   GET /api/customer/saved-medicines OR /api/users/saved-medicines
// @access  Private
const getSavedMedicines = asyncHandler(async (req, res) => {
  if (!req.user || !req.user._id) {
    res.status(401);
    throw new Error("Not authorized, no user found");
  }

  const user = await User.findById(req.user._id);

  if (!user) {
    res.status(404);
    throw new Error("User not found in database");
  }

  if (user.savedMedicines && user.savedMedicines.length > 0) {
    const userData = await User.findById(req.user._id).populate({
      path: "savedMedicines",
      select: "name image price manufacturer category countInStock description",
      model: "Medicine",
    });
    res.json(userData.savedMedicines || []);
  } else {
    res.json([]);
  }
});

// @desc    Toggle saved medicine (Add/Remove)
// @route   POST /api/users/saved-medicines
// @access  Private
const toggleSavedMedicine = asyncHandler(async (req, res) => {
  const { medicineId } = req.body;
  const user = await User.findById(req.user._id);

  if (user) {
    // Check if medicine is already in the wishlist
    const alreadySaved = user.savedMedicines.find(
      (id) => id.toString() === medicineId,
    );

    if (alreadySaved) {
      // REMOVE it
      user.savedMedicines = user.savedMedicines.filter(
        (id) => id.toString() !== medicineId,
      );
      await user.save();
      res.json({ message: "Removed from wishlist", isSaved: false });
    } else {
      // ADD it
      user.savedMedicines.push(medicineId);
      await user.save();
      res.json({ message: "Added to wishlist", isSaved: true });
    }
  } else {
    res.status(404);
    throw new Error("User not found");
  }
});

// @desc    Remove specific item (For Delete Button)
// @route   DELETE /api/users/saved-medicines/:id
// @access  Private
const removeSavedMedicine = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);
  if (user) {
    user.savedMedicines = user.savedMedicines.filter(
      (id) => id.toString() !== req.params.id,
    );
    await user.save();
    res.json({ message: "Item removed" });
  } else {
    res.status(404);
    throw new Error("User not found");
  }
});

// -------------------------------------------------------------------
// 🛠️ ADMIN MANAGEMENT
// -------------------------------------------------------------------

// @desc    Get all users (Search + Pagination + Aggregated Financials)
// @route   GET /api/users
// @access  Private/Admin
const getUsers = asyncHandler(async (req, res) => {
  const pageSize = 15;
  const page = Number(req.query.page) || 1;
  const skip = pageSize * (page - 1);

  // 1. Build the Match Query
  const keyword = req.query.search
    ? {
        $or: [
          { name: { $regex: req.query.search, $options: "i" } },
          { email: { $regex: req.query.search, $options: "i" } },
          { phone: { $regex: req.query.search, $options: "i" } },
        ],
      }
    : {};

  let roleFilter = req.query.role ? { role: req.query.role } : {};

  // Prevent pharmacists from seeing admins/doctors
  if (req.user && req.user.role === "pharmacist") {
    roleFilter = { role: "customer" };
  }

  const matchQuery = { ...keyword, ...roleFilter };

  // 2. Count total documents for pagination
  const count = await User.countDocuments(matchQuery);

  // 3. Aggregation Pipeline to fetch Users AND sum up their paid Orders
  const users = await User.aggregate([
    { $match: matchQuery },
    {
      $lookup: {
        from: "orders", // Must match your MongoDB orders collection name
        localField: "_id",
        foreignField: "user",
        as: "customerOrders",
      },
    },
    {
      $addFields: {
        totalSpent: {
          $sum: {
            $map: {
              input: {
                $filter: {
                  input: "$customerOrders",
                  as: "order",
                  cond: { $eq: ["$$order.isPaid", true] },
                },
              },
              as: "paidOrder",
              in: "$$paidOrder.totalPrice",
            },
          },
        },
      },
    },
    {
      $project: {
        password: 0, // Ensure password is removed
        customerOrders: 0, // Remove the massive order array from response
      },
    },
    { $sort: { createdAt: -1 } },
    { $skip: skip },
    { $limit: pageSize },
  ]);

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
  getSavedMedicines,
  toggleSavedMedicine,
  removeSavedMedicine,
  getUsers,
  deleteUser,
  getUserById,
  updateUser,
};
