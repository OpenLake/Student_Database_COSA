// routes/events.js
const express = require("express");
const router = express.Router();
const { Event, User, OrganizationalUnit } = require("../models/schema");
const { v4: uuidv4 } = require("uuid");

// Create a new event
router.post("/create", async (req, res) => {
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
    if (!orgUnit)
      return res.status(400).json({ message: "Invalid organizational unit." });

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
});

// GET all events (or filtered)
router.get("/events", async (req, res) => {
  try {
    const events = await Event.find();
    res.json(events);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error fetching events." });
  }
});

router.get("/units", async (req, res) => {
  try {
    const units = await OrganizationalUnit.find();
    res.json(units);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error fetching organizational units." });
  }
});

router.get("/users", async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error fetching users." });
  }
});

// Add this to your backend
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

module.exports = router;
