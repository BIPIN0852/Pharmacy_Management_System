const isAdmin = (req, res, next) => {
  // req.user is set by the 'protect' or 'authenticateToken' middleware
  if (req.user && (req.user.role === "admin" || req.user.isAdmin === true)) {
    next();
  } else {
    return res.status(403).json({ message: "Access denied. Admins only." });
  }
};

module.exports = isAdmin;
