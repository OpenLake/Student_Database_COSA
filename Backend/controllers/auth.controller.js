const jwt = require("jsonwebtoken");
const {
  Student,
  ScietechPOR,
  CultPOR,
  SportsPOR,
  AcadPOR,
  Achievement,
} = require("../models/student.model");
const { User } = require("../models/user.model");

const secretKey = process.env.JWT_SECRET_TOKEN;

/**
 * Check authentication status
 * @route GET /api/auth/fetchAuth
 */
exports.getAuthStatus = async (req, res) => {
  if (req.isAuthenticated()) {
    res.json(req.user);
  } else {
    res.status(401).json({ message: "Login Again" });
  }
};

/**
 * Local authentication login
 * @route POST /api/auth/login
 */
exports.login = (req, res) => {
  res.status(200).json({ message: "Login successful", user: req.user });
};

/**
 * Register a new user
 * @route POST /api/auth/register
 */
exports.register = async (req, res) => {
  try {
    const { name, ID, email, password } = req.body;

    const existingUser = await User.findOne({ username: email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists." });
    }

    const newUser = await User.register(
      new User({
        name: name,
        strategy: "local",
        ID_No: ID,
        username: email,
        role: "student",
      }),
      password,
    );

    req.login(newUser, (err) => {
      if (err) {
        console.error(err);
        return res.status(400).json({ message: "Bad request." });
      }
      return res.redirect("/add-profile");
    });
  } catch (error) {
    console.error("Registration error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

/**
 * Google OAuth callback
 * @route GET /api/auth/google/verify
 */
exports.googleCallback = (req, res) => {
  if (!req.user.ID_No) {
    res.redirect("/auth/google/addId");
  } else {
    res.redirect("/");
  }
};

/**
 * Redirect to frontend for adding ID to Google account
 * @route GET /api/auth/google/addId
 */
exports.googleAddId = (req, res) => {
  if (!req.user) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  const token = jwt.sign({ id: req.user._id }, secretKey, { expiresIn: "1h" });
  res.redirect(`${process.env.FRONTEND_URL}/register/google/${token}`);
};

/**
 * Register a Google account with student ID
 * @route POST /api/auth/google/register
 */
exports.googleRegister = async (req, res) => {
  try {
    const { token, ID_No } = req.body;

    if (!token || !ID_No) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    let decoded;
    try {
      decoded = jwt.verify(token, secretKey);
    } catch (error) {
      console.error("Error verifying token:", error);
      return res.status(400).json({ message: "Invalid or expired token" });
    }

    const id = decoded.id;

    // Check if user is authenticated and if token matches current user
    if (!req.isAuthenticated() || id !== req.user.id) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const user = await User.findOneAndUpdate(
      { _id: req.user.id },
      { ID_No: ID_No },
      { new: true },
    );

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Re-login with updated user
    req.login(user, function (err) {
      if (err) {
        console.error("Error serializing user:", err);
        return res.status(400).json({ message: "Error serializing user" });
      }
      return res.status(200).json(user);
    });
  } catch (error) {
    console.error("Error updating user:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

/**
 * Logout the user
 * @route POST /api/auth/logout
 */
exports.logout = (req, res, next) => {
  req.logout(function (err) {
    if (err) {
      return next(err);
    }
    res.send("Logout Successful");
  });
};

/**
 * Update user profile
 * @route POST /api/auth/updateProfile
 */
exports.updateProfile = async (req, res) => {
  try {
    const { userId, updatedDetails } = req.body;
    console.log("Received userId:", userId);
    console.log("Received updatedDetails:", updatedDetails);

    if (!userId || !updatedDetails) {
      return res
        .status(400)
        .json({ success: false, message: "Missing required fields" });
    }

    // Find the student by ID_No
    const student = await Student.findOne({ ID_No: userId });

    if (!student) {
      return res
        .status(404)
        .json({ success: false, message: "Student not found" });
    }

    // Update the student details
    student.name = updatedDetails.name;
    student.Program = updatedDetails.Program;
    student.discipline = updatedDetails.discipline;
    student.add_year = updatedDetails.add_year;

    await student.save();

    return res
      .status(200)
      .json({ success: true, message: "Profile updated successfully" });
  } catch (error) {
    console.error("Error updating profile:", error);
    return res
      .status(500)
      .json({ success: false, message: "Internal server error" });
  }
};

/**
 * Add new POR or Achievement
 * @route POST /api/auth/addRecord
 */
exports.addRecord = async (req, res) => {
  try {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    const { userId, updateType, data } = req.body;

    if (!userId || !updateType || !data) {
      return res
        .status(400)
        .json({ success: false, message: "Missing required fields" });
    }

    // Find the student by ID_No
    const student = await Student.findOne({ ID_No: userId });

    if (!student) {
      return res
        .status(404)
        .json({ success: false, message: "Student not found" });
    }

    if (updateType === "por") {
      // Validate POR data
      if (!data.type || !data.club || !data.designation || !data.session) {
        return res
          .status(400)
          .json({ success: false, message: "Missing POR details" });
      }

      // Create a new POR based on type
      let newPOR;

      switch (data.type) {
        case "AcademicPOR":
          newPOR = new AcadPOR({
            student: student._id,
            club: data.club,
            designation: data.designation,
            session: data.session,
          });
          break;
        case "ScitechPOR":
          newPOR = new ScietechPOR({
            student: student._id,
            club: data.club,
            designation: data.designation,
            session: data.session,
          });
          break;
        case "CulturalPOR":
          newPOR = new CultPOR({
            student: student._id,
            club: data.club,
            designation: data.designation,
            session: data.session,
          });
          break;
        case "SportsPOR":
          newPOR = new SportsPOR({
            student: student._id,
            club: data.club,
            designation: data.designation,
            session: data.session,
          });
          break;
        default:
          return res
            .status(400)
            .json({ success: false, message: "Invalid POR type" });
      }

      await newPOR.save();
    } else if (updateType === "achievement") {
      // Validate achievement data
      if (!data.under || !data.eventName) {
        return res
          .status(400)
          .json({ success: false, message: "Missing achievement details" });
      }

      // Create a new achievement
      const newAchievement = new Achievement({
        student: student._id,
        under: data.under,
        designation: data.designation || "",
        eventName: data.eventName,
        conductedBy: data.conductedBy || "",
      });

      await newAchievement.save();
    } else {
      return res
        .status(400)
        .json({ success: false, message: "Invalid update type" });
    }

    return res
      .status(200)
      .json({ success: true, message: "Record added successfully" });
  } catch (error) {
    console.error("Error adding record:", error);
    return res
      .status(500)
      .json({ success: false, message: "Internal server error" });
  }
};

/**
 * Check president connection
 * @route GET /api/auth
 */
exports.checkConnection = async (req, res) => {
  try {
    return res
      .status(200)
      .json({ success: true, message: "Connected successfully" });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ success: false, message: "Internal Server Error" });
  }
};

/**
 * Add a new student
 * @route POST /api/auth/add
 */
exports.addStudent = async (req, res) => {
  try {
    // Validate required fields
    if (
      !req.body.name ||
      !req.body.ID_No ||
      !req.body.Program ||
      !req.body.discipline
    ) {
      return res
        .status(400)
        .json({ success: false, message: "Missing required fields" });
    }

    // Create a new student
    const student = new Student({
      name: req.body.name,
      ID_No: req.body.ID_No,
      Program: req.body.Program,
      discipline: req.body.discipline,
      pos_res: req.body.pos_res || [],
      add_year: req.body.add_year,
    });
    const pors = req.body.pos_res || [];

    // Save student
    const savedStudent = await student.save();

    // Save PORs
    const porPromises = pors.map(async (element) => {
      let por;

      switch (element.type) {
        case "AcademicPOR":
          por = new AcadPOR({
            student: savedStudent,
            club: element.club,
            designation: element.designation,
            session: element.session,
          });
          break;
        case "CulturalsPOR":
          por = new CultPOR({
            student: savedStudent,
            club: element.club,
            designation: element.designation,
            session: element.session,
          });
          break;
        case "SportsPOR":
          por = new SportsPOR({
            student: savedStudent,
            club: element.club,
            designation: element.designation,
            session: element.session,
          });
          break;
        case "ScitechPOR":
          por = new ScietechPOR({
            student: savedStudent,
            club: element.club,
            designation: element.designation,
            session: element.session,
          });
          break;
        default:
          return null;
      }

      if (por) {
        return por.save();
      }
    });

    await Promise.all(porPromises.filter(Boolean));

    return res
      .status(201)
      .json({ success: true, message: "Student Added Successfully" });
  } catch (error) {
    console.error("Error adding student:", error);
    return res
      .status(400)
      .json({ success: false, message: "Failed to add student" });
  }
};

/**
 * Remove a student
 * @route POST /api/auth/remove
 */
exports.removeStudent = async (req, res) => {
  try {
    if (!req.body.ID_No) {
      return res
        .status(400)
        .json({ success: false, message: "Student ID is required" });
    }

    const student = await Student.findOne({ ID_No: req.body.ID_No });

    if (!student) {
      return res
        .status(404)
        .json({ success: false, message: "Student not found" });
    }

    await Student.findByIdAndDelete(student._id);

    // Optional: Remove related PORs and achievements
    await Promise.all([
      ScietechPOR.deleteMany({ student: student._id }),
      CultPOR.deleteMany({ student: student._id }),
      SportsPOR.deleteMany({ student: student._id }),
      AcadPOR.deleteMany({ student: student._id }),
      Achievement.deleteMany({ student: student._id }),
    ]);

    return res
      .status(200)
      .json({ success: true, message: "Student Deleted Successfully" });
  } catch (error) {
    console.error("Error removing student:", error);
    return res
      .status(400)
      .json({ success: false, message: "Failed to remove student" });
  }
};

/**
 * Update student data
 * @route POST /api/auth/update
 */
exports.updateStudent = async (req, res) => {
  try {
    const { data, editedData } = req.body;

    if (!data || !data.student || !editedData || !editedData.PORS) {
      return res
        .status(400)
        .json({ success: false, message: "Missing required data" });
    }

    const stud = data.student;
    const PORs = editedData.PORS;
    const userRole = req.DB_credentials.User;

    const student = await Student.findById(stud._id).exec();

    if (!student) {
      return res
        .status(404)
        .json({ success: false, message: "Student not found" });
    }

    const validPORTypes = {
      President: ["Scitech-POR", "Cult-POR", "Sport-POR", "Acad-POR"],
      Gensec_Scitech: ["Scitech-POR"],
      Gensec_Cult: ["Cult-POR"],
      Gensec_Sport: ["Sport-POR"],
      Gensec_Acad: ["Acad-POR"],
    };

    // Filter PORs based on user role
    const allowedTypes = validPORTypes[userRole] || [];
    const updatablePORs = PORs.filter((por) => allowedTypes.includes(por.type));

    if (updatablePORs.length === 0) {
      return res.status(403).json({
        success: false,
        message: "You don't have permission to update these POR types",
      });
    }

    // Update PORs
    const updatePromises = updatablePORs.map(async (element) => {
      const porData = {
        student: student,
        club: element.club,
        designation: element.designation,
        session: element.session,
      };

      let model;
      switch (element.type) {
        case "Scitech-POR":
          model = ScietechPOR;
          break;
        case "Cult-POR":
          model = CultPOR;
          break;
        case "Sport-POR":
          model = SportsPOR;
          break;
        case "Acad-POR":
          model = AcadPOR;
          break;
        default:
          return null;
      }

      if (model) {
        return model
          .findByIdAndUpdate(element._id, porData, { new: true, upsert: true })
          .exec();
      }
    });

    await Promise.all(updatePromises.filter(Boolean));

    return res
      .status(200)
      .json({ success: true, message: "Data Updated Successfully" });
  } catch (error) {
    console.error("Error updating data:", error);
    return res
      .status(400)
      .json({ success: false, message: "Failed to update data" });
  }
};
