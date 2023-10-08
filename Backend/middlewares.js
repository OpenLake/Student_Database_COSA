const jwt = require("jsonwebtoken");
const Admin = require("./models/Admin");


exports.restrictToPresident = async function (req, res, next) {
  try {
    const token = req.cookies.token;
    if (!token) {
      return res
        .status(401)
        .json({ success: false, message: "Unauthorized Admin" });
    } else {
      const info = jwt.verify(token, process.env.JWT_SECRET);
      const user = await Admin.findById({ _id: info._id });

      if (user.email != "president@iitbhilai.ac.in") {
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