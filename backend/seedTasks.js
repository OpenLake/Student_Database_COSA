require("dotenv").config();
const mongoose = require("mongoose");
const Task = require("./models/taskSchema");
const User = require("./models/userSchema");
const PositionHolder = require("./models/positionHolderSchema");
const Position = require("./models/positionSchema");
const OrganizationalUnit = require("./models/organizationSchema");

// Helpers

const randomItem = (arr) => arr[Math.floor(Math.random() * arr.length)];

const randomSubset = (arr, min, max) => {
  const count = Math.min(
    arr.length,
    Math.floor(Math.random() * (max - min + 1)) + min,
  );
  return [...arr].sort(() => 0.5 - Math.random()).slice(0, count);
};

const futureDate = (daysAhead) => {
  const d = new Date();
  d.setDate(d.getDate() + daysAhead);
  return d;
};

const PRIORITIES = ["low", "medium", "high"];
const STATUSES = ["pending", "in-progress", "under-review", "completed"];

const SAMPLE_TASKS = [
  {
    title: "Organise Annual Tech Fest",
    description:
      "Plan and execute the annual tech fest including logistics and sponsorships.",
  },
  {
    title: "Club Budget Report Submission",
    description: "Compile and submit the quarterly budget utilisation report.",
  },
  {
    title: "Social Media Campaign",
    description: "Run a two-week social media campaign for the upcoming event.",
  },
  {
    title: "Sponsor Outreach",
    description:
      "Reach out to at least 10 potential sponsors and collect proposals.",
  },
  {
    title: "Workshop Coordination",
    description:
      "Coordinate with external speakers and manage workshop registrations.",
  },
  {
    title: "Internal Newsletter",
    description:
      "Draft and publish the monthly internal newsletter for club members.",
  },
  {
    title: "Venue Booking",
    description: "Identify and book a suitable venue for the seminar.",
  },
  {
    title: "Volunteer Management",
    description: "Recruit and brief volunteers for the upcoming event.",
  },
  {
    title: "Post-Event Survey",
    description:
      "Design and circulate a feedback form after the event and compile results.",
  },
  {
    title: "Equipment Procurement",
    description:
      "Assess equipment needs and raise purchase requests with proper documentation.",
  },
];

// Returns the unit ObjectId associated with an assigner by tracing PositionHolder -> Position -> unit_id.
async function getAssignerUnitId(user) {
  const holder = await PositionHolder.findOne({
    user_id: user._id,
    status: "active",
  });
  if (!holder) return null;
  const position = await Position.findById(holder.position_id).select(
    "unit_id",
  );
  return position ? position.unit_id : null;
}

// Builds a deduplicated set of assignable user ObjectIds for the given assigner,
// following the role-based rules:
//   PRESIDENT        -> any GENSEC_* or CLUB_COORDINATOR user, plus all active PositionHolders
//   GENSEC_*         -> CLUB_COORDINATORs and active PositionHolders in units of the same category
//   CLUB_COORDINATOR -> active PositionHolders in their own unit only
async function resolveAssignees(assignerUser, assignerUnitId) {
  const role = assignerUser.role;
  const assignerId = assignerUser._id.toString();

  if (role === "PRESIDENT") {
    const roleUsers = await User.find({
      _id: { $ne: assignerUser._id },
      $or: [{ role: /^GENSEC_/ }, { role: "CLUB_COORDINATOR" }],
    }).select("_id");

    const activeHolders = await PositionHolder.find({
      status: "active",
    }).select("user_id");

    const allIds = new Set([
      ...roleUsers.map((u) => u._id.toString()),
      ...activeHolders.map((h) => h.user_id.toString()),
    ]);
    allIds.delete(assignerId);

    return [...allIds].map((id) => new mongoose.Types.ObjectId(id));
  }

  if (role && role.startsWith("GENSEC_")) {
    if (!assignerUnitId) return [];

    const unit =
      await OrganizationalUnit.findById(assignerUnitId).select("category");
    if (!unit) return [];

    const category = unit.category;
    const categoryUnits = await OrganizationalUnit.find({ category }).select(
      "_id",
    );
    const categoryUnitIds = categoryUnits.map((u) => u._id);

    const categoryPositions = await Position.find({
      unit_id: { $in: categoryUnitIds },
    }).select("_id");
    const categoryPositionIds = categoryPositions.map((p) => p._id);

    const holders = await PositionHolder.find({
      position_id: { $in: categoryPositionIds },
      status: "active",
    }).select("user_id");

    const holderUserIds = holders.map((h) => h.user_id.toString());

    // Also pull in CLUB_COORDINATOR users whose position maps to the same category
    const allCoords = await User.find({ role: "CLUB_COORDINATOR" }).select(
      "_id",
    );
    const coordsInCategory = [];
    for (const coord of allCoords) {
      const coordUnitId = await getAssignerUnitId(coord);
      if (!coordUnitId) continue;
      const coordUnit =
        await OrganizationalUnit.findById(coordUnitId).select("category");
      if (coordUnit && coordUnit.category === category) {
        coordsInCategory.push(coord._id.toString());
      }
    }

    const allIds = new Set([...holderUserIds, ...coordsInCategory]);
    allIds.delete(assignerId);

    return [...allIds].map((id) => new mongoose.Types.ObjectId(id));
  }

  if (role === "CLUB_COORDINATOR") {
    if (!assignerUnitId) return [];

    const unitPositions = await Position.find({
      unit_id: assignerUnitId,
    }).select("_id");
    const unitPositionIds = unitPositions.map((p) => p._id);

    const holders = await PositionHolder.find({
      position_id: { $in: unitPositionIds },
      status: "active",
    }).select("user_id");

    return holders
      .map((h) => h.user_id)
      .filter((id) => id.toString() !== assignerId);
  }

  return [];
}

async function seedTasks(options) {
  const tasksPerAssigner = (options && options.tasksPerAssigner) || 3;
  const clearExisting = (options && options.clearExisting) || false;

  await mongoose.connect(process.env.MONGODB_URI || process.env.MONGO_URI);
  console.log("MongoDB Connected");

  if (clearExisting) {
    await Task.deleteMany({});
    console.log("Cleared existing tasks");
  }

  const assigners = await User.find({
    $or: [
      { role: "PRESIDENT" },
      { role: /^GENSEC_/ },
      { role: "CLUB_COORDINATOR" },
    ],
    status: "active",
  });

  if (!assigners.length) {
    console.log("No assigner users found. Seed users first.");
    await mongoose.disconnect();
    return;
  }

  const tasksToInsert = [];

  for (const assigner of assigners) {
    const unitId = await getAssignerUnitId(assigner);
    const assigneeIds = await resolveAssignees(assigner, unitId);
    const name =
      (assigner.personal_info && assigner.personal_info.name) ||
      assigner.username;

    if (!assigneeIds.length) {
      console.log(
        "No valid assignees for " +
          assigner.role +
          " (" +
          name +
          "). Skipping.",
      );
      continue;
    }

    // Use the assigner's unit, or fall back to any active unit
    const taskUnitId =
      unitId ||
      (
        (await OrganizationalUnit.findOne({ is_active: true }).select("_id")) ||
        {}
      )._id;

    if (!taskUnitId) {
      console.log(
        "No active organizational unit found for " + name + ". Skipping.",
      );
      continue;
    }

    for (let i = 0; i < tasksPerAssigner; i++) {
      const template = randomItem(SAMPLE_TASKS);
      const assignees = randomSubset(
        assigneeIds,
        1,
        Math.min(3, assigneeIds.length),
      );

      tasksToInsert.push({
        title: template.title,
        description: template.description,
        assigned_by: assigner._id,
        assignees,
        unit_id: taskUnitId,
        deadline: futureDate(Math.floor(Math.random() * 60) + 7),
        priority: randomItem(PRIORITIES),
        status: randomItem(STATUSES),
        submission_note: "",
        admin_notes: "",
      });
    }

    console.log(
      "Queued " +
        tasksPerAssigner +
        " task(s) for " +
        assigner.role +
        " - " +
        name,
    );
  }

  if (!tasksToInsert.length) {
    console.log(
      "No tasks to insert. Check that assigners have valid position holders and units.",
    );
    await mongoose.disconnect();
    return;
  }

  const inserted = await Task.insertMany(tasksToInsert);
  console.log("Seeded " + inserted.length + " task(s) successfully.");

  await mongoose.disconnect();
  console.log("Disconnected from MongoDB");
}

seedTasks({
  tasksPerAssigner: 3,
  clearExisting: true,
}).catch((err) => {
  console.error("Seeding failed:", err);
  mongoose.disconnect();
  process.exit(1);
});
