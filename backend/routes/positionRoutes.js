const express = require("express");
const router = express.Router();
const isAuthenticated = require("../middlewares/isAuthenticated");

const positionController = require(
  "../controllers/positionController"
);

// POST for adding a new position
router.post("/add-position", isAuthenticated, positionController.addPosition);

// for getting all the position
router.get("/get-all", isAuthenticated, positionController.getAllPositions);


router.post(
  "/add-position-holder",
  isAuthenticated,
  positionController.addPositionHolder
);

router.get(
  "/get-all-position-holder",
  isAuthenticated,
  positionController.getAllPositionHolders
);

router.post("/:userId", isAuthenticated, positionController.getPositionHolderByUser);

module.exports = router;
