const express = require("express");
const router = express.Router();
const isAuthenticated = require("../middlewares/isAuthenticated");
const authorizeRole = require("../middlewares/authorizeRole");
const { ROLE_GROUPS } = require("../utils/roles");

const positionController = require(
  "../controllers/positionController"
);

// POST for adding a new position (admin roles only)
router.post(
  "/add-position",
  isAuthenticated,
  authorizeRole(ROLE_GROUPS.ADMIN),
  positionController.addPosition
);

// for getting all the position
router.get("/get-all", isAuthenticated, positionController.getAllPositions);


router.post(
  "/add-position-holder",
  isAuthenticated,
  authorizeRole(ROLE_GROUPS.ADMIN),
  positionController.addPositionHolder
);

router.get(
  "/get-all-position-holder",
  isAuthenticated,
  positionController.getAllPositionHolders
);

router.post("/:userId", isAuthenticated, positionController.getPositionHolderByUser);

module.exports = router;
