const jwt = require("jsonwebtoken");
const User = require("../models/User");

// 1. Generate JWT Token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: "30d",
  });
};

// 2. Protect Middleware (Verify Token)
const protect = async (req, res, next) => {
  let token;

  // Check Authorization Header
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      // Get token from header (Bearer <token>)
      token = req.headers.authorization.split(" ")[1];

      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Get user from the token, exclude password
      // This attaches the full User object to req.user for use in controllers
      req.user = await User.findById(decoded.id).select("-password");

      if (!req.user) {
        return res
          .status(401)
          .json({ message: "Not authorized, user not found" });
      }

      next();
    } catch (error) {
      console.error("Token verification failed:", error);
      res.status(401).json({ message: "Not authorized, token failed" });
    }
  }

  if (!token) {
    res.status(401).json({ message: "Not authorized, no token" });
  }
};

// 3. Admin Middleware
const admin = (req, res, next) => {
  if (req.user && (req.user.role === "admin" || req.user.isAdmin)) {
    next();
  } else {
    res.status(403).json({ message: "Access denied. Admins only." });
  }
};

// 4. Pharmacist Middleware
const pharmacist = (req, res, next) => {
  if (
    req.user &&
    (req.user.role === "pharmacist" || req.user.role === "admin")
  ) {
    next();
  } else {
    res.status(403).json({ message: "Access denied. Pharmacists only." });
  }
};

module.exports = { generateToken, protect, admin, pharmacist };
