const jwt = require("jsonwebtoken");
const User = require("../models/User");

const authAdmin = async (req, res, next) => {
  let token;

  // 1. Check Authorization Header
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      // Get token from header
      token = req.headers.authorization.split(" ")[1];

      // 2. Verify Token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // 3. Get User from DB (Exclude password)
      // We check the DB to ensure the user wasn't deleted or demoted recently
      req.user = await User.findById(decoded.id).select("-password");

      if (!req.user) {
        return res
          .status(401)
          .json({ message: "Not authorized, user not found" });
      }

      // 4. Check Admin Role
      // Checks both 'role' string and boolean 'isAdmin' flag for compatibility
      if (req.user.role !== "admin" && !req.user.isAdmin) {
        return res.status(403).json({ message: "Access denied. Admins only." });
      }

      next();
    } catch (error) {
      console.error("Admin Auth Error:", error.message);
      return res.status(401).json({ message: "Not authorized, token failed" });
    }
  }

  if (!token) {
    return res.status(401).json({ message: "Not authorized, no token" });
  }
};

module.exports = authAdmin;
