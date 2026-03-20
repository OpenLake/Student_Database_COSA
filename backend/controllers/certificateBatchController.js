const User = require("../models/userSchema");
const { CertificateBatch } = require("../models/certificateSchema");
const {
  validateBatchSchema,
  validateBatchUsersIds,
  zodObjectId,
} = require("../utils/batchValidate");
const { findEvent } = require("../services/event.service");
const { findTemplate } = require("../services/template.service");
const { getUserPosition, getApprovers } = require("../services/user.service");
const { getOrganization } = require("../services/organization.service");
const { HttpError } = require("../utils/httpError");

async function createBatch(req, res) {
  //console.log(req.user);
  try {
    const { id, role } = req.user;
    //console.log(req.body);
    //to get user club
    // positionHolders({user_id: id}) -> positions({_id: position_id}) -> organizationalUnit({_id: unit_id}) -> unit_id = "Club name"
    const {
      title,
      eventId,
      templateId,
      signatoryDetails,
      students: users,
      action,
    } = req.body;
    const validation = validateBatchSchema.safeParse({
      title,
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
      title,
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
  try {
    const {
      batchId,
      title,
      eventId,
      templateId,
      signatoryDetails,
      students: users,
      action,
    } = req.body;

    if (!["Submitted", "Draft"].includes(action)) {
      return res.status(400).json({ message: "Invalid action" });
    }

    const validation = validateBatchSchema.safeParse({
      title,
      eventId: eventId._id,
      templateId,
      signatoryDetails,
      users,
    });

    const objectId = zodObjectId.safeParse(batchId);
    console.log(validation);
    let errors = [];
    if (!validation.success) errors.push(...validation.error.issues);
    if (!objectId.success) errors.push(...objectId.error.issues);

    errors = errors.map((issue) => issue.message);
    if (errors.length > 0) return res.status(400).json({ message: errors });

    const batch = await CertificateBatch.findByIdAndUpdate(
      batchId,
      {
        ...validation.data,
        lifecycleStatus: action,
      },
      { new: true },
    );

    if (!batch) {
      return res.status(404).json({ message: "Batch not found" });
    }
    return res.json({ message: "Batch updated successfully" });
  } catch (err) {
    if (err instanceof HttpError) {
      const payload = { message: err.message };
      if (err.details) payload.details = err.details;
      return res.status(err.statusCode).json(payload);
    }
    res.status(500).json({ message: err.message || "Internal server error" });
  }
}

async function getAllBatches(req, res) {
  try {
    const batches = await CertificateBatch.find().populate([
      {
        path: "initiatedBy",
        select: "personal_info.name",
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
  } catch (err) {
    if (err instanceof HttpError) {
      const payload = { message: err.message };
      if (err.details) payload.details = err.details;
      return res.status(err.statusCode).json(payload);
    }
    res.status(500).json({ message: err.message || "Internal server error" });
  }
}

async function getBatchUsers(req, res) {
  try {
    const { userIds } = req.body;
    const validation = validateBatchUsersIds.safeParse(userIds);
    if (!validation.success) {
      let errors = validation.error.issues.map((issue) => issue.message);
      return res.status(400).json({ message: errors });
    }
    const users = await User.find({ _id: { $in: userIds } }).select("");
    const foundIds = users.map((u) => u._id.toString());
    const missingIds = userIds.filter(
      (id) => !foundIds.includes(id.toString()),
    );
    if (missingIds.length > 0) {
      return res
        .status(404)
        .json({ message: `Users not found: ${missingIds.join(", ")}` });
    }
    return res.json({ message: users });
  } catch (err) {
    if (err instanceof HttpError) {
      const payload = { message: err.message };
      if (err.details) payload.details = err.details;
      return res.status(err.statusCode).json(payload);
    }
    res.status(500).json({ message: err.message || "Internal server error" });
  }
}

async function duplicateBatch(req, res) {
  try {
    const { batchId } = req.body;
    const { id } = req.user;

    const objectIdValidation = zodObjectId.safeParse(batchId);
    if (!objectIdValidation.success) {
      return res.status(400).json({ message: "Invalid batch ID" });
    }

    const batch = await CertificateBatch.findById(batchId)
      .lean()
      .select(
        "title eventId templateId initiatedBy approverIds users signatoryDetails -_id",
      );
    if (!batch) {
      return res.status(404).json({ message: "Batch not found" });
    }

    // Check authorization: only the initiator can duplicate
    if (batch.initiatedBy.toString() !== id) {
      return res.status(403).json({
        message: "You are not authorized to duplicate this batch",
      });
    }

    batch.title = `${batch.title} (Copy)`;
    const newBatch = await CertificateBatch.create({
      ...batch,
      lifecycleStatus: "Draft",
    });

    return res.json({ message: "Batch duplicated successfully" });
  } catch (err) {
    if (err instanceof HttpError) {
      const payload = { message: err.message };
      if (err.details) payload.details = err.details;
      return res.status(err.statusCode).json(payload);
    }
    res.status(500).json({ message: err.message || "Internal server error" });
  }
}

async function deleteBatch(req, res) {
  try {
    const { batchId } = req.body;
    const { id } = req.user;

    const objectIdValidation = zodObjectId.safeParse(batchId);
    if (!objectIdValidation.success) {
      return res.status(400).json({ message: "Invalid batch ID" });
    }

    const batch = await CertificateBatch.findOneAndDelete({
      _id: batchId,
      initiatedBy: id,
    });
    if (!batch) {
      return res
        .status(403)
        .json({ message: "Batch not found or unauthorized" });
    }

    return res.json({ message: "Batch deleted successfully" });
  } catch (err) {
    if (err instanceof HttpError) {
      const payload = { message: err.message };
      if (err.details) payload.details = err.details;
      return res.status(err.statusCode).json(payload);
    }
    return res
      .status(500)
      .json({ message: err.message || "Internal server error" });
  }
}

async function archiveBatch(req, res) {
  try {
    const { batchId } = req.body;
    const { id } = req.user;

    const objectIdValidation = zodObjectId.safeParse(batchId);
    if (!objectIdValidation.success) {
      return res.status(400).json({ message: "Invalid batch ID" });
    }

    const batch = await CertificateBatch.findOneAndUpdate(
      { _id: batchId, initiatedBy: id },
      { lifecycleStatus: "Archived" },
      { new: true },
    );
    if (!batch) {
      return res
        .status(403)
        .json({ message: "Batch not found or unauthorized" });
    }

    return res.json({ message: "Batch archived successfully" });
  } catch (err) {
    if (err instanceof HttpError) {
      const payload = { message: err.message };
      if (err.details) payload.details = err.details;
      return res.status(err.statusCode).json(payload);
    }
    return res
      .status(500)
      .json({ message: err.message || "Internal server error" });
  }
}
module.exports = {
  createBatch,
  editBatch,
  getAllBatches,
  getBatchUsers,
  duplicateBatch,
  deleteBatch,
  archiveBatch,
};
