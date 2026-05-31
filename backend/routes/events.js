const express = require("express");
const router = express.Router();
const { Event, User, OrganizationalUnit } = require("../models/schema");
const { v4: uuidv4 } = require("uuid");
const isAuthenticated = require("../middlewares/isAuthenticated");
const isEventContact = require("../middlewares/isEventContact");
const authorizeRole = require("../middlewares/authorizeRole");
const { ROLE_GROUPS, ROLES } = require("../utils/roles");
const eventsController = require("../controllers/eventControllers");

router.get("/latest", eventsController.getLatestEvents);

// Create a new event (new events can be created by admins only)
router.post(
  "/create",
  isAuthenticated,
  authorizeRole(ROLE_GROUPS.ADMIN),
  eventsController.createEvent);  

// GET all events (for all users: logged in or not logged in)
router.get("/events", eventsController.getAllEvents );

router.get("/units", isAuthenticated, eventsController.getOrganizationalUnits);

router.get("/users", isAuthenticated, eventsController.getUsers);

/**
 * NEW: Endpoint used by frontend to decide conditional rendering.
 * Returns { isContact: true|false } for the logged-in user.
 *
 * Placed before the "/:id" route to avoid route collision.
 */
router.get("/:eventId/is-contact", isAuthenticated, eventsController.isEventContact);

// Register student for an event
router.post(
  "/:eventId/register",
  isAuthenticated,
  authorizeRole(ROLES.STUDENT),
  eventsController.registerForEvent
);

router.get("/by-role/:userRole", isAuthenticated, eventsController.getEventsByRole);

// GET event by ID
router.get("/:id", eventsController.getEventById);

//room request
router.post(
  "/:eventId/room-requests",
  isAuthenticated,
  authorizeRole([...ROLE_GROUPS.GENSECS, ...ROLE_GROUPS.COORDINATORS]),
  eventsController.createRoomRequest
);


router.patch(
  "/room-requests/:requestId/status",
  isAuthenticated,
  authorizeRole("PRESIDENT"),
  eventsController.updateRoomRequestStatus
);

/**
 * OPTIONAL: example protected event update/delete routes that use isEventContact.
 * These show how to protect sensitive operations so that only the unit contact can perform them.
 */

// Update an event (only unit contact)
router.put("/:eventId", isAuthenticated, isEventContact, eventsController.updateEvent);

// Delete an event (only unit contact)
router.delete(
  "/:eventId",
  isAuthenticated,
  isEventContact,
  eventsController.deleteEvent);

module.exports = router;
