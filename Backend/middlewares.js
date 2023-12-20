
const { decode } = require("jsonwebtoken");
const Admin = require("./models/Admin");
const jwt_decode = require('jwt-decode');

exports.restrictToPresident = async function (req, res, next) {
  console.log("restricting to president..")
  try {
    console.log(req.cookies)
    const jwtToken = req.cookies.credentials;
    // const user = JSON.parse(req.headers['user-details']);
    const decoded = jwt_decode(jwtToken);;
    console.log("hello")
    if (!jwtToken) {
      console.log("an error is going to occur")
      return res
        .status(401)
        .json({ success: false, message: "Unauthorized Admin" });
    } else {
      console.log("inside else")
      console.log(decoded.aud)
     console.log(decoded.exp > Date.now()/1000)
      if (decoded.email == "snabbar.989@gmail.com" && decoded.iss == 'https://accounts.google.com' && decoded.exp > Date.now()/1000 && decoded.aud=="697080858655-ad4ucjp2be0sa40hk5ndam3lo5o87jhe.apps.googleusercontent.com") {
        console.log("I am the president!")

      // ****** sub to be added as well ******** 697080858655-ad4ucjp2be0sa40hk5ndam3lo5o87jhe.apps.googleusercontent.com

      req.DB_credentials = {
          username:"Snehil" ,
          password:"Sneh9448999745" ,
        };
        req.decoded = decoded;

        next();

      }
      else{

        return res
        .status(401)
        .json({ success: false, message: "Unauthorized Admin" });
      }
      // req._id = info._id;
    }
  } catch (error) {
    return res
      .status(500)
      .json({ success: false, message: "internal sever error" });
  }
};


exports.restrictToAdmin = async function (req, res, next) {
  try {
    const jwtToken = req.cookies.credentials;
    // const user = JSON.parse(req.headers['user-details']);
    const decoded = jwt_decode(jwtToken);;

    if (!jwtToken) {
      return res
        .status(401)
        .json({ success: false, message: "Unauthorized Admin" });
    } else {

      if (decoded.email == "snabbar.989@gmail.com" && decoded.iss == 'https://accounts.google.com' && decoded.exp > Date.now()/1000 && decoded.aud == process.env.GOOGLE_CLIENT_ID) {
        req.DB_credentials = {
          username:"Snehil" ,
          password:"Sneh9448999745" ,
        };

        next();
      }
      else if (decoded.email == "scitech_gymkhana@iitbhilai.ac.in" && decoded.iss  == 'https://accounts.google.com' && decoded.exp > Date.now()/1000 && decoded.aud == process.env.GOOGLE_CLIENT_ID ){
        req.DB_credentials = {
          username:process.env.SCITECH_USERNAME ,
          password:process.env.SCITECH_PASSWORD  ,
          User:"Gensec_Scitech"

        };
        next();
      }
      else if (decoded.email == "gensec_academic_gymkhana@iitbhilai.ac.in" && decoded.iss  == 'https://accounts.google.com' && decoded.exp > Date.now()/1000 && decoded.aud == process.env.GOOGLE_CLIENT_ID ){
        req.DB_credentials = {
          username:process.env.ACAD_USERNAME ,
          password:process.env.ACAD_PASSWORD,
          User:"Gensec_Scitech"

        };
        next();
      }
      else if (decoded.email == "Gensec_Cultural_Gymkhana@iitbhilai.ac.in" && decoded.iss  == 'https://accounts.google.com' && decoded.exp > Date.now()/1000 && decoded.aud == process.env.GOOGLE_CLIENT_ID ){


      req.DB_credentials = {
        username:process.env.CULT_USERNAME ,
        password:process.env.CULT_PASSWORD,
        User:"Gensec_Cult"
        };
        next();
      }
      else if (decoded.email == "Gensec_Sports_Gymkhana@iitbhilai.ac.in" && decoded.iss  == 'https://accounts.google.com' && decoded.exp > Date.now()/1000 && decoded.aud == process.env.GOOGLE_CLIENT_ID ){
        req.DB_credentials = {
          username:process.env.SPORT_USERNAME ,
          password:process.env.SPORT_PASSWORD ,
          User:"Gensec_Sports"
        };
        next();
      }
      // req._id = info._id;

    }
}catch (error) {
  return res
    .status(500)
    .json({ success: false, message: "internal sever error" });
}
};