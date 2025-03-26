const Event = require("../models/event.model");

/**
 * Check for event conflicts
 */
const checkConflict = async (startTime, endTime, gap = 4 * 60 * 60 * 1000) => {
  try {
    const startWithGap = new Date(startTime.getTime() - gap);
    const endWithGap = new Date(endTime.getTime() + gap);
    const conflictingEvents = await Event.find({
      $or: [{ startTime: { $lt: endWithGap }, endTime: { $gt: startWithGap } }],
    });
    return conflictingEvents.length > 0;
  } catch (err) {
    console.error(err);
    return true;
  }
};

/**
 * Get all events
 * @route GET /api/events
 */
exports.getAllEvents = async (req, res) => {
  try {
    const events = await Event.find({ endTime: { $gt: new Date() } });
    res.json(events);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

/**
 * Create event
 * @route POST /api/events
 */
exports.createEvent = async (req, res) => {
  try {
    const { title, startTime, endTime } = req.body;
    if (await checkConflict(new Date(startTime), new Date(endTime))) {
      return res
        .status(400)
        .json({ message: "Event conflicts with an existing event." });
    }
    const event = new Event({ title, startTime, endTime });
    await event.save();
    res.status(201).json(event);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

/**
 * Delete an event
 * @route DELETE /api/events/:id
 */
exports.deleteEvent = async (req, res) => {
  try {
    await Event.findByIdAndDelete(req.params.id);
    res.json({ message: "Event deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
