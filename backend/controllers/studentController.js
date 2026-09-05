const { User } = require("../models/schema");

// GET /api/students
// Admin-only: list all students with search, filters and pagination.
exports.getAllStudents = async (req, res) => {
  try {
    const {
      search = "",
      branch,
      batch_year,
      program,
      status,
      page = 1,
      limit = 20,
    } = req.query;

    const filter = { role: "STUDENT" };

    if (branch) filter["academic_info.branch"] = branch;
    if (batch_year) filter["academic_info.batch_year"] = batch_year;
    if (program) filter["academic_info.program"] = program;
    if (status) filter.status = status;

    if (search.trim()) {
      const regex = new RegExp(search.trim(), "i");
      filter.$or = [
        { "personal_info.name": regex },
        { "personal_info.email": regex },
        { username: regex },
        { user_id: regex },
      ];
    }

    const pageNum = Math.max(parseInt(page, 10) || 1, 1);
    const limitNum = Math.min(Math.max(parseInt(limit, 10) || 20, 1), 100);

    const [students, total] = await Promise.all([
      User.find(filter)
        .select("-hash -salt")
        .sort({ "personal_info.name": 1 })
        .skip((pageNum - 1) * limitNum)
        .limit(limitNum),
      User.countDocuments(filter),
    ]);

    return res.status(200).json({
      success: true,
      students,
      pagination: {
        total,
        page: pageNum,
        limit: limitNum,
        totalPages: Math.ceil(total / limitNum) || 1,
      },
    });
  } catch (error) {
    console.error("Error fetching students:", error);
    return res
      .status(500)
      .json({ success: false, message: "Internal server error" });
  }
};

// GET /api/students/:id
// Admin-only: full detail view for a single student.
exports.getStudentById = async (req, res) => {
  try {
    const student = await User.findOne({
      _id: req.params.id,
      role: "STUDENT",
    }).select("-hash -salt");

    if (!student) {
      return res
        .status(404)
        .json({ success: false, message: "Student not found" });
    }

    return res.status(200).json({ success: true, student });
  } catch (error) {
    console.error("Error fetching student:", error);
    return res
      .status(500)
      .json({ success: false, message: "Internal server error" });
  }
};

// GET /api/students/filters/options
exports.getFilterOptions = async (req, res) => {
  try {
    const [branches, batchYears, programs] = await Promise.all([
      User.distinct("academic_info.branch", {
        role: "STUDENT",
        "academic_info.branch": { $nin: [null, ""] },
      }),
      User.distinct("academic_info.batch_year", {
        role: "STUDENT",
        "academic_info.batch_year": { $nin: [null, ""] },
      }),
      User.distinct("academic_info.program", {
        role: "STUDENT",
        "academic_info.program": { $nin: [null, ""] },
      }),
    ]);

    return res.status(200).json({
      success: true,
      filters: {
        branches: branches.sort(),
        batchYears: batchYears.sort(),
        programs: programs.sort(),
        statuses: ["active", "inactive", "graduated"],
      },
    });
  } catch (error) {
    console.error("Error fetching student filter options:", error);
    return res
      .status(500)
      .json({ success: false, message: "Internal server error" });
  }
};