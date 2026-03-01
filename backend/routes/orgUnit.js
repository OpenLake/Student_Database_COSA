// routes/club.js
const express = require("express");
const router = express.Router();
const isAuthenticated = require("../middlewares/isAuthenticated");
const authorizeRole = require("../middlewares/authorizeRole");
const { ROLE_GROUPS } = require("../utils/roles");
const orgUnitController = require("../controllers/orgUnitController");

router.get("/clubData/:email", isAuthenticated, orgUnitController.getClubData);

// Fetches all units, or filters by category if provided in the query.
router.get("/organizational-units", isAuthenticated, orgUnitController.getAllOrganizationalUnits);

// Create a new organizational unit
router.post(
  "/create",
  isAuthenticated,
  authorizeRole([...ROLE_GROUPS.GENSECS, "PRESIDENT"]),
  orgUnitController.createOrganizationalUnit
);
module.exports = router;
