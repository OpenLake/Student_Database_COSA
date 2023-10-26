
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
      
      if (decoded.email == "ayush05012003krishn@gmail.com" && decoded.iss == 'https://accounts.google.com' && decoded.exp > Date.now() / 1000 && decoded.aud == process.env.GOOGLE_CLIENT_ID  ) {
      
      //sub to be added as well  
      
      req.DB_credentials = {
          username:process.env.DB_USERNAME ,
          password:process.env.DB_PASSWORD ,
          // Include other credentials or data as needed
        };
        next();  
        console.log("Pres")
      }
      else{
        console.log("aayush")
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
    const jwtToken = req.headers.authorization;
    const user = JSON.parse(req.headers['user-details']);
    const decoded = jwt_decode(jwtToken);;
   
    if (!jwtToken) {
      return res
        .status(401)
        .json({ success: false, message: "Unauthorized Admin" });
    } else {
      
      if (decoded.email == "ayush05012003krishn@gmail.com" && decoded.payload.iss == 'https://accounts.google.com' && decoded.payload.exp > Date.now() / 1000 && decoded.payload.aud == process.env.GOOGLE_CLIENT_ID  ) {
        req.DB_credentials = {
          username:process.env.DB_USERNAME ,
          password:process.env.DB_PASSWORD ,
          // Include other credentials or data as needed
        };
        next();
      }
      else if (decoded.email == "scitech_gymkhana@iitbhilai.ac.in" && decoded.payload.iss == 'https://accounts.google.com' && decoded.payload.exp > Date.now() / 1000 && decoded.payload.aud == process.env.GOOGLE_CLIENT_ID ){
        req.DB_credentials = {
          username:process.env.DB_USERNAME ,
          password:process.env.DB_PASSWORD ,
          // Include other credentials or data as needed
        };
        next();
      }
      else if (decoded.email == "gensec_academic_gymkhana@iitbhilai.ac.in" && decoded.payload.iss == 'https://accounts.google.com' && decoded.payload.exp > Date.now() / 1000 && decoded.payload.aud == process.env.GOOGLE_CLIENT_ID ){
        req.DB_credentials = {
          username:process.env.DB_USERNAME ,
          password:process.env.DB_PASSWORD ,
          // Include other credentials or data as needed
        };
        next();   
      }
      else if (decoded.email == "Gensec_Cultural_Gymkhana@iitbhilai.ac.in" && decoded.payload.iss == 'https://accounts.google.com' && decoded.payload.exp > Date.now() / 1000 && decoded.payload.aud == process.env.GOOGLE_CLIENT_ID ){
        
      
      req.DB_credentials = {
          username:process.env.DB_USERNAME ,
          password:process.env.DB_PASSWORD ,
          // Include other credentials or data as needed
        };
        next();
      }
      else if (decoded.email == "Gensec_Sports_Gymkhana@iitbhilai.ac.in" && decoded.payload.iss == 'https://accounts.google.com' && decoded.payload.exp > Date.now() / 1000 && decoded.payload.aud == process.env.GOOGLE_CLIENT_ID ){
        req.DB_credentials = {
          username:process.env.DB_USERNAME ,
          password:process.env.DB_PASSWORD ,
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