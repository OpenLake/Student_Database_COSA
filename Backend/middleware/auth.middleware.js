// const ADMIN_ROLES = {
//   PRESIDENT: "president_cosa@iitbhilai.ac.in",
//   GENSEC_SCITECH: "gensec_scitech_gymkhana@iitbhilai.ac.in",
//   GENSEC_ACADEMIC: "gensec_academic_gymkhana@iitbhilai.ac.in",
//   GENSEC_CULTURAL: "gensec_cultural_gymkhana@iitbhilai.ac.in",
//   GENSEC_SPORTS: "gensec_sports_gymkhana@iitbhilai.ac.in",
// };

const gensecs = [
  "gensec-scitech",
  "gensec-acad",
  "gensec-cult",
  "gensec-sports",
];

/**
 * Middleware to check if the user is authenticated
 */
exports.isAuthenticated = (req, res, next) => {
  if (req.isAuthenticated()) {
    return next();
  }
  console.log("Unauthorized");
  return res.status(401).json({ message: "Unauthorized Access!" });
};

/**
 * Middleware to check if user is an admin
 */
exports.verifyAdmin = (req, res, next) => {
  if (!req.user || req.user.role !== "admin") {
    return res.status(403).json({ error: "Admin access required" });
  }
  next();
};

exports.verifyGensec = (req, res, next) => {
  if (!req.user || !gensecs.includes(req.user.role)) {
    return res.status(403).json({ error: "Gensec access required" });
  }
  next();
};

/**
 * Middleware to check if user is a president
 */
exports.verifyPresident = (req, res, next) => {
  if (!req.user || req.user.role !== "president") {
    return res.status(403).json({ error: "President access required" });
  }
  next();
};
