const jwt_decode = require('jwt-decode');
const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const { restrictToPresident, restrictToAdmin } = require("../middlewares");
const Student = require("../models/student");


router.get('/', restrictToPresident, function(req, res) {
    
    try{
    const jwtToken = req.headers.authorization;
    const user = JSON.parse(req.headers['user-details']);
    const decoded = jwt_decode(jwtToken);
 
    const { username, password } = req.DB_credentials;
    const dbUri = `mongodb+srv://${username}:${password}@cosa-database.xypqv4j.mongodb.net/?retryWrites=true&w=majority`;
    mongoose.connect(dbUri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    })
    .then(async () => {
    console.log('Connected to MongoDB234');
    console.log("done");
    return res
    .status(201)
    .json({ success: true, message: "Student Added Successfully" });
    })
    .catch((error) => {
    console.error('MongoDB connection error:', error);
    })
    
} catch(error){
  return res
  .json({ success: false, message: "internal sever error" });
}
  }
 ); 

 
 router.post('/add', restrictToPresident, async (req, res) => {

  try {
    const jwtToken = req.headers.authorization;
    const user = JSON.parse(req.headers['user-details']);
    const decoded = jwt_decode(jwtToken);
    const { username, password } = req.DB_credentials;
      const student = new Student({
        name: req.body.name,
        ID_No: req.body.ID_No,
        Program: req.body.Program,
        discipline: req.body.discipline,
        pos_res: req.body.pos_res,
        add_year: req.body.add_year,
        achievements: req.body.achievements
      });
      const dbUri = `mongodb+srv://${username}:${password}@cosa-database.xypqv4j.mongodb.net/?retryWrites=true&w=majority`;
      mongoose.connect(dbUri, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        })
        .then(async () => {
        
        await student.save();
        mongoose.connection.close();
        console.log('MongoDB connection closed');
          return res
          .status(201)
          .json({ success: true, message: "Student Added Successfully" })
        
        })
        .catch((error) => {
        console.error('MongoDB connection error:', error);
        })
    } catch (error) {
      console.log(error);
      return res.status(400).json({ success: false, message: "process failed" });
    }
});


router.post('/remove', restrictToPresident, async (req, res) => {
  try {
    
    const jwtToken = req.headers.authorization;
    const user = JSON.parse(req.headers['user-details']);
    const decoded = jwt_decode(jwtToken);
 
    const { username, password } = req.DB_credentials;

    const dbUri = `mongodb+srv://${username}:${password}@cosa-database.xypqv4j.mongodb.net/?retryWrites=true&w=majority`;
    mongoose.connect(dbUri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      })
      .then(async() => {
      console.log('Connected to MongoDB234');
      const student = await Student.findOne({ID_No:req.body.ID_No});
      await Student.findByIdAndDelete((student._id));
      mongoose.connection.close();
      return res.status(200).json({ success: true, message: "Student Deleted Successfully" });
      })
      .catch((error) => {
      console.error('MongoDB connection error:', error);
      });
    } catch (error) {
      console.log(error);
      return res.status(400).json({ success: false, message: "process failed" });
    }
});


router.post('/update', restrictToAdmin, async (req, res) => {
  try {

    const jwtToken = req.headers.authorization;
    const user = JSON.parse(req.headers['user-details']);
    const decoded = jwt_decode(jwtToken);
    const student = await Student.findOne({ID_No:req.body.ID_No});
    const { username, password } = req.DB_credentials;

    const dbUri = `mongodb+srv://${username}:${password}@cosa-database.xypqv4j.mongodb.net/?retryWrites=true&w=majority`;
    mongoose.connect(dbUri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      }).then(async() => {
        
        console.log(student._id);
        await Student.findByIdAndUpdate(student._id , {
          name: req.body.name,
          ID_No: req.body.ID_No,
          Program: req.body.Program,
          discipline: req.body.discipline,
          pos_res: req.body.pos_res,
          add_year: req.body.add_year,
          achievements: req.body.achievements
        });
          mongoose.connection.close();
          return res.status(200).json({ success: true, message: "Data Updated Successfully" });
      })
      .catch((error) => {
        console.error('MongoDB connection error:', error);
        });


   
    } catch (error) {
      console.log(error);
      return res.status(400).json({ success: false, message: "process failed" });
    }
});


  module.exports = router;

