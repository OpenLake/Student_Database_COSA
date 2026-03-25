const Task = require("../models/taskSchema");
const User = require("../models/userSchema");
const PositionHolder = require("../models/positionHolderSchema");
const OrganizationalUnit = require("../models/organizationSchema");
const Position = require("../models/positionSchema");

const { taskValidate } = require("../utils/taskValidate");

async function getTasks(req, res) {
  try {
    //console.log(req.user);
    const id = req.user._id;
    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const tasks = await Task.find({
      $or: [{ assignees: user._id }, { assigned_by: user._id }],
    }).populate([
      {
        path: "assigned_by",
        select: "personal_info",
      },
      {
        path: "assignees",
        select: "personal_info.name",
      },
    ]);

    if (!tasks || tasks.length === 0) {
      return res.status(404).json({ message: "No tasks found" });
    }
    res.json({ message: tasks });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
}

async function updateTask(req, res) {
  try {
    const taskId = req.params.taskId;
    const _id = req.user._id;

    const { status, submission_note, admin_notes } = req.body;

    if (!["pending", "in-progress", "under-review", "completed"].includes(status)) {
      return res.status(400).json({ message: "Invalid status" });
    }

    const task = await Task.findById(taskId);
    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    const isAssigner = task.assigned_by.toString() === _id.toString();
    const isAssignee = task.assignees.some((a) => a.toString() === _id.toString());

    if(!isAssigner && !isAssignee){
      return res.status(403).json({message: "You are not authorized to perform the update"})
    }

    if (isAssignee) {
      const validAssigneeMove =
        (task.status === "pending" && status === "in-progress") ||
        (task.status === "in-progress" && status === "under-review");
      if (!validAssigneeMove) {
        return res.status(403).json({ message: "Invalid assignee transition" });
      }
      if (status === "under-review" && !submission_note) {
        return res.status(400).json({ message: "submission_note is required" });
      }
    }

    if (isAssigner) {
      const validAssignerMove =
        task.status === "under-review" &&
        (status === "completed" || status === "in-progress");
      if (!validAssignerMove) {
        return res.status(403).json({ message: "Invalid assigner transition" });
      }
    }


    task.status = status;
    if (status) task.status = status;
    if (submission_note) task.submission_note = submission_note;
    if (admin_notes) task.admin_notes = admin_notes;

    await task.save();
    res.json({ message: "Task updated successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
}

async function createTask(req, res) {
  try {
    const userId = req.user._id;
    const { title, description, deadline, priority, assignees } = req.body;
    const validation = taskValidate.safeParse({
      title,
      description,
      deadline,
      priority,
      assignees,
    });

    if (!validation.success) {
      let errors = validation.error.issues.map((issue) => issue.message);
      return res.status(400).json({ message: errors });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const unit = await PositionHolder.findOne({ user_id: userId }).populate({
      path: "position_id",
      select: "unit_id",
    });
    if (!unit) {
      return res.status(404).json({ message: "Unit not found" });
    }
    console.log("Unit:", unit);

    const unitId = unit?.position_id?.unit_id;
    if (!unitId) {
      return res.status(404).json({ message: "Unit Id not found" });
    }
    console.log("Unit Id:", unitId);

    const existingUserIds = await User.find({ _id: { $in: assignees } })
      .select("_id")
      .lean();
    const existingSet = new Set(existingUserIds.map((u) => u._id));
    if (existingSet.size !== assignees.length) {
      return res.status(400).json({ message: "Invalid assignees data" });
    }

    await Task.create({
      title,
      description,
      deadline,
      priority,
      status: "pending",
      progress: 0,
      assigned_by: userId,
      assignees,
      unit_id: unitId,
    });
    return res.json({ message: "Task created successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
}

async function getTaskUsers(req, res) {
  try {
    const id = req.user._id;
    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const role = user.role?.toUpperCase();
    if (role === "PRESIDENT") {
      const userIds = (await PositionHolder.find().select("user_id")).map((u) => u.user_id);
      const users = await User.find({_id: {$in: userIds}}).select("personal_info role");
      return res.json({ message: users });
    }

    const unit = await PositionHolder.findOne({ user_id: id }).populate({
      path: "position_id",
      select: "unit_id",
    });

    if (!unit) {
      return res.status(404).json({ message: "Unit not found" });
    }
    const unitId = unit?.position_id?.unit_id;

    if (!unitId) {
      return res.status(404).json({ message: "Unit Id not found" });
    }

    const categoryDoc = await (OrganizationalUnit.findById(unitId).select("category"));
    const category = categoryDoc?.category;
    if (!category) {
      return res.status(404).json({ message: "Category not found" });
    }

    if (role.startsWith("GENSEC")) {
      const categoryOrgsIds = ( await OrganizationalUnit.find({ category: category }).select("_id")).map((org) => org._id);

      const positionsIds = (await Position.find({ unit_id: { $in: categoryOrgsIds } }).select("_id")).map((p) => p._id);

      const userIds = (await PositionHolder.find({position_id: { $in: positionsIds }}).select("user_id")).map((u) => u._id);

      const users = await User.find({ _id: { $in: userIds } }).select("personal_info, role");
      return res.json({ message: users });
    }

    if (role === "CLUB_COORDINATOR") {
      const positions = (
        await Position.find({ unit_id: unitId }).select("_id")
      ).map((p) => p._id);

      const userIds = (
        await PositionHolder.find({ position_id: { $in: positions } }).select(
          "user_id",
        )
      ).map((u) => u.user_id);

      const users = await User.find({ _id: { $in: userIds } }).select(
        "personal_info role",
      );

      return res.json({ message: users });
    }
    return res.json({ message: [] });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message || "Internal server error" });
  }
}

module.exports = { getTasks, updateTask, createTask, getTaskUsers };
