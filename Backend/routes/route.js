const express = require("express");
const router = express.Router();
const Student = require("../models/student");

router.post("/",async (req,res) => {
    
    try{
        console.log(req.body);
        //const StudentDetails = await Student.find({ID_No:student_ID});
        const studentData = { id: 12140020, name: 'John Doe', program: 'Computer Science' };
        res.send(studentData);
        //res.send(StudentDetails);
    }catch (error) {
        console.log(error);
        return res
          .json({ success: false, message: "internal sever error" });
      }
});

router.post('/add', async (req, res) => {
    try {
        const student = new Student({
          name: req.body.name,
          ID_No: req.body.ID_No,
          Program: req.body.Program,
          discipline: req.body.discipline,
          pos_res: req.body.pos_res,
          add_year: req.body.add_year,
          achievements: req.body.achievements
        });
        await student.save();
        return res
        .status(201)
        .json({ success: true, message: "Student Added Successfully" });
      } catch (error) {
        console.log(error);
        return res.status(400).json({ success: false, message: "process failed" });
      }
  });

  router.get('/fetch', async (req, res) => {
    try {
        const student = await Student.find({ID_No:req.body.ID_No});
        console.log(student);
        return res.status(200).send(student);
      } catch (error) {
        console.log(error);
        return res.status(400).json({ success: false, message: "process failed" });
      }
  });

  router.get('/remove', async (req, res) => {
    try {
      const student = await Student.findOne({ID_No:req.body.ID_No});
      console.log(student._id);
      await Student.findByIdAndDelete((student._id));
        return res.status(200).json({ success: true, message: "Student Deleted Successfully" });
      } catch (error) {
        console.log(error);
        return res.status(400).json({ success: false, message: "process failed" });
      }
  });

  router.get('/update', async (req, res) => {
    try {
      const student = await Student.findOne({ID_No:req.body.ID_No});
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
        return res.status(200).json({ success: true, message: "Data Updated Successfully" });
      } catch (error) {
        console.log(error);
        return res.status(400).json({ success: false, message: "process failed" });
      }
  });

module.exports = router;