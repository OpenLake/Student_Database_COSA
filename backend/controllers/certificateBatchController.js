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
const {newBatchSendEmail, batchStatusSendEmail} = require("../services/email.service");
const generateCertificates = require("../services/certificates.service");

async function createBatch(req, res) {
  //console.log(req.user);
  try {
    let emailBatchObj = {};
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

    if(!["Submitted", "Draft"].includes(action)){
      return res.status(400).json({message: "Invalid action"});
    }

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

    const eventOrgId = event.organizing_unit_id && event.organizing_unit_id.toString();
    const positionUnitId = position.unit_id && position.unit_id.toString();

    if (eventOrgId !== positionUnitId || role.toUpperCase() !== position.title ) {
      return res.status(403).json({ message: "You are not authorized to initiate batches." });
    }

    // Ensure org is a Club
    const club = await getOrganization(position.unit_id);
    if (club.type.toLowerCase() !== "club") {
      return res.status(403).json({ message: "Organization is not a Club" });
    }

    // Resolve General Secretary and President objects for the club
    const { gensecObj, presidentObj } = await getApprovers(club.category);
    const approvers = [gensecObj, presidentObj];
   
    const {approverBatchDetails, ccEmails} = approvers.reduce((acc, a)=>{
      const name = a.personal_info.name;
      const email = a.personal_info.email;
      acc.approverBatchDetails.push({name, email});
      acc.ccEmails.push(email);
      return acc;
      
    }, { approverBatchDetails: [], ccEmails: []});
    

    const approverIds = [gensecObj._id, presidentObj._id];

    // Validate user ids and existence (bulk query + duplicate detection)
    const uniqueUsers = [...new Set(users.map((id) => id.toString()))];
    const duplicates = uniqueUsers.length !== users.length;
    if (duplicates) {
      return res
        .status(400)
        .json({ message: "Duplicate user ids are not allowed in a batch" });
    }

    const existing = await User.find({ _id: { $in: users } }).select("_id");
    const existingSet = new Set(existing.map((u) => u._id.toString()));

    const missing = uniqueUsers.filter((u) => !existingSet.has(u));

    if(missing.length > 0){
      missing.map((uid) => ({ uid, ok: false, reason: "User not found" }));
      return res.status(400).json({ message: "Invalid user data sent", details: missing }); 
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
    

    emailBatchObj = {
      title: newBatch.title,
      event: {name: event.title, description: event.description},
      createdBy: req.user.personal_info.name,
      createdAt: new Date(newBatch.createdAt).toLocaleDateString("en-GB").replaceAll("/","-"),
      approverList: approverBatchDetails
    }
  
    const link = process.env.FRONTEND_URL;
    await newBatchSendEmail(req.user.personal_info.email, ccEmails, link, emailBatchObj);
    
    res.json({ message: "New Batch created successfully" });

  } catch (err) {
    console.error(err);
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
    const { id } = req.user;
    const {
      batchId,
      title,
      eventId,
      templateId,
      signatoryDetails,
      students: users,
      action,
    } = req.body;

    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (!["Submitted", "Draft"].includes(action)) {
      return res.status(400).json({ message: "Invalid action" });
    }
    const userIds = users.map((user) => user._id);
    const validation = validateBatchSchema.safeParse({
      title,
      eventId: eventId._id || eventId,
      templateId,
      signatoryDetails,
      users: userIds,
    });

    const objectId = zodObjectId.safeParse(batchId);
    let errors = [];
    if (!validation.success) errors.push(...validation.error.issues);
    if (!objectId.success) errors.push(...objectId.error.issues);

    errors = errors.map((issue) => issue.message);
    if (errors.length > 0) return res.status(400).json({ message: errors });

    const batch = await CertificateBatch.findById(batchId);

    if (!batch) {
      return res.status(404).json({ message: "Batch not found" });
    }

    Object.assign(batch, validation.data);

    if (batchId && action === "Submitted") batch.approvalStatus = "Pending";
    batch.lifecycleStatus = action;
    await batch.save();

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

async function getBatchUsers(req, res) {
  try {
    let { userIds } = req.body;
    const validation = validateBatchUsersIds.safeParse(userIds);

    if (!validation.success) {
      let errors = validation.error.issues.map((issue) => issue.message);
      return res.status(400).json({ message: errors });
    }

    const users = await User.find({ _id: { $in: userIds } }).select("username personal_info academic_info ");
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

    const array = batch.title.split("(Copy)");
    const count = array.length -1;
    const title = `${array[0]} Copy(${count})`;
    const newBatch = await CertificateBatch.create({
      ...batch,
      title: title,
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

async function getUserBatches(req, res) {
  try {
    const id  = req.user._id;
    const userId = req.params.userId;
    let batches;
    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (user.role === "PRESIDENT" || user.role.startsWith("GENSEC")) {
      batches = await CertificateBatch.find({
        approverIds: id,
        lifecycleStatus: { $ne: "Draft" },
      });
    } else {
      if (id.toString() !== userId.toString()) {
        return res.status(403).json({ message: "User is Unauthorized" });
      }
      batches = await CertificateBatch.find({
        initiatedBy: id,
      });
    }

    batches = await CertificateBatch.populate(batches, [
      {
        path: "eventId",
        select: "title organizing_unit_id schedule",
        populate: {
          path: "organizing_unit_id",
          select: "name",
        },
      },
      {
        path: "initiatedBy",
        select: "personal_info",
      },
      {
        path: "users",
        select: "personal_info academic_info",
      },
    ]);
    if (!batches || batches.length === 0) {
      return res
        .status(404)
        .json({ message: "No batches found for this user" });
    }

    return res.json({ message: batches });
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

async function approverEditBatch(req, res) {
  const { id } = req.user;

  const user = await User.findById(id);
  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  if (user.role !== "PRESIDENT" && !user.role.startsWith("GENSEC")) {
    return res.status(403).json({ message: "Access denied" });
  }

  let { users } = req.body;
  const validation = validateBatchUsersIds.safeParse(users);
  if (!validation.success) {
    let errors = validation.error.issues.map((issue) => issue.message);
    return res.status(400).json({ message: errors });
  }

  const { _id } = req.body;
  const batch = await CertificateBatch.findById(_id);
  if (!batch) {
    return res.status(404).json({ message: "Batch not found" });
  }
  batch.users = users;
  await batch.save();

  res.status(200).json({ message: "Batch updated successfully" });
}

async function approveBatch(req, res) {
  try {
    
    const batchId = req.params.batchId;
    const { id } = req.user;

    const validateId = zodObjectId.safeParse(batchId);
    if (!validateId.success) {
      return res.status(400).json({ message: "Invalid batch ID" });
    }

    const batch = await CertificateBatch.findOne({
      _id: batchId,
      approverIds: id,
    }).populate([
      {
        path: "eventId",
        select: "title description"
      },
      {
        path: "initiatedBy",
        select: "personal_info"
      },
      {
        path: "approverIds",
        select: "personal_info"
      }
    ]);

    if (!batch) {
      return res.status(404).json({ message: "Batch not found" });
    }

    const level = batch.currentApprovalLevel;
    if (level === 0) {
      batch.currentApprovalLevel = 1;
      batch.lifecycleStatus = "Submitted";
      batch.approvalStatus = "Pending";
    } else if (level === 1) {
      await generateCertificates(batch);
      batch.currentApprovalLevel = 2;
      batch.lifecycleStatus = "Active";
      batch.approvalStatus = "Approved";
    }
    await batch.save();

    const currentApprover =  batch.approverIds.find((a) => a._id.toString() === id.toString())?.personal_info;
    const {pendingApprovers, ccEmails} = batch.approverIds.reduce(
      (acc, a) => {
        if(a._id.toString() !== id.toString()){
          acc.pendingApprovers.push(a.personal_info);
          acc.ccEmails.push(a.personal_info.email);
        }
        return acc;
      }, 
      { pendingApprovers: [], ccEmails: []}
    );
    const toEmail = currentApprover.email;

    const batchObj = {
      title: batch.title,
      event: {name: batch.eventId.title, description: batch.eventId.description},
      createdBy: batch.initiatedBy.personal_info.name,
      createdAt: new Date(batch.createdAt).toLocaleDateString("en-GB"),
      currentApprover: currentApprover,
      approvalLevel: batch.currentApprovalLevel,
      pendingApprovers: pendingApprovers,
    }

    await batchStatusSendEmail(toEmail, ccEmails, process.env.FRONTEND_URL, batchObj, "approve");

    return res.status(200).json({ message: "Batch approved successfully" });
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

async function rejectBatch(req, res) {
  try {
    const batchId = req.params.batchId;
    const { id } = req.user;

    const validateId = zodObjectId.safeParse(batchId);
    if (!validateId.success) {
      return res.status(400).json({ message: "Invalid batch ID" });
    }

    const batch = await CertificateBatch.findOne({
      _id: batchId,
      approverIds: id,
    });

    if (!batch) {
      return res.status(404).json({ message: "Batch not found" });
    }

    const level = batch.currentApprovalLevel;
    if (level === 0 || level === 1) {
      batch.currentApprovalLevel += 1;
      batch.lifecycleStatus = "Submitted";
      batch.approvalStatus = "Rejected";
    }

    await batch.save();
    const currentApprover =  batch.approverIds.find((a) => a._id.toString() === id.toString())?.personal_info;
    const {ccEmails} = batch.approverIds.reduce(
      (acc, a) => {
        if(a._id.toString() !== id.toString()){
          acc.ccEmails.push(a.personal_info.email);
        }
        return acc;
      }, 
      {ccEmails: []}
    );
    const toEmail = currentApprover.email;

    const batchObj = {
      title: batch.title,
      event: {name: batch.eventId.title, description: batch.eventId.description},
      createdBy: batch.initiatedBy.personal_info.name,
      createdAt: new Date(batch.createdAt).toLocaleDateString("en-GB"),
      currentApprover: currentApprover,
      approvalLevel: batch.currentApprovalLevel,
    }

    await batchStatusSendEmail(toEmail, ccEmails, process.env.FRONTEND_URL, batchObj, "reject");
    return res.status(200).json({ message: "Batch rejected successfully" });
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
  getBatchUsers,
  duplicateBatch,
  deleteBatch,
  archiveBatch,
  getUserBatches,
  approverEditBatch,
  approveBatch,
  rejectBatch,
};
