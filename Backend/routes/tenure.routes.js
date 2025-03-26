const express = require("express");
const router = express.Router();
const tenureController = require("../controllers/tenure.controller");
const {
  isAuthenticated,
  verifyPresident,
} = require("../middleware/auth.middleware");

// Add a new tenure record
router.post(
  "/",
  isAuthenticated,
  verifyPresident,
  tenureController.createTenure,
);

// Get all tenure records
router.get("/", isAuthenticated, tenureController.getAllTenures);

// Get tenure records for a specific student
router.get("/:studentId", isAuthenticated, tenureController.getStudentTenures);

// Update a tenure record
router.put(
  "/:id",
  isAuthenticated,
  verifyPresident,
  tenureController.updateTenure,
);

// Delete a tenure record
router.delete(
  "/:id",
  isAuthenticated,
  verifyPresident,
  tenureController.deleteTenure,
);

module.exports = router;
