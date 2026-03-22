const jwt = require("jsonwebtoken");

//Passport based middleware to check whether the req are coming from authenticated users
function isAuthenticated(req, res, next) {
  if (req.isAuthenticated && req.isAuthenticated()) {
    return next();
  }
  return res.status(401).json({ message: "Unauthorized: Please login first" });
}

//Token based middleware to check whether the req are coming from authenticated users or not

function jwtIsAuthenticated(req, res, next) {
  let token;
  /**
   * const headerData = req.headers.authorization;
  if (!headerData || !headerData.startsWith("Bearer ")) {
    return res.status(401).json({ message: "User not authenticated " });
  }

  token = headerData.split(" ")[1];
   */

  token = req.cookies.token;
  if(!token){
    return res.status(401).json({message: "User not authenticated"});
  }
  
  try {
    const userData = jwt.verify(token, process.env.JWT_SECRET_TOKEN);
    req.user = userData;
    //console.log(userData);
    next();
  } catch (err) {
    res.status(401).json({ message: "Invalid or expired token sent" });
  }
}

module.exports = {
  isAuthenticated,
  jwtIsAuthenticated,
};

/*

const presidentObj = await User.findById(presidentId);

    console.log(presidentObj._id);
    if(!gensecObj || !presidentObj) {
      return res.status(500).json({ message: "Approvers not found" });
    }

    const approverIds = [gensecObj._id.toString(), presidentId];

    const userChecks = await Promise.all(
        users.map(async (uid) => {
            const validation = zodObjectId.safeParse(uid);
            if(!validation){
                return {uid, ok: false, reason:"Invalid ID"};
            }

            const userObj = await User.findById(uid);
            if(!userObj) return {uid, ok:false, reason: "User not found"};

            return {uid, ok: true};
        })
    );

    const invalidData = userChecks.filter((c) => !c.ok);
    if(invalidData.length > 0){
        return res.status(400).json({message: "Invalid user data sent", details: invalidData});
    }
    
    const newBatch = await CertificateBatch.create({
        title,
        unit_id,
        commonData,
        template_id,
        initiatedBy: id,
        approverIds,
        users
    });

*/
