
const Admin = require("./models/Admin");
const jwt_decode = require('jwt-decode');

exports.restrictToPresident = async function (req, res, next) {
  
  try {
    console.log(req.cookies)
    const jwtToken = req.cookies.credentials;
    // const user = JSON.parse(req.headers['user-details']);
    const decoded = jwt_decode(jwtToken);;
    console.log(decoded)
    if (!jwtToken) {
      return res
        .status(401)
        .json({ success: false, message: "Unauthorized Admin" });
    } else {
     
      if (decoded.email == "ayush05012003krishn@gmail.com" && decoded.iss == 'https://accounts.google.com' && decoded.exp > Date.now()/1000 && decoded.aud==process.env.GOOGLE_CLIENT_ID) {
      
      // ****** sub to be added as well ******** 697080858655-ad4ucjp2be0sa40hk5ndam3lo5o87jhe.apps.googleusercontent.com
     
      req.DB_credentials = {
          username:process.env.PRESIDENT_USERNAME ,
          password:process.env.PRESIDENT_PASSWORD ,
          // Include other credentials or data as needed
        };
        console.log("Pres")
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
      
      if (decoded.email == "ayush05012003krishn@gmail.com" && decoded.payload.iss == 'https://accounts.google.com' && decoded.payload.exp > Date.now() / 1000 && decoded.payload.aud == process.env.GOOGLE_CLIENT_ID  ) {
        req.DB_credentials = {
          username:process.env.PRESIDENT_USERNAME ,
          password:process.env.PRESIDENT_PASSWORD ,
          // Include other credentials or data as needed
        };
        next();
      }
      else if (decoded.email == "scitech_gymkhana@iitbhilai.ac.in" && decoded.payload.iss == 'https://accounts.google.com' && decoded.payload.exp > Date.now() / 1000 && decoded.payload.aud == process.env.GOOGLE_CLIENT_ID ){
        req.DB_credentials = {
          username:process.env.SCITECH_USERNAME ,
          password:process.env.SCITECH_PASSWORD  ,
          // Include other credentials or data as needed
        };
        next();
      }
      else if (decoded.email == "gensec_academic_gymkhana@iitbhilai.ac.in" && decoded.payload.iss == 'https://accounts.google.com' && decoded.payload.exp > Date.now() / 1000 && decoded.payload.aud == process.env.GOOGLE_CLIENT_ID ){
        req.DB_credentials = {
          username:process.env.ACAD_USERNAME ,
          password:process.env.ACAD_PASSWORD,
          // Include other credentials or data as needed
        };
        next();   
      }
      else if (decoded.email == "Gensec_Cultural_Gymkhana@iitbhilai.ac.in" && decoded.payload.iss == 'https://accounts.google.com' && decoded.payload.exp > Date.now() / 1000 && decoded.payload.aud == process.env.GOOGLE_CLIENT_ID ){
        
      
      req.DB_credentials = {
        username:process.env.CULT_USERNAME ,
        password:process.env.CULT_PASSWORD,
          // Include other credentials or data as needed
        };
        next();
      }
      else if (decoded.email == "Gensec_Sports_Gymkhana@iitbhilai.ac.in" && decoded.payload.iss == 'https://accounts.google.com' && decoded.payload.exp > Date.now() / 1000 && decoded.payload.aud == process.env.GOOGLE_CLIENT_ID ){
        req.DB_credentials = {
          username:process.env.SPORT_USERNAME ,
          password:process.env.SPORT_PASSWORD ,
          // Include other credentials or data as needed
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