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
  async (req, res) => {
    try {
      const {
        title,
        description,
        category,
        type,
        organizing_unit_id,
        organizers,
        schedule,
        registration,
        budget,
      } = req.body;

      // Validate organizing unit
      const orgUnit = await OrganizationalUnit.findById(organizing_unit_id);
      if (!orgUnit) {
        return res
          .status(400)
          .json({ message: "Invalid organizational unit." });
      }

      // Optional: Validate organizer IDs
      if (organizers && organizers.length > 0) {
        const validUsers = await User.find({ _id: { $in: organizers } });
        if (validUsers.length !== organizers.length) {
          return res
            .status(400)
            .json({ message: "One or more organizers are invalid." });
        }
      }

      const newEvent = new Event({
        event_id: uuidv4(),
        title,
        description,
        category,
        type,
        organizing_unit_id,
        organizers,
        schedule,
        registration,
        budget,
      });

      await newEvent.save();
      res
        .status(201)
        .json({ message: "Event created successfully", event: newEvent });
      console.log("Event created:", newEvent);
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Server error while creating event." });
    }
  },
);

// GET all events (for all users: logged in or not logged in)
router.get("/events", async (req, res) => {
  try {
    const events = await Event.find().populate("organizing_unit_id", "name");
    res.json(events);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error fetching events." });
  }
});

router.get("/units", isAuthenticated, async (req, res) => {
  try {
    const role = (req.user && req.user.role) || "";
    const userEmail = String(
      (req.user &&
        (req.user.username ||
          (req.user.personal_info && req.user.personal_info.email))) ||
        "",
    )
      .trim()
      .toLowerCase();

    const categoryForRole = {
      [ROLES.GENSEC_SCITECH]: "scitech",
      [ROLES.GENSEC_ACADEMIC]: "academic",
      [ROLES.GENSEC_CULTURAL]: "cultural",
      [ROLES.GENSEC_SPORTS]: "sports",
    };

    let units = [];

    if (role === ROLES.PRESIDENT) {
      // President sees all units
      units = await OrganizationalUnit.find();
    } else if (categoryForRole[role]) {
      // GenSecs see units by category
      units = await OrganizationalUnit.find({
        category: categoryForRole[role],
      });
    } else if (role === ROLES.CLUB_COORDINATOR) {
      // Club Coordinator sees only their own unit (matched by contact email)
      const escapeRegex = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
      const coordUnit = await OrganizationalUnit.findOne({
        "contact_info.email": new RegExp(`^${escapeRegex(userEmail)}$`, "i"),
      });
      units = coordUnit ? [coordUnit] : [];
    } else {
      // Default: return all units (keeps previous behavior for non-admins if needed)
      units = await OrganizationalUnit.find();
    }

    res.json(units);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error fetching organizational units." });
  }
});

router.get("/users", isAuthenticated, async (req, res) => {
  try {
    const users = await User.find({ role: "STUDENT" });
    res.json(users);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error fetching users." });
  }
});

/**
 * NEW: Endpoint used by frontend to decide conditional rendering.
 * Returns { isContact: true|false } for the logged-in user.
 *
 * Placed before the "/:id" route to avoid route collision.
 */
router.get("/:eventId/is-contact", isAuthenticated, async (req, res) => {
  try {
    const { eventId } = req.params;
    const event = await Event.findById(eventId).populate("organizing_unit_id");
    if (!event) return res.status(404).json({ message: "Event not found" });

    // Defensive checks instead of optional chaining for lint/parse compatibility
    const unit = event.organizing_unit_id;
    const unitEmail = String(
      (unit && unit.contact_info && unit.contact_info.email) || "",
    )
      .trim()
      .toLowerCase();

    const userEmail = String(
      (req.user &&
        (req.user.username ||
          (req.user.personal_info && req.user.personal_info.email))) ||
        "",
    )
      .trim()
      .toLowerCase();

    const isContact = !!(unitEmail && userEmail && unitEmail === userEmail);
    return res.json({ isContact });
  } catch (err) {
    console.error("is-contact error:", err);
    return res.status(500).json({ message: "Server error" });
  }
});

// Register student for an event
router.post(
  "/:eventId/register",
  isAuthenticated,
  authorizeRole(ROLES.STUDENT),
  async (req, res) => {
    try {
      const { eventId } = req.params;
      const userId = req.user._id;

      const event = await Event.findById(eventId);
      if (!event) {
        return res.status(404).json({ message: "Event not found." });
      }

      if (event.status === "completed") {
        return res
          .status(400)
          .json({ message: "Registration is closed for this event." });
      }

      if (event.participants.some((p) => p.equals(userId))) {
        return res
          .status(409)
          .json({ message: "You are already registered for this event." });
      }

      if (event.registration && event.registration.required) {
        const now = new Date();

        if (
          event.registration.start &&
          now < new Date(event.registration.start)
        ) {
          return res
            .status(400)
            .json({ message: "Registration has not started yet." });
        }

        if (event.registration.end && now > new Date(event.registration.end)) {
          return res.status(400).json({ message: "Registration has ended." });
        }

        if (
          event.registration.max_participants &&
          event.participants.length >= event.registration.max_participants
        ) {
          return res.status(400).json({ message: "Registration is full." });
        }
      }

      const updatedEvent = await Event.findByIdAndUpdate(
        eventId,
        { $addToSet: { participants: userId } },
        { new: true },
      );

      return res.status(200).json({
        message: "Successfully registered for the event.",
        event: updatedEvent,
      });
    } catch (error) {
      if (error?.name === "CastError") {
       return res.status(400).json({ message: "Invalid event ID format." });
      }
      console.error("Event registration error:", error);
      return res
        .status(500)
        .json({ message: "Server error during registration." });
    }
  },
);

// GET event by ID
router.get("/:id", async (req, res) => {
  try {
    const event = await Event.findById(req.params.id)
      .populate("organizing_unit_id", "name")
      .populate("organizers", "personal_info.name");
    res.json(event);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error fetching event." });
  }
});

router.get("/by-role/:userRole", isAuthenticated, async (req, res) => {
  const userRole = req.params.userRole;
  try {
    let query = {};

    // Build the query based on the user's role
    switch (userRole) {
      case "STUDENT":
        query = { status: { $in: ["planned", "ongoing"] } };
        break;

      case "CLUB_COORDINATOR": {
        const username = req.query.username;
        if (!username) {
          return res
            .status(400)
            .json({ message: "Username is required for Club Coordinator." });
        }
        // 1. Find the organizational unit where the contact email matches the username
        const orgUnit = await OrganizationalUnit.findOne({
          "contact_info.email": username,
        });

        if (!orgUnit) {
          return res.status(404).json({
            message: "No organizational unit found for this coordinator.",
          });
        }
        // 2. Set the query to filter events by the unit's _id
        query = { organizing_unit_id: orgUnit._id };
        break;
      }
      case "GENSEC_SCITECH":
        query = { category: "technical" };
        break;

      case "GENSEC_ACADEMIC":
        query = { category: "academic" };
        break;

      case "GENSEC_CULTURAL":
        query = { category: "cultural" };
        break;

      case "GENSEC_SPORTS":
        query = { category: "sports" };
        break;

      case "PRESIDENT":
        query = {};
        break;

      default:
        query = { status: { $in: ["planned", "ongoing"] } };
        break;
    }

    const events = await Event.find(query)
      .sort({ "schedule.start": 1 })
      .populate("organizing_unit_id")
      .populate("organizers")
      .populate("participants")
      .populate("winners.user")
      .populate("room_requests.reviewed_by");

    res.status(200).json(events);
  } catch (error) {
    console.error("Error fetching events:", error);
    res.status(500).json({ message: "Server error while fetching events" });
  }
});

//room request
router.post(
  "/:eventId/room-requests",
  isAuthenticated,
  authorizeRole([...ROLE_GROUPS.GENSECS, ...ROLE_GROUPS.COORDINATORS]),
  async (req, res) => {
    try {
      const { eventId } = req.params;
      const { date, time, room, description } = req.body;
      if (!date || !time || !room) {
        return res
          .status(400)
          .json({ message: "Date, time, and room are required fields." });
      }
      const event = await Event.findById(eventId);

      if (!event) {
        return res.status(404).json({ message: "Event not found." });
      }
      const newRoomRequest = {
        date,
        time,
        room,
        description: description || "",
      };

      event.room_requests.push(newRoomRequest);
      const updatedEvent = await event.save();
      res.status(201).json(updatedEvent);
    } catch (error) {
      console.error("Error adding room request:", error);
      if (error.name === "CastError") {
        return res.status(400).json({ message: "Invalid event ID format." });
      }
      res
        .status(500)
        .json({ message: "Server error while adding room request." });
    }
  },
);

router.patch(
  "/room-requests/:requestId/status",
  isAuthenticated,
  authorizeRole("PRESIDENT"),
  async (req, res) => {
    const { requestId } = req.params;
    const { status, reviewed_by } = req.body;
    if (!status || !["Approved", "Rejected"].includes(status)) {
      return res.status(400).json({
        message: 'A valid status ("Approved" or "Rejected") is required.',
      });
    }
    try {
      const event = await Event.findOne({ "room_requests._id": requestId });
      if (!event) {
        return res
          .status(404)
          .json({ message: "Request or associated event not found." });
      }
      const request = event.room_requests.id(requestId);
      if (request) {
        request.status = status;
        request.requested_at = new Date();
        request.reviewed_by = reviewed_by;
      }

      const updatedEvent = await event.save();
      res.status(200).json(updatedEvent);
    } catch (error) {
      console.error(`Error updating request status to ${status}:`, error);
      res
        .status(500)
        .json({ message: "Server error while updating request status." });
    }
  },
);

/**
 * OPTIONAL: example protected event update/delete routes that use isEventContact.
 * These show how to protect sensitive operations so that only the unit contact can perform them.
 */

// Update an event (only unit contact)
router.put("/:eventId", isAuthenticated, isEventContact, async (req, res) => {
  try {
    const { eventId } = req.params;
    const updates = req.body;

    // 🔍 DEBUG LOGS - START
    console.log("\n=== 📝 UPDATE EVENT DEBUG ===");
    console.log("Event ID:", eventId);
    console.log(
      "Updates received (full body):",
      JSON.stringify(updates, null, 2),
    );
    console.log("Number of fields to update:", Object.keys(updates).length);
    console.log("Fields being updated:", Object.keys(updates));
    console.log("========================\n");

    // Fetch the event BEFORE update to compare
    const eventBefore = await Event.findById(eventId);
    console.log("Event BEFORE update:", JSON.stringify(eventBefore, null, 2));

    const event = await Event.findByIdAndUpdate(eventId, updates, {
      new: true,
      runValidators: true, // Added this to ensure validation runs
    });

    console.log("\n=== ✅ UPDATE RESULT ===");
    console.log("Event AFTER update:", JSON.stringify(event, null, 2));
    console.log("Update successful:", !!event);
    console.log("========================\n");

    if (!event) return res.status(404).json({ message: "Event not found" });
    return res.json({ message: "Event updated", event });
  } catch (err) {
    console.error("❌ update event error:", err);
    return res
      .status(500)
      .json({ message: "Server error", error: err.message });
  }
});

// Delete an event (only unit contact)
router.delete(
  "/:eventId",
  isAuthenticated,
  isEventContact,
  async (req, res) => {
    try {
      const { eventId } = req.params;
      const deleted = await Event.findByIdAndDelete(eventId);
      if (!deleted) return res.status(404).json({ message: "Event not found" });
      return res.json({ message: "Event deleted" });
    } catch (err) {
      console.error("delete event error:", err);
      return res.status(500).json({ message: "Server error" });
    }
  },
);

module.exports = router;
