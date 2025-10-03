// backend/middlewares/isEventContact.js
const { Event } = require("../models/schema");

/**
 * Middleware to verify whether the logged-in user is the official contact
 * email of the event's organizing unit.
 *
 * Compares OrganizationalUnit.contact_info.email with req.user.username (primary)
 * or req.user.personal_info.email (fallback). Comparison is case-insensitive.
 */
module.exports = async function isEventContact(req, res, next) {
  try {
    const eventId = req.params.eventId || req.params.id || req.body.eventId;
    if (!eventId) {
      return res.status(400).json({ message: "Missing event id parameter" });
    }

    const event = await Event.findById(eventId).populate("organizing_unit_id");
    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }

    const unit = event.organizing_unit_id;
    // Defensive checks instead of optional chaining for lint/parser compatibility
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

    if (!unitEmail) {
      return res
        .status(404)
        .json({ message: "Organizing unit contact email not found" });
    }

    if (unitEmail && userEmail && unitEmail === userEmail) {
      req.isUnitContact = true; // optional convenience flag
      return next();
    }

    return res.status(403).json({ message: "Forbidden: not the unit contact" });
  } catch (err) {
    console.error("isEventContact error:", err);
    return res.status(500).json({ message: "Server error" });
  }
};
