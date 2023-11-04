const express = require("express");
const router = express.Router();
const  {Student,ScietechPOR,CultPOR,SportsPOR,AcadPOR} = require("../models/student");
const {connectDB, closeDB } = require("../db")
// router.post("/",async (req,res) => {
    
//     try{
//         console.log(req.body);
//         var student_ID = req.body.student_ID;
//         const StudentDetails = await Student.find({ID_No: student_ID});
//         // const studentData = { id: 12140020, name: 'John Doe', program: 'Computer Science' };
//         res.send(studentData);
//         //res.send(StudentDetails);
//     }catch (error) {
//         console.log(error);
//         return res
//           .json({ success: false, message: "internal sever error" });
//       }
// });


  router.post('/fetch', async (req, res) => {
    try {
        await connectDB()
        
        const student = await Student.findOne({ID_No:req.body.student_ID});
        console.log(student);
        const scitechPor = await ScietechPOR.find({student:student});
        const cultPor = await CultPOR.find({student:student});
        const sportPor = await SportsPOR.find({student:student});
        const acadPor= await AcadPOR.find({student:student});
        const PORs = [...scitechPor, ...cultPor, ...sportPor, ...acadPor];
        
        closeDB()
        const st = {
          student:student,
          PORS: PORs
        }

        return res.status(200).json(st);
      } catch (error) {
        console.log(error);
        return res.status(400).json({ success: false, message: "process failed" });
      }
  });





module.exports = router;