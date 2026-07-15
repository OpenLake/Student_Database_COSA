const { Event } = require("../models/schema");
const { HttpError } = require("../utils/httpError");

async function findEvent(id) {
  const event = await Event.findById(id);
  if (!event) throw new HttpError(400, "Selected event doesn't exist");
  return event;
}

async function isEventContact(user, event) {
  const unitEmail = String(
    event.organizing_unit_id?.contact_info?.email || ""
  )
    .trim()
    .toLowerCase();

  const userEmail = String(
    user.username ||
    user.personal_info?.email ||
    ""
  )
    .trim()
    .toLowerCase();

  return unitEmail === userEmail;
}

module.exports = {
    findEvent,
    isEventContact
}