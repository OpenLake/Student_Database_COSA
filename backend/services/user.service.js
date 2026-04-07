const PositionHolder = require("../models/positionHolderSchema");
const Position = require("../models/positionSchema");
const User = require("../models/userSchema");
const { HttpError } = require("../utils/httpError");

async function getUserPosition(userId) {
  const positionHolder = await PositionHolder.findOne({ user_id: userId });
  if (!positionHolder) {
    throw new HttpError(403, "You do not hold a valid position in any organization");
  }

  const position = await Position.findById(positionHolder.position_id);
  if (!position) throw new HttpError(403, "Invalid Position");

  return position;
}

async function getApprovers(category) {
  const normalizedCategory = String(category || "").toUpperCase();
  const gensecObj = await User.findOne({ role: `GENSEC_${normalizedCategory}` });
  if (!gensecObj) {
    throw new HttpError(403, "General secretary doesn't exist for the category");
  }

  const gensecPosition = await getUserPosition(gensecObj._id);
  if (gensecPosition.title !== gensecObj.role.toUpperCase()) {
    throw new HttpError(500, "Data inconsistent - General Secretary could not be resolved");
  }

  const presidentObj = await User.findOne({ role: "PRESIDENT" });
  if (!presidentObj) throw new HttpError(403, "President role doesn't exist");

  const presidentPosition = await getUserPosition(presidentObj._id);
  if (presidentPosition.title !== presidentObj.role.toUpperCase()) {
    throw new HttpError(500, "Data inconsistent - President could not be resolved");
  }

  return { gensecObj, presidentObj };
}

module.exports = { 
    getUserPosition,
    getApprovers
}
