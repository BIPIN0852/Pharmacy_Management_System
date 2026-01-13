// // usage: authorizeRoles('admin','pharmacist')
// function authorizeRoles(...allowed) {
//   return (req, res, next) => {
//     const role = req.user?.role;
//     if (!role) return res.status(401).json({ message: "No role found" });
//     if (!allowed.includes(role))
//       return res.status(403).json({ message: "Forbidden: insufficient role" });
//     next();
//   };
// }

// module.exports = authorizeRoles;

/**
 * Middleware to restrict access based on user roles.
 * Usage: router.get('/route', protect, authorizeRoles('admin', 'pharmacist'), controller)
 */
const authorizeRoles = (...allowedRoles) => {
  return (req, res, next) => {
    // Ensure user is logged in (req.user populated by 'protect' middleware)
    if (!req.user) {
      return res.status(401).json({ message: "Not authorized, no user found" });
    }

    // Check if user's role is in the allowed list
    // Also allow access if user is explicitly an Admin (legacy support)
    if (
      allowedRoles.includes(req.user.role) ||
      (req.user.isAdmin && allowedRoles.includes("admin"))
    ) {
      next();
    } else {
      res.status(403).json({
        message: `Access denied. Requires one of: ${allowedRoles.join(", ")}`,
      });
    }
  };
};

module.exports = authorizeRoles;
