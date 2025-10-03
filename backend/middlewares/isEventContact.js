// backend/middlewares/isEventContact.js
const { Event } = require("../models/schema");

module.exports = async function isEventContact(req, res, next) {
  console.log("🚀 isEventContact MIDDLEWARE CALLED");
  console.log("req.params:", req.params);
  console.log("req.user:", req.user);

  try {
    const eventId = req.params.eventId || req.params.id || req.body.eventId;
    console.log("Extracted eventId:", eventId);

    if (!eventId) {
      console.log("❌ No eventId found");
      return res.status(400).json({ message: "Missing event id parameter" });
    }

    const event = await Event.findById(eventId).populate("organizing_unit_id");
    console.log("Event found:", event ? "YES" : "NO");

    if (!event) {
      console.log("❌ Event not found in database");
      return res.status(404).json({ message: "Event not found" });
    }

    const unit = event.organizing_unit_id;
    console.log("Unit populated:", unit);

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

    console.log("=== EMAIL COMPARISON ===");
    console.log("Unit Email:", unitEmail);
    console.log("User Email:", userEmail);
    console.log("Match:", unitEmail === userEmail);
    console.log("========================");

    if (!unitEmail) {
      console.log("❌ No unit email found");
      return res
        .status(404)
        .json({ message: "Organizing unit contact email not found" });
    }

    if (unitEmail && userEmail && unitEmail === userEmail) {
      console.log("✅ Access granted - user is unit contact");
      req.isUnitContact = true;
      return next();
    }

    console.log("❌ Access denied - user is NOT unit contact");
    return res.status(403).json({ message: "Forbidden: not the unit contact" });
  } catch (err) {
    console.error("❌ isEventContact error:", err);
    return res.status(500).json({ message: "Server error" });
  }
};
