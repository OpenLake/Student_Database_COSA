const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const { body, validationResult } = require("express-validator");
const jwt = require("jsonwebtoken");
const secretKey = process.env.JWT_SECRET_TOKEN;

const {
  restrictToPresident,
  restrictToAdmin,
  exceptionHandler,
  isAuthenticated,
} = require("../middlewares");
const {
  Student,
  ScietechPOR,
  CultPOR,
  SportsPOR,
  AcadPOR,
  User,
} = require("../models/student");
const passport = require("../models/passportConfig");

// Session Status
router.get(
  "/fetchAuth",
  exceptionHandler(function (req, res) {
    if (req.isAuthenticated()) {
      res.json(req.user);
    } else {
      res.json(null);
    }
  }),
);

// Local Authentication
router.post(
  "/login",
  [
    body("email").notEmpty().withMessage("Username is required"),
    body("password").notEmpty().withMessage("Password is required"),
  ],
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  },
  passport.authenticate("local"),
  exceptionHandler((req, res) => {
    res.status(200).json({
      message: "Login successful",
      user: {
        name: req.user.name,
        strategy: req.user.strategy,
        ID_No: req.user.ID_No,
        username: req.user.username,
      },
    });
  }),
);

router.post(
  "/register",
  [
    body("name").notEmpty().withMessage("Name is required"),
    body("ID").isNumeric().withMessage("ID must be a number"),
    body("email").isEmail().withMessage("Email is not valid"),
  ],
  exceptionHandler(async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { name, ID, email, password } = req.body;

    const existingUser = await User.findOne({ username: email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists." });
    }

    const newUser = await User.register(
      new User({ name: name, strategy: "local", ID_No: ID, username: email }),
      password,
    );
    req.login(newUser, (err) => {
      if (err) {
        console.error(err);
        return res.status(400).json({ message: "Bad request." });
      }
      return res.status(200).json({
        message: "Registration successful",
        user: {
          name: newUser.name,
          strategy: newUser.strategy,
          ID_No: newUser.ID_No,
          username: newUser.username,
        },
      });
    });
  }),
);

// Google OAuth Authentication
router.get(
  "/google",
  passport.authenticate("google", { scope: ["profile", "email"] }),
);

router.get(
  "/google/verify",
  passport.authenticate("google", { failureRedirect: "/" }),
  exceptionHandler((req, res) => {
    if (!req.user.ID_No) {
      res.redirect("/auth/google/addId");
    } else {
      res.redirect("/");
    }
  }),
);

router.get(
  "/google/addId",
  exceptionHandler((req, res) => {
    const token = jwt.sign({ id: req.user._id }, secretKey);

    res.redirect(`${process.env.FRONTEND_URL}/register/google/${token}`);
  }),
);

router.post(
  "/google/register",
  [body("token").trim().escape(), body("ID_No").trim().escape()],
  exceptionHandler(async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { token, ID_No } = req.body;

    let decoded;
    try {
      decoded = jwt.verify(token, secretKey);
    } catch (error) {
      console.error("Error verifying token:", error);
      return res.status(400).json({ message: "Invalid token" });
    }

    const id = decoded.id;

    if (id == req.user.id) {
      try {
        const user = await User.findOneAndUpdate(
          { _id: req.user.id },
          { ID_No: ID_No },
          { new: true },
        );

        if (!user) {
          return res.status(404).json({ message: "User not found" });
        }

        // Serialize the updated user into the session
        req.login(user, function (err) {
          if (err) {
            console.error("Error serializing user:", err);
            return res.status(400).json({ message: "Error serializing user" });
          }
        });
        res.status(200).json({
          name: user.name,
          strategy: user.strategy,
          ID_No: user.ID_No,
          username: user.username,
        });
      } catch (error) {
        console.error("Error updating user:", error);
        res.status(400).json({ message: "Error updating user" });
      }
    } else {
      res.status(401).send("Unauthorized");
    }
  }),
);

router.post("/logout", (req, res, next) => {
  req.logout(function (err) {
    if (err) {
      return next(err);
    }
    res.send("Logout Successful");
  });
});

module.exports = router;

router.get("/", restrictToPresident, function (req, res) {
  try {
    // const jwtToken = req.cookies.credentials;
    // const user = JSON.parse(req.headers['user-details']);
    // const decoded = jwt_decode(jwtToken);

    const { username, password } = req.DB_credentials;
    const dbUri = `mongodb+srv://${username}:${password}@cosa-database.xypqv4j.mongodb.net/?retryWrites=true&w=majority`;
    mongoose
      .connect(dbUri, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      })
      .then(async () => {
        console.log("Connected to MongoDB234");
        console.log("done");
        return res
          .status(201)
          .json({ success: true, message: "Student Added Successfully" });
      })
      .catch((error) => {
        console.error("MongoDB connection error:", error);
        return res
          .status(500)
          .json({ success: false, message: "MongoDB connection error" });
      });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ success: false, message: "Internal Server Error" });
  }
});

router.post(
  "/add",
  isAuthenticated,
  [
    body("name")
      .isString()
      .withMessage("Name must be a string")
      .trim()
      .escape(),
    body("ID_No")
      .isNumeric()
      .withMessage("ID_No must be a number")
      .trim()
      .escape(),
    body("Program").trim().escape(),
    body("discipline").trim().escape(),
    body("pos_res").trim().escape(),
    body("add_year")
      .isInt({ gt: 2016 })
      .withMessage("add_year must be greater than 2016")
      .trim()
      .escape(),
  ],
  exceptionHandler(async (req, res) => {
    try {
      // const jwtToken = req.cookies.credentials;
      // const user = JSON.parse(req.headers['user-details']);
      // const decoded = jwt_decode(jwtToken);

      // in production DB_credentials will be stored as environment variable instead of in the request
      // const { username, password } = req.DB_credentials;
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const student = new Student({
        name: req.body.name,
        ID_No: req.body.ID_No,
        Program: req.body.Program,
        discipline: req.body.discipline,
        pos_res: req.body.pos_res,
        add_year: req.body.add_year,
      });
      const pors = req.body.pos_res;

      // using local db for testing, in production
      const dbUri = `mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@cosa-database.xypqv4j.mongodb.net/?retryWrites=true&w=majority`;
      mongoose
        .connect(dbUri, {
          useNewUrlParser: true,
          useUnifiedTopology: true,
        })
        .then(async () => {
          const st = await student.save();
          pors.forEach((element) => {
            if (element.type == "AcademicPOR") {
              const acad_por = new AcadPOR({
                student: st,
                club: element.club,
                designation: element.designation,
                session: element.session,
              });
              acad_por.save();
            }
            if (element.type == "CulturalsPOR") {
              const cult_por = new CultPOR({
                student: st,
                club: element.club,
                designation: element.designation,
                session: element.session,
              });
              cult_por.save();
            }
            if (element.type == "SportsPOR") {
              const sport_por = new SportsPOR({
                student: st,
                club: element.club,
                designation: element.designation,
                session: element.session,
              });
              sport_por.save();
            }
            if (element.type == "ScitechPOR") {
              const scitech_por = new ScietechPOR({
                student: st,
                club: element.club,
                designation: element.designation,
                session: element.session,
              });

              scitech_por.save();
              console.log(scitech_por);
            }
          });
          // mongoose.connection.close();
          // console.log("MongoDB connection closed");
          return res
            .status(201)
            .json({ success: true, message: "Student Added Successfully" });
        })
        .catch((error) => {
          console.error("MongoDB connection error:", error);
        });
    } catch (error) {
      console.log(error);
      return res
        .status(400)
        .json({ success: false, message: "process failed" });
    }
  }),
);

router.post(
  "/remove",
  isAuthenticated,
  restrictToPresident,
  exceptionHandler(async (req, res) => {
    try {
      // const jwtToken = req.cookies.credentials;
      // const user = JSON.parse(req.headers['user-details']);
      // const decoded = jwt_decode(jwtToken);

      // const { username, password } = req.DB_credentials;

      const dbUri = `mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@cosa-database.xypqv4j.mongodb.net/?retryWrites=true&w=majority`;
      mongoose
        .connect(dbUri, {
          useNewUrlParser: true,
          useUnifiedTopology: true,
        })
        .then(async () => {
          console.log("Connected to MongoDB234");
          const student = await Student.findOne({ ID_No: req.body.ID_No });
          await Student.findByIdAndDelete(student._id);
          // mongoose.connection.close();
          return res
            .status(200)
            .json({ success: true, message: "Student Deleted Successfully" });
        })
        .catch((error) => {
          console.error("MongoDB connection error:", error);
        });
    } catch (error) {
      console.log(error);
      return res
        .status(400)
        .json({ success: false, message: "process failed" });
    }
  }),
);

router.post(
  "/update",
  isAuthenticated,
  restrictToAdmin,
  exceptionHandler(async (req, res) => {
    try {
      // const decoded = req.decoded;

      // const { username, password, User } = req.DB_credentials;
      const data = req.body.data;
      const stud = data.student;
      const PORs = req.body.editedData.PORS;

      console.log(PORs);
      const dbUri = `mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@cosa-database.xypqv4j.mongodb.net/?retryWrites=true&w=majority`;
      await mongoose
        .connect(dbUri, {
          useNewUrlParser: true,
          useUnifiedTopology: true,
        })
        .then(async () => {
          const student = await Student.findById(stud._id).exec();
          console.log(student);
          if (User == "President") {
            for (const element of PORs) {
              if (element.type == "Scitech-POR") {
                await ScietechPOR.findByIdAndUpdate(
                  element._id,
                  {
                    student: student,
                    club: element.club,
                    designation: element.designation,
                    session: element.session,
                  },
                  { new: true, upsert: true },
                ).exec();
              } else if (element.type == "Cult-POR") {
                await CultPOR.findByIdAndUpdate(
                  element._id,
                  {
                    student: student,
                    club: element.club,
                    designation: element.designation,
                    session: element.session,
                  },
                  { new: true, upsert: true },
                ).exec();
              } else if (element.type == "Sport-POR") {
                await SportsPOR.findByIdAndUpdate(
                  element._id,
                  {
                    student: student,
                    club: element.club,
                    designation: element.designation,
                    session: element.session,
                  },
                  { new: true, upsert: true },
                ).exec();
              } else if (element.type == "Acad-POR") {
                await AcadPOR.findByIdAndUpdate(
                  element._id,
                  {
                    student: student,
                    club: element.club,
                    designation: element.designation,
                    session: element.session,
                  },
                  { new: true, upsert: true },
                ).exec();
              }
            }
          }
          if (User == "Gensec_Scitech") {
            for (const element of PORs) {
              if (element.type == "Scitech-POR") {
                await ScietechPOR.findByIdAndUpdate(
                  element._id,
                  {
                    student: student,
                    club: element.club,
                    designation: element.designation,
                    session: element.session,
                  },
                  { new: true, upsert: true },
                ).exec();
              }
            }
          }
          if (User == "Gensec_Cult") {
            for (const element of PORs) {
              if (element.type == "Cult-POR") {
                await CultPOR.findByIdAndUpdate(
                  element._id,
                  {
                    student: student,
                    club: element.club,
                    designation: element.designation,
                    session: element.session,
                  },
                  { new: true, upsert: true },
                ).exec();
              }
            }
          }
          if (User == "Gensec_Sport") {
            for (const element of PORs) {
              await SportsPOR.findByIdAndUpdate(
                element._id,
                {
                  student: student,
                  club: element.club,
                  designation: element.designation,
                  session: element.session,
                },
                { new: true, upsert: true },
              ).exec();
            }
          }
          if (User == "Gensec_Acad") {
            for (const element of PORs) {
              if (element.type == "Acad-POR") {
                await AcadPOR.findByIdAndUpdate(
                  element._id,
                  {
                    student: student,
                    club: element.club,
                    designation: element.designation,
                    session: element.session,
                  },
                  { new: true, upsert: true },
                ).exec();
              }
            }
          }
          // await mongoose.connection.close();
          return res
            .status(200)
            .json({ success: true, message: "Data Updated Successfully" });
        })
        .catch((error) => {
          console.error("MongoDB connection error:", error);
        });
    } catch (error) {
      console.log(error);
      return res
        .status(400)
        .json({ success: false, message: "process failed" });
    }
  }),
);

module.exports = router;
