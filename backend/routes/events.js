const express = require("express");
const router = express.Router();
const isAuthenticated = require("../middlewares/isAuthenticated");
const isEventContact = require("../middlewares/isEventContact");
const authorizeRole = require("../middlewares/authorizeRole");
const { ROLE_GROUPS, ROLES } = require("../utils/roles");
const eventController = require("../controllers/eventController");

router.get("/latest", eventController.getLatestEvents);

// Create a new event (new events can be created by admins only)
router.post(
  "/create",
  isAuthenticated,
  authorizeRole(ROLE_GROUPS.ADMIN),
  eventController.createEvent
);

// GET all events (for all users: logged in or not logged in)
router.get("/events", eventController.getAllEvents);

router.get("/units", isAuthenticated, eventController.getOrganizationalUnits);

router.get("/users", isAuthenticated, eventController.getUsers);

/**
 * NEW: Endpoint used by frontend to decide conditional rendering.
 * Returns { isContact: true|false } for the logged-in user.
 *
 * Placed before the "/:id" route to avoid route collision.
 */
router.get("/:eventId/is-contact", isAuthenticated, eventController.isEventContact);

// Register student for an event
router.post(
  "/:eventId/register",
  isAuthenticated,
  authorizeRole(ROLES.STUDENT),
  eventController.registerForEvent
);

// GET event by ID
router.get("/:id", eventController.getEventById);

router.get("/by-role/:userRole", isAuthenticated, eventController.getEventsByRole);

//room request
router.post(
  "/:eventId/room-requests",
  isAuthenticated,
  authorizeRole([...ROLE_GROUPS.GENSECS, ...ROLE_GROUPS.COORDINATORS]),
  eventController.addRoomRequest
);

router.patch(
  "/room-requests/:requestId/status",
  isAuthenticated,
  authorizeRole("PRESIDENT"),
  eventController.updateRoomRequestStatus
);

/**
 * OPTIONAL: example protected event update/delete routes that use isEventContact.
 * These show how to protect sensitive operations so that only the unit contact can perform them.
 */

// Update an event (only unit contact)
router.put("/:eventId", isAuthenticated, isEventContact, eventController.updateEvent);

// Delete an event (only unit contact)
router.delete(
  "/:eventId",
  isAuthenticated,
  isEventContact,
  eventController.deleteEvent
);

module.exports = router;
