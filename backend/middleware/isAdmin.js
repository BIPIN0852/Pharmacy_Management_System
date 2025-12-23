// backend/middleware/isAdmin.js
function isAdmin(req, res, next) {
  // req.user is set by authenticateToken (JWT middleware)
  if (!req.user || req.user.role !== "admin") {
    return res.status(403).json({ message: "Admin access only" });
  }
  next();
}

module.exports = isAdmin;
