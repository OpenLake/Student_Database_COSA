const express = require("express");
const router = express.Router();
const { body, validationResult } = require("express-validator");
const { exceptionHandler, isAuthenticated } = require("../middlewares");
const {
  Student,
  ScietechPOR,
  CultPOR,
  SportsPOR,
  AcadPOR,
} = require("../models/student");

router.post(
  "/fetch",
  isAuthenticated,
  [body("student_ID").isNumeric().withMessage("Student ID must be a number")],
  exceptionHandler(async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    try {
      const student = await Student.findOne({ ID_No: req.body.student_ID });

      if (!student) {
        return res
          .status(404)
          .json({ success: false, message: "Student not found" });
      }

      const scitechPor = await ScietechPOR.find({ student: student });
      const cultPor = await CultPOR.find({ student: student });
      const sportPor = await SportsPOR.find({ student: student });
      const acadPor = await AcadPOR.find({ student: student });
      const PORs = [...scitechPor, ...cultPor, ...sportPor, ...acadPor];

      const st = {
        student: student,
        PORS: PORs,
      };
      return res.status(200).json(st);
    } catch (error) {
      console.log(error);
      return res
        .status(400)
        .json({ success: false, message: "process failed" });
    }
  }),
);

module.exports = router;
