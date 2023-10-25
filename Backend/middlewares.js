
const Admin = require("./models/Admin");
const jwt_decode = require('jwt-decode');

exports.restrictToPresident = async function (req, res, next) {
  try {
    const jwtToken = req.headers.authorization;
    const user = JSON.parse(req.headers['user-details']);
    const decoded = jwt_decode(jwtToken);;
   
    if (!jwtToken) {
      return res
        .status(401)
        .json({ success: false, message: "Unauthorized Admin" });
    } else {
      
      if (user.email != "ayush05012003krishn@gmail.com" && decoded.payload.iss !== 'https://accounts.google.com' && decoded.payload.exp < Date.now() / 1000 && decoded.payload.aud !== process.env.GOOGLE_CLIENT_ID  ) {
        return res
          .status(401)
          .json({ success: false, message: "Unauthorized Admin" });
      }
      // req._id = info._id;
      req.DB_credentials = {
        username:process.env.DB_USERNAME ,
        password:process.env.DB_PASSWORD ,
        // Include other credentials or data as needed
      };
      next();
    }
  } catch (error) {
    return res
      .status(500)
      .json({ success: false, message: "internal sever error" });
  }
};


exports.restrictToGen_Sec = async function (req, res, next) {
  try {
    const token = req.cookies.token;
    if (!token) {
      return res
        .status(401)
        .json({ success: false, message: "Unauthorized Admin" });
    } else {
      const info = jwt.verify(token, process.env.JWT_SECRET);
      const user = await Gen_Secs.findById({ _id: info._id });

      if (!user) {
        return res
          .status(401)
          .json({ success: false, message: "Unauthorized Admin" });
      }
      req._id = info._id;
      next();
    }
  } catch (error) {
    return res
      .status(500)
      .json({ success: false, message: "internal sever error" });
  }
};