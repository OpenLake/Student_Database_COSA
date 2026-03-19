const User = require("../models/userSchema");
const { CertificateBatch } = require("../models/certificateSchema");
const { validateBatchSchema } = require("../utils/batchValidate");
const { findEvent } = require("../services/event.service");
const { findTemplate } = require("../services/template.service");
const { getUserPosition, getApprovers } = require("../services/user.service");
const { getOrganization } = require("../services/organization.service");
const { HttpError } = require("../utils/httpError");

async function createBatch(req, res) {
  //console.log(req.user);
  try {
    const { id, role } = req.user;

    //to get user club
    // positionHolders({user_id: id}) -> positions({_id: position_id}) -> organizationalUnit({_id: unit_id}) -> unit_id = "Club name"
    const { name, eventId, templateId, signatoryDetails, users, action } =
      req.body;
    const validation = validateBatchSchema.safeParse({
      name,
      eventId,
      templateId,
      signatoryDetails,
      users,
    });

    let lifecycleStatus, approvalStatus;
    if (action === "Submitted") {
      lifecycleStatus = "Submitted";
      approvalStatus = "Pending";
    }

    if (!validation.success) {
      let errors = validation.error.issues.map((issue) => issue.message);
      return res.status(400).json({ message: errors });
    }

    const event = await findEvent(eventId);
    const template = await findTemplate(templateId);

    // Get coordinator's position and unit
    const position = await getUserPosition(id);

    const eventOrgId =
      event.organizing_unit_id && event.organizing_unit_id.toString();
    const positionUnitId = position.unit_id && position.unit_id.toString();

    if (
      eventOrgId !== positionUnitId ||
      role.toUpperCase() !== position.title
    ) {
      return res
        .status(403)
        .json({ message: "You are not authorized to initiate batches." });
    }

    // Ensure org is a Club
    const club = await getOrganization(position.unit_id);
    if (club.type.toLowerCase() !== "club") {
      return res.status(403).json({ message: "Organization is not a Club" });
    }

    // Resolve General Secretary and President objects for the club
    const { gensecObj, presidentObj } = await getApprovers(club.category);
    const approverIds = [gensecObj._id, presidentObj._id];

    // Validate user ids and existence (bulk query + duplicate detection)
    const uniqueUsers = [...new Set(users.map((u) => u.toString()))];
    const duplicates = uniqueUsers.length !== users.length;
    if (duplicates) {
      return res
        .status(400)
        .json({ message: "Duplicate user ids are not allowed in a batch" });
    }

    const existing = await User.find({ _id: { $in: users } })
      .select("_id")
      .lean();
    const existingSet = new Set(existing.map((u) => u._id.toString()));
    const missing = uniqueUsers
      .filter((u) => !existingSet.has(u))
      .map((uid) => ({ uid, ok: false, reason: "User not found" }));

    if (missing.length > 0) {
      return res
        .status(400)
        .json({ message: "Invalid user data sent", details: missing });
    }

    const newBatch = await CertificateBatch.create({
      title: name,
      eventId: event._id,
      templateId: template._id,
      initiatedBy: id,
      approverIds,
      approvalStatus: approvalStatus,
      lifecycleStatus: lifecycleStatus || "Draft",
      users: users,
      signatoryDetails,
    });

    res.json({ message: "New Batch created successfully" });
  } catch (err) {
    if (err instanceof HttpError) {
      const payload = { message: err.message };
      if (err.details) payload.details = err.details;
      return res.status(err.statusCode).json(payload);
    }
    res.status(500).json({ message: err.message || "Internal server error" });
  }
}

async function editBatch(req, res) {
  const { id } = req.user._id;
}

async function getAllBatches(req, res) {
  const batches = await CertificateBatch.find().populate([
    {
      path: "initiatedBy",
      select: "personal_info.name -_id",
    },
    {
      path: "templateId",
      select: "title ",
    },
    {
      path: "eventId",
      select: "title description organizing_unit_id schedule",
      populate: {
        path: "organizing_unit_id",
        select: "name -_id",
      },
    },
  ]);
  if (!batches) {
    return res.status(404).json({ messages: "No batches found" });
  }
  return res.json({ message: batches });
}

module.exports = {
  createBatch,
  editBatch,
  getAllBatches,
};
