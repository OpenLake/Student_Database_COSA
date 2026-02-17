
const User = require("../models/userSchema"); 
const Position = require("../models/positionSchema"); 
const PositionHolder = require("../models/positionHolderSchema"); 
const OrganizationalUnit = require("../models/organizationSchema"); 
const { CertificateBatch } = require("../models/certificateSchema");
const { validateBatchSchema, zodObjectId } = require("../utils/batchValidate");

async function createBatch(req, res) {
  //console.log(req.user);
  try{
    const id = req.user.id;
    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ messge: "Invalid data (User not found)" });
    }

    if (user.role !== "CLUB_COORDINATOR") {
      return res.status(403).json({ message: "Not authorized to perform the task" });
    }

    //to get user club
    // positionHolders({user_id: id}) -> positions({_id: position_id}) -> organizationalUnit({_id: unit_id}) -> unit_id = "Club name"
    const { title, unit_id, commonData, template_id, users } = req.body;
    const validation = validateBatchSchema.safeParse({
      title,
      unit_id,
      commonData,
      template_id,
      users,
    });

    if (!validation.success) {
      let errors = validation.error.issues.map(issue => issue.message);
      return res.status(400).json({ message: errors });
    }

    // Get coordinator's position and unit
    const positionHolder = await PositionHolder.findOne({ user_id: id });
    if (!positionHolder) {
      return res.status(403).json({ message: "You are not part of any position in a unit" });
    }

    const position = await Position.findById(positionHolder.position_id);
    console.log(position._id);
    if (!position) {
      return res.status(403).json({ message: "Your position is invalid" });
    }

    const userUnitId = position.unit_id.toString();
    if (userUnitId !== unit_id) {
      return res
        .status(403)
        .json({
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
        .json({ message: "Invalid Data: unit is not a Club" });
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
    if (!councilObj || councilObj.type !== "Council") {
      return res.status(403).json({ message: "Invalid Data: council not found" });
    }

    //const councilId = councilObj._id.toString();
    const presidentOrgUnitId = councilObj.parent_unit_id;
    const category = councilObj.category.toUpperCase();

    // Resolve General Secretary and President for the council (server-side, tamper-proof)
    const gensecObj = await User.findOne({ role: `GENSEC_${category}` });
    if(!gensecObj){
      return res.status(500).json({ message: "General Secretary not found" });  
    }
    //console.log(gensecObj._id);

    const presidentPosition = await Position.findOne({
      unit_id: presidentOrgUnitId,
      title: /president/i,
    });
    if (!presidentPosition) {
      return res
        .status(500)
        .json({ message: "President position not found for council" });
    }
    //console.log(presidentPosition._id);

    const presidentHolder = await PositionHolder.findOne({
      position_id: presidentPosition._id,
    });
    const presidentId = presidentHolder.user_id.toString();
    //console.log(presidentId);
    const presidentObj = await User.findById(presidentId);

    console.log(presidentObj._id);
    if (!presidentObj) {
      return res.status(500).json({ message: "President not found" });
    }

    const approverIds = [gensecObj._id.toString(), presidentId];

    const userChecks = await Promise.all(
      users.map(async (uid) => {
        const validation = zodObjectId.safeParse(uid);
        if (!validation) {
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
  }catch(err){
    res.status(500).json({message: err.message || "Internal server error"});
  }
}

module.exports = {
  createBatch,
};
