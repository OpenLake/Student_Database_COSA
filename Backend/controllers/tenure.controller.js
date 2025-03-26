const Tenure = require("../models/Tenure");
const { Student } = require("../models/student.model");
const moment = require("moment");

/**
 * Create a new tenure record
 * @route POST /api/tenure
 */
exports.createTenure = async (req, res) => {
  try {
    console.log("Received Data:", req.body);

    let { studentId, role, startDate, endDate, achievements } = req.body;

    if (!studentId || !role || !startDate || !endDate) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    // Convert numeric studentId (roll number) into the correct ObjectId
    const student = await Student.findOne({ ID_No: studentId });

    if (!student) {
      return res.status(404).json({ error: "Student not found" });
    }

    // Create tenure record with the correct student _id
    const newTenure = new Tenure({
      studentId: student._id, // Store the correct ObjectId
      role,
      startDate,
      endDate,
      achievements,
    });

    await newTenure.save();

    console.log("Record Saved:", newTenure);
    res.status(201).json(newTenure);
  } catch (error) {
    console.error("Error in creating tenure:", error);
    res
      .status(500)
      .json({ error: "Failed to add tenure record", details: error.message });
  }
};

/**
 * Get all tenure records
 * @route GET /api/tenure
 */
exports.getAllTenures = async (req, res) => {
  try {
    const records = await Tenure.find()
      .populate({
        path: "studentId",
        select: "name ID_No",
      })
      .select("studentId role startDate endDate achievements");

    const formattedRecords = records.map((record) => ({
      studentName: record.studentId.name || "Unknown",
      studentID: record.studentId.ID_No || "N/A",
      role: record.role,
      tenurePeriod: `${moment(record.startDate).format("DD-MM-YYYY")} - ${moment(record.endDate).format("DD-MM-YYYY")}`,
      achievements: record.achievements || "No achievements listed",
    }));

    res.status(200).json(formattedRecords);
  } catch (error) {
    console.error("Error fetching tenure records:", error);
    res
      .status(500)
      .json({ error: "Failed to fetch records", details: error.message });
  }
};

/**
 * Get tenure records for a specific student
 * @route GET /api/tenure/:studentId
 */
exports.getStudentTenures = async (req, res) => {
  try {
    const records = await Tenure.find({ studentId: req.params.studentId })
      .populate("studentId", "name _id")
      .select("studentId role achievements");
    res.status(200).json(records);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch records" });
  }
};

/**
 * Update a tenure record
 * @route PUT /api/tenure/:id
 */
exports.updateTenure = async (req, res) => {
  try {
    const updatedTenure = await Tenure.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true },
    );
    res.status(200).json(updatedTenure);
  } catch (error) {
    res.status(500).json({ error: "Failed to update record" });
  }
};

/**
 * Delete a tenure record
 * @route DELETE /api/tenure/:id
 */
exports.deleteTenure = async (req, res) => {
  try {
    await Tenure.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "Record deleted" });
  } catch (error) {
    res.status(500).json({ error: "Failed to delete record" });
  }
};
