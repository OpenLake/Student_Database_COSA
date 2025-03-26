const express = require("express");
const router = express.Router();
const eventController = require("../controllers/event.controller");
const {
  isAuthenticated,
  verifyGensec,
} = require("../middleware/auth.middleware");

router.get("/", isAuthenticated, eventController.getAllEvents);
router.post("/", isAuthenticated, verifyGensec, eventController.createEvent);
router.delete(
  "/:id",
  isAuthenticated,
  verifyGensec,
  eventController.deleteEvent,
);
module.exports = router;
