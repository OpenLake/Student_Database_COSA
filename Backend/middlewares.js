// const jwt_decode = require("jwt-decode");

// const ADMIN_ROLES = {
//   PRESIDENT: "ayush05012003krishn@gmail.com",
//   GENSEC_SCITECH: "scitech_gymkhana@iitbhilai.ac.in",
//   GENSEC_ACADEMIC: "gensec_academic_gymkhana@iitbhilai.ac.in",
//   GENSEC_CULTURAL: "Gensec_Cultural_Gymkhana@iitbhilai.ac.in",
//   GENSEC_SPORTS: "Gensec_Sports_Gymkhana@iitbhilai.ac.in",
// };

// const ADMIN_CREDENTIALS = {
//   [ADMIN_ROLES.PRESIDENT]: {
//     username: process.env.PRESIDENT_USERNAME,
//     password: process.env.PRESIDENT_PASSWORD,
//   },
//   [ADMIN_ROLES.GENSEC_SCITECH]: {
//     username: process.env.SCITECH_USERNAME,
//     password: process.env.SCITECH_PASSWORD,
//   },
//   [ADMIN_ROLES.GENSEC_ACADEMIC]: {
//     username: process.env.ACAD_USERNAME,
//     password: process.env.ACAD_PASSWORD,
//   },
//   [ADMIN_ROLES.GENSEC_CULTURAL]: {
//     username: process.env.CULT_USERNAME,
//     password: process.env.CULT_PASSWORD,
//   },
//   [ADMIN_ROLES.GENSEC_SPORTS]: {
//     username: process.env.SPORT_USERNAME,
//     password: process.env.SPORT_PASSWORD,
//   },
// };

// const authenticateAdmin = (req, res, next, expectedRole) => {
//   try {
//     const jwtToken = req.cookies.credentials;
//     const decoded = jwt_decode(jwtToken);

//     if (!jwtToken || !isAdmin(decoded, expectedRole)) {
//       return res
//         .status(401)
//         .json({ success: false, message: "Unauthorized Admin" });
//     }

//     req.DB_credentials = ADMIN_CREDENTIALS[expectedRole];
//     req.decoded = decoded;
//     next();
//   } catch (error) {
//     console.error(error);
//     return res
//       .status(500)
//       .json({ success: false, message: "Internal Server Error" });
//   }
// };

// const isAdmin = (decoded, expectedRole) => {
//   return (
//     decoded.email === ADMIN_ROLES[expectedRole] &&
//     decoded.iss === "https://accounts.google.com" &&
//     decoded.exp > Date.now() / 1000 &&
//     decoded.aud === process.env.GOOGLE_CLIENT_ID
//   );
// };

exports.restrictToPresident = (req, res, next) => {
  // authenticateAdmin(req, res, next, "PRESIDENT");
  if (req.user.role == "president") {
    return next();
  } else {
    return res.status(401).json({ message: "Unauthorized" });
  }
};

exports.restrictToAdmin = (req, res, next) => {
  // authenticateAdmin(req, res, next, getAdminRole(req));
  if (req.user.role == "admin" || req.user.role == "president") {
    return next();
  } else {
    return res.status(401).json({ message: "Unauthorized" });
  }
};

// const getAdminRole = (req) => {
//   const decoded = jwt_decode(req.cookies.credentials);
//   const userEmail = decoded.email;

//   if (userEmail === ADMIN_ROLES.GENSEC_SCITECH) {
//     return "GENSEC_SCITECH";
//   } else if (userEmail === ADMIN_ROLES.GENSEC_ACADEMIC) {
//     return "GENSEC_ACADEMIC";
//   } else if (userEmail === ADMIN_ROLES.GENSEC_CULTURAL) {
//     return "GENSEC_CULTURAL";
//   } else if (userEmail === ADMIN_ROLES.GENSEC_SPORTS) {
//     return "GENSEC_SPORTS";
//   }

//   return ""; // Default case or handle as needed
// };

exports.isAuthenticated = (req, res, next) => {
  if (req.isAuthenticated()) {
    return next();
  } else {
    return res.status(401).json({ message: "Unauthorized" });
  }
};

exports.handleBadRequests = function (err, req, res) {
  console.error(err.stack);
  res.status(500).send("Something broke!");
};

exports.exceptionHandler = function (f) {
  return function (req, res, next) {
    Promise.resolve(f(req, res, next)).catch(next);
  };
};
