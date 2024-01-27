const express = require("express");
const passport = require("../models/passportConfig");
const router = express.Router();
const { User } = require("../models/student");



// router.post("/login", passport.authenticate("local"), (req, res) => {
//   // If authentication is successful, this function will be called
//   res.status(200).json({ message: "Login successful", user: req.user });
// });


module.exports = router;
