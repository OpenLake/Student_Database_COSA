const express = require("express");
const router = express.Router();
const isAuthenticated = require("../middlewares/isAuthenticated");
const positionController = require("../controllers/positionController");

// POST for adding a new position
router.post("/add-position", isAuthenticated, positionController.addPosition);

// for getting all the position
router.get("/get-all", isAuthenticated, positionController.getAllPositions);

//add position holder

router.post(
  "/add-position-holder",
  isAuthenticated,
  positionController.addPositionHolder
);

// Get all position holders
router.get(
  "/get-all-position-holder",
  isAuthenticated,
  positionController.getAllPositionHolders
);

// Get positions  by id
router.get("/:userId", isAuthenticated, positionController.getPositionHoldersByUserId);

module.exports = router;
