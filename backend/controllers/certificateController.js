const {
  User,
  PositionHolder,
  Position,
  OrganizationalUnit,
} = require("../models/schema");
const { CertificateBatch } = require("../models/certificateSchema");
const { validateBatchSchema, zodObjectId } = require("../utils/batchValidate");

async function createBatch(req, res) {
  //console.log(req.user);

  /*
  Get the id of user trying to initiate the request
  and ensure if the person is of right authority
  */
  const id = req.user.id;
  const user = await User.findById(id);
  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }
  if (!user.role || user.role.toUpperCase() !== "CLUB_COORDINATOR") {
    return res
      .status(403)
      .json({ message: "Not authorized to perform the task" });
  }

  //to get user club
  /*

   positionHolders({user_id: id}) 
    -> positions({_id: position_id}) 
        -> organizationalUnit({_id: unit_id}) 
          -> {type === "Club" name}
  */
  const { title, unit_id, commonData, template_id, users } = req.body;
  const validation = validateBatchSchema.safeParse({
    title,
    unit_id,
    commonData,
    template_id,
    users,
  });

  if (!validation.success) {
    let errors = validation.error.issues.map((issue) => issue.message);
    return res.status(400).json({ message: errors });
  }

  //console.log(id);
  // Get coordinator's position and unit
  const positionHolder = await PositionHolder.findOne({ user_id: id });
  //console.log(positionHolder._id);
  if (!positionHolder) {
    return res
      .status(403)
      .json({
        message:
          "Unauthorized to do the task as user doesn't hold any position in any unit",
      });
  }

  const position = await Position.findById(positionHolder.position_id);
  //console.log(position._id);
  if (!position) {
    return res.status(403).json({ message: "Invalid user position" });
  }

  /*
  Check if the organization obtained by fetching related docs accross various collections
  is same as the input OrgId received
  */
  const userOrgId = position.unit_id.toString();
  if (unit_id !== userOrgId) {
    return res.status(403).json({
      message:
        "You are not authorized to initiate batches outside of your club",
    });
  }

  //const clubId = unit_id;
  // Ensure unit_id is a Club
  const unitObj = await OrganizationalUnit.findById(unit_id);
  if (!unitObj || unitObj.type !== "Club") {
    return res
      .status(403)
      .json({ message: "Invalid Data: Organization is not a Club" });
  }
  //console.log(unitObj._id);

  // Get council (parent unit) and ensure it's a Council
  if (!unitObj.parent_unit_id) {
    return res
      .status(403)
      .json({ message: "Invalid Data: club does not belong to a council" });
  }
  //console.log(unitObj.parent_unit_id);

  const councilObj = await OrganizationalUnit.findById(unitObj.parent_unit_id);
  if (
    !councilObj ||
    councilObj.type !== "Council" ||
    !councilObj.parent_unit_id
  ) {
    return res
      .status(403)
      .json({
        message:
          "Invalid Data: Organization is not a council or it's parent organization not found",
      });
  }

  //const councilId = councilObj._id.toString();
  const presidentOrgId = councilObj.parent_unit_id;

  const presidentPosition = await Position.findOne({
    unit_id: presidentOrgId,
    title: "President",
  });

  if (!presidentPosition) {
    return res.status(500).json({ message: "President position not found" });
  }

  const presidentHolder = await PositionHolder.findOne({
    position_id: presidentPosition._id,
  });

  if (!presidentHolder) {
    return res
      .status(500)
      .json({ message: "President position holder not found" });
  }

  const presidentObj = await User.findById(presidentHolder.user_id);

  //console.log(presidentPosition._id);
  const category = councilObj.category.toUpperCase();
  const gensecObj = await User.findOne({ role: `GENSEC_${category}` });
  if (!gensecObj || !presidentObj) {
    return res.status(500).json({ message: "Approvers not found" });
  }

  const approverIds = [gensecObj._id.toString(), presidentObj._id.toString()];

  const userChecks = await Promise.all(
    users.map(async (uid) => {
      const validation = zodObjectId.safeParse(uid);
      if (!validation.success) {
        return { uid, ok: false, reason: "Invalid ID" };
      }

      const userObj = await User.findById(uid);
      if (!userObj) return { uid, ok: false, reason: "User not found" };

      return { uid, ok: true };
    }),
  );

  const invalidData = userChecks.filter((c) => !c.ok);
  if (invalidData.length > 0) {
    return res
      .status(400)
      .json({ message: "Invalid user data sent", details: invalidData });
  }

  const newBatch = await CertificateBatch.create({
    title,
    unit_id,
    commonData,
    templateId: template_id,
    initiatedBy: id,
    approverIds,
    users,
  });

  res.json({ message: "New Batch created successfully", details: newBatch });
}

module.exports = {
  createBatch,
};
