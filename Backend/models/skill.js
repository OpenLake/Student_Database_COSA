// const mongoose = require("mongoose");
// // import { Student } from "./student";
// const skillSchema = new mongoose.Schema({
//   student: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: "Student", // Reference the 'Student' model
//     required: true,
//   },
//   skillName: {
//     type: String,
//     required: true,
//   },
//   skillType: {
//     type: String,
//     enum: ["tech", "acad", "sport", "cultural"],
//     required: true,
//   },
//   endorsed: {
//     type: Boolean,
//     default: false, // Only GenSec of respective type can set this to true
//   },
// });

// const Skill = mongoose.model("Skill", skillSchema);

// module.exports = { Skill };
