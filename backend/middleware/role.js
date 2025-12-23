// usage: authorizeRoles('admin','pharmacist')
function authorizeRoles(...allowed) {
  return (req, res, next) => {
    const role = req.user?.role;
    if (!role) return res.status(401).json({ message: "No role found" });
    if (!allowed.includes(role))
      return res.status(403).json({ message: "Forbidden: insufficient role" });
    next();
  };
}

module.exports = authorizeRoles;
