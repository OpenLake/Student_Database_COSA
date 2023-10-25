const express = require("express");
const router = express.Router();
const Student = require("../models/student");

router.post("/",async (req,res) => {
    
    try{
        console.log(req.body);
        //const StudentDetails = await Student.find({ID_No:student_ID});
        const studentData = { id: 12140020, name: 'John Doe', program: 'Computer Science' };
        res.send(studentData)
        //res.send(StudentDetails);
    }catch (error) {
        console.log(error);
        return res
          .json({ success: false, message: "internal sever error" });
      }
});

module.exports = router;