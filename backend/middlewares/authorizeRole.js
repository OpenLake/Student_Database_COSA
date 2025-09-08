const authorizeRole = (allowedRoles = []) => {
  return (req, res, next) => {
    const userRole = req.user.role;
    if (!allowedRoles.includes(userRole)) {
      return res.status(403).json({ error: "Forbidden: Insufficient role" });
    }
    next();
  };
};
module.exports = authorizeRole;
