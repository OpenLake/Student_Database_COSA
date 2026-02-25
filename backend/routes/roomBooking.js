const express = require('express');
const router = express.Router();
const isAuthenticated = require('../middlewares/isAuthenticated');
const authorizeRole = require('../middlewares/authorizeRole');
const { ROLE_GROUPS, ROLES } = require('../utils/roles');
const roomBookingController = require('../controllers/roomBookingController');

// Create a new room (admin only)
router.post('/create-room', isAuthenticated, authorizeRole(ROLE_GROUPS.ADMIN), roomBookingController.createRoom);

// Get all rooms
router.get('/rooms', isAuthenticated, roomBookingController.getAllRooms);

// Book a room (admin only)
router.post('/book', isAuthenticated, authorizeRole(ROLE_GROUPS.ADMIN), roomBookingController.bookRoom);

// Get room availability
router.get('/availability', isAuthenticated, roomBookingController.getAvailability);

// Get bookings (filterable)
router.get('/bookings', isAuthenticated, roomBookingController.getBookings);

// Update booking status (approve/reject)
router.put('/bookings/:id/status', isAuthenticated, authorizeRole([
  ROLES.PRESIDENT,
  ROLES.GENSEC_SCITECH,
  ROLES.GENSEC_ACADEMIC,
  ROLES.GENSEC_CULTURAL,
  ROLES.GENSEC_SPORTS,
]), roomBookingController.updateBookingStatus);

// Cancel a booking
router.delete('/bookings/:id', isAuthenticated, roomBookingController.cancelBooking);

module.exports = router;
