const jwt_decode = require('jwt-decode');
const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const { restrictToPresident } = require("../middlewares");

  router.post('/', function(req, res) {
  const userinfo= req.body;
  email = userinfo.email;
  sub = userinfo.sub;
  // console.log(req.body);


  });
  
  
  router.get('/', restrictToPresident, function(req, res) {
    
    try{
    const jwtToken = req.headers.authorization;
    const user = JSON.parse(req.headers['user-details']);
    const decoded = jwt_decode(jwtToken);
  
    const { username, password } = req.DB_credentials;
    const dbUri = `mongodb+srv://${username}:${password}@cosa-database.xypqv4j.mongodb.net/?retryWrites=true&w=majority`;

// Connect to the database
    mongoose.connect(dbUri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    })
    .then(() => {
    console.log('Connected to MongoDB234');
    })
    .catch((error) => {
    console.error('MongoDB connection error:', error);
    });
    
} catch(error){
  return res
  .json({ success: false, message: "internal sever error" });
}
  }
 ); 


  module.exports = router;

