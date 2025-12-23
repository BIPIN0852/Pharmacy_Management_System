// const authenticateToken = require("./auth"); // your existing JWT middleware

// // Admin authorization middleware
// function adminAuth(req, res, next) {
//   authenticateToken(req, res, () => {
//     if (req.user.role !== "admin") {
//       return res.status(403).json({ message: "Access denied: Admins only" });
//     }
//     next();
//   });
// }

// module.exports = { adminAuth };

const jwt = require("jsonwebtoken");
const User = require("../models/User");

// ✅ Verify JWT and attach user to request
const authenticateToken = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ message: "No token provided" });
    }

    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findById(decoded.id).select("-password");
    if (!user) return res.status(404).json({ message: "User not found" });

    req.user = user;
    next();
  } catch (error) {
    console.error("Auth error:", error);
    return res.status(401).json({ message: "Invalid or expired token" });
  }
};

// ✅ Customer & general user middleware (for all authenticated users)
const userAuth = (req, res, next) => {
  authenticateToken(req, res, next);
};

// ✅ Admin authorization middleware
const adminAuth = (req, res, next) => {
  authenticateToken(req, res, () => {
    if (req.user.role !== "admin") {
      return res.status(403).json({ message: "Access denied: Admins only" });
    }
    next();
  });
};

// ✅ Export all
module.exports = { authenticateToken, userAuth, adminAuth };
