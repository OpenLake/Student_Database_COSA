const express = require("express");
const router = express.Router();

const isAuthenticated = require("../middlewares/isAuthenticated");
const authorizeRole = require("../middlewares/authorizeRole");
const { ROLE_GROUPS } = require("../utils/roles");
const {
  getAllStudents,
  getStudentById,
  getFilterOptions,
} = require("../controllers/studentController");

// GET /api/students/filters/options
router.get(
  "/filters/options",
  isAuthenticated,
  authorizeRole(ROLE_GROUPS.ADMIN),
  getFilterOptions,
);

// GET /api/students?search=&branch=&batch_year=&program=&status=&page=&limit=
router.get(
  "/",
  isAuthenticated,
  authorizeRole(ROLE_GROUPS.ADMIN),
  getAllStudents,
);

// GET /api/students/:id
router.get(
  "/:id",
  isAuthenticated,
  authorizeRole(ROLE_GROUPS.ADMIN),
  getStudentById,
);

module.exports = router;