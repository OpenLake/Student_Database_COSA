const express = require("express");
const router = express.Router();
const {
  getAllRoomRequests,
  submitRoomRequest,
  updateRoomRequestStatus,
} = require("../controllers/room.controller");
const {
  verifyPresident,
  isAuthenticated,
  verifyGensec,
} = require("../middleware/auth.middleware");

router.get("/requests", isAuthenticated, getAllRoomRequests);
router.post("/request", isAuthenticated, verifyGensec, submitRoomRequest);
router.put(
  "/request/:id/status",
  isAuthenticated,
  verifyPresident,
  updateRoomRequestStatus,
);
module.exports = router;
