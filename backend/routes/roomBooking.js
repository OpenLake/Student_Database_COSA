const express = require("express");
const router = express.Router();
const isAuthenticated = require("../middlewares/isAuthenticated");
const authorizeRole = require("../middlewares/authorizeRole");
const { ROLE_GROUPS } = require("../utils/roles");
const roomBookingController = require("../controllers/roomBookingController");

// Canonical room endpoints
router.post(
  "/",
  isAuthenticated,
  authorizeRole(ROLE_GROUPS.ADMIN),
  roomBookingController.createRoom,
);
router.get("/", isAuthenticated, roomBookingController.getAllRooms);
router.get(
  "/availability",
  isAuthenticated,
  roomBookingController.getAvailability,
);
router.get("/bookings", isAuthenticated, roomBookingController.getBookings);
router.post("/bookings", isAuthenticated, roomBookingController.bookRoom);

// Backward-compatible legacy endpoints
router.post(
  "/create-room",
  isAuthenticated,
  authorizeRole(ROLE_GROUPS.ADMIN),
  roomBookingController.createRoom,
);
router.get("/rooms", isAuthenticated, roomBookingController.getAllRooms);
router.get(
  "/rooms/:room_id",
  isAuthenticated,
  roomBookingController.getRoomById,
);
router.post("/book", isAuthenticated, roomBookingController.bookRoom);

router.get(
  "/:room_id/availability",
  isAuthenticated,
  (req, res, next) => {
    req.query.roomId = req.params.room_id;
    next();
  },
  roomBookingController.getAvailability,
);
router.get("/:room_id", isAuthenticated, roomBookingController.getRoomById);

// Booking review and cancel endpoints
router.patch(
  "/bookings/:id/status",
  isAuthenticated,
  authorizeRole(ROLE_GROUPS.REVIEW_ROLES),
  roomBookingController.updateBookingStatus,
);
router.put(
  "/bookings/:id/status",
  isAuthenticated,
  authorizeRole(ROLE_GROUPS.REVIEW_ROLES),
  roomBookingController.updateBookingStatus,
);
router.delete(
  "/bookings/:id",
  isAuthenticated,
  roomBookingController.cancelBooking,
);

module.exports = router;
