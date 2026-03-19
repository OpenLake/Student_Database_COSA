const Event = require("../models/eventSchema");
const { HttpError } = require("../utils/httpError");

async function findEvent(id) {
  const event = await Event.findById(id);
  if (!event) throw new HttpError(400, "Selected event doesn't exist");
  return event;
}

module.exports = {
    findEvent
}