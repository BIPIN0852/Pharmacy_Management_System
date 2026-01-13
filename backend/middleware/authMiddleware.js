// const jwt = require("jsonwebtoken");
// const asyncHandler = require("express-async-handler");
// const User = require("../models/User");

// // --- 1. Protect Middleware (Verifies Token) ---
// const protect = asyncHandler(async (req, res, next) => {
//   let token;

//   if (
//     req.headers.authorization &&
//     req.headers.authorization.startsWith("Bearer")
//   ) {
//     try {
//       token = req.headers.authorization.split(" ")[1];
//       const decoded = jwt.verify(token, process.env.JWT_SECRET);

//       req.user = await User.findById(decoded.id).select("-password");

//       if (!req.user) {
//         res.status(401);
//         throw new Error("User not found");
//       }

//       next();
//     } catch (error) {
//       console.error(error);
//       res.status(401);
//       throw new Error("Not authorized, token failed");
//     }
//   }

//   if (!token) {
//     res.status(401);
//     throw new Error("Not authorized, no token");
//   }
// });

// // --- 2. Admin Middleware (Fixes 403) ---
// const admin = (req, res, next) => {
//   if (req.user && (req.user.role === "admin" || req.user.isAdmin === true)) {
//     next();
//   } else {
//     res.status(403);
//     throw new Error("Not authorized as an admin");
//   }
// };

// // --- 3. Pharmacist Middleware ---
// const pharmacist = (req, res, next) => {
//   if (
//     req.user &&
//     (req.user.role === "pharmacist" ||
//       req.user.role === "admin" ||
//       req.user.role === "staff" ||
//       req.user.isAdmin === true)
//   ) {
//     next();
//   } else {
//     res.status(403);
//     throw new Error("Not authorized as a pharmacist");
//   }
// };

// // --- 4. Customer Middleware ---
// const customer = (req, res, next) => {
//   if (
//     req.user &&
//     (req.user.role === "customer" ||
//       req.user.role === "admin" ||
//       req.user.isAdmin === true)
//   ) {
//     next();
//   } else {
//     res.status(403);
//     throw new Error("Not authorized as a customer");
//   }
// };

// module.exports = { protect, admin, pharmacist, customer };

// const jwt = require("jsonwebtoken");
// const asyncHandler = require("express-async-handler");
// const User = require("../models/User");

// const protect = asyncHandler(async (req, res, next) => {
//   let token;

//   if (
//     req.headers.authorization &&
//     req.headers.authorization.startsWith("Bearer")
//   ) {
//     try {
//       token = req.headers.authorization.split(" ")[1];
//       const decoded = jwt.verify(token, process.env.JWT_SECRET);

//       req.user = await User.findById(decoded.id).select("-password");

//       if (!req.user) {
//         res.status(401);
//         throw new Error("User not found");
//       }
//       next();
//     } catch (error) {
//       console.error(error);
//       res.status(401);
//       throw new Error("Not authorized, token failed");
//     }
//   }

//   if (!token) {
//     res.status(401);
//     throw new Error("Not authorized, no token");
//   }
// });

// // ✅ ROBUST ADMIN CHECK
// const admin = (req, res, next) => {
//   // Checks for 'role: admin' OR 'isAdmin: true' (backward compatibility)
//   if (req.user && (req.user.role === "admin" || req.user.isAdmin === true)) {
//     next();
//   } else {
//     res.status(403);
//     throw new Error("Not authorized as an admin");
//   }
// };

// const pharmacist = (req, res, next) => {
//   if (
//     req.user &&
//     (req.user.role === "pharmacist" ||
//       req.user.role === "admin" ||
//       req.user.isAdmin === true)
//   ) {
//     next();
//   } else {
//     res.status(403);
//     throw new Error("Not authorized as a pharmacist");
//   }
// };

// const customer = (req, res, next) => {
//   if (
//     req.user &&
//     (req.user.role === "customer" ||
//       req.user.role === "admin" ||
//       req.user.isAdmin === true)
//   ) {
//     next();
//   } else {
//     res.status(403);
//     throw new Error("Not authorized as a customer");
//   }
// };

// module.exports = { protect, admin, pharmacist, customer };

const jwt = require("jsonwebtoken");
const asyncHandler = require("express-async-handler");
const User = require("../models/User");

// ----------------------
// 1. Generate JWT Token
// ----------------------
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: "30d",
  });
};

// ----------------------
// 2. Protect Routes (Verify Token)
// ----------------------
const protect = asyncHandler(async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      // Get token from header
      token = req.headers.authorization.split(" ")[1];

      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Get user from the token (exclude password)
      req.user = await User.findById(decoded.id).select("-password");

      if (!req.user) {
        res.status(401);
        throw new Error("Not authorized, user not found");
      }

      next();
    } catch (error) {
      console.error(error);
      res.status(401);
      throw new Error("Not authorized, token failed");
    }
  }

  if (!token) {
    res.status(401);
    throw new Error("Not authorized, no token");
  }
});

// ----------------------
// 3. Role-Based Middleware
// ----------------------

// ✅ ADMIN CHECK
const admin = (req, res, next) => {
  if (req.user && (req.user.role === "admin" || req.user.isAdmin === true)) {
    next();
  } else {
    res.status(403);
    throw new Error("Not authorized as an admin");
  }
};

// ✅ PHARMACIST CHECK (Admins also allowed)
const pharmacist = (req, res, next) => {
  if (
    req.user &&
    (req.user.role === "pharmacist" ||
      req.user.role === "admin" ||
      req.user.isAdmin === true)
  ) {
    next();
  } else {
    res.status(403);
    throw new Error("Not authorized as a pharmacist");
  }
};

// ✅ CUSTOMER CHECK (Admins also allowed)
const customer = (req, res, next) => {
  if (
    req.user &&
    (req.user.role === "customer" ||
      req.user.role === "admin" ||
      req.user.isAdmin === true)
  ) {
    next();
  } else {
    res.status(403);
    throw new Error("Not authorized as a customer");
  }
};

module.exports = {
  generateToken, // ✅ Exported for use in controllers
  protect,
  admin,
  pharmacist,
  customer,
};
