const mongoose = require("mongoose");
const Task = require("../models/taskSchema");
const { User, Position, PositionHolder, OrganizationalUnit } = require("../models/schema");
const { ROLES, ROLE_GROUPS } = require("../utils/roles");

const VALID_STATUSES = ["pending", "in-progress", "under-review", "completed"];
const VALID_PRIORITIES = ["low", "medium", "high"];

const ALLOWED_TRANSITIONS = {
  pending: ["in-progress"],
  "in-progress": ["under-review"],
  "under-review": ["completed", "in-progress"],
  completed: [],
};

const TASK_POPULATE = [
  { path: "assigned_by", select: "personal_info.name role username" },
  { path: "assignees", select: "personal_info.name role username" },
];

function mapUser(u) {
  return {
    _id: u._id.toString(),
    name: u.personal_info?.name || u.username,
    role: u.role,
    position: null,
  };
}

function mapHolder(ph) {
  return {
    _id: ph.user_id._id.toString(),
    name: ph.user_id.personal_info?.name || ph.user_id.username,
    role: ph.user_id.role,
    position: ph.position_id?.title || null,
  };
}

function dedupeUsers(list) {
  const map = new Map();
  list.forEach((u) => {
    if (u && u._id && !map.has(u._id)) map.set(u._id, u);
  });
  return Array.from(map.values());
}

async function resolveAssignerUnitId(user) {
  const { role, username } = user;

  if (role === ROLES.PRESIDENT) return null;

  if (ROLE_GROUPS.GENSECS.includes(role) || role === ROLES.CLUB_COORDINATOR) {
    const unit = await OrganizationalUnit.findOne({ "contact_info.email": username }).select("_id");
    return unit ? unit._id : null;
  }

  return null;
}

async function resolveAssignableUsers(user) {
  const { role, username } = user;

  if (role === ROLES.PRESIDENT) {
    const directUsers = await User.find({
      role: { $in: [...ROLE_GROUPS.GENSECS, ROLES.CLUB_COORDINATOR] },
    }).select("_id personal_info.name role username");

    const positionHolders = await PositionHolder.find({ status: "active" })
      .populate({ path: "user_id", select: "_id personal_info.name role username" })
      .populate({ path: "position_id", select: "title" });

    return dedupeUsers([
      ...directUsers.map(mapUser),
      ...positionHolders.filter((ph) => ph.user_id).map(mapHolder),
    ]);
  }

  if (ROLE_GROUPS.GENSECS.includes(role)) {
    const orgUnit = await OrganizationalUnit.findOne({ "contact_info.email": username });
    if (!orgUnit) return [];

    const clubUnits = await OrganizationalUnit.find({
      category: orgUnit.category,
      type: "Club",
    });
    if (clubUnits.length === 0) return [];

    const clubUnitIds = clubUnits.map((u) => u._id);
    const clubEmails = clubUnits.map((u) => u.contact_info?.email).filter(Boolean);

    const coordinators = await User.find({
      username: { $in: clubEmails },
      role: ROLES.CLUB_COORDINATOR,
    }).select("_id personal_info.name role username");

    const positions = await Position.find({ unit_id: { $in: clubUnitIds } }).select("_id");
    const positionIds = positions.map((p) => p._id);

    const positionHolders = await PositionHolder.find({
      position_id: { $in: positionIds },
      status: "active",
    })
      .populate({ path: "user_id", select: "_id personal_info.name role username" })
      .populate({ path: "position_id", select: "title" });

    return dedupeUsers([
      ...coordinators.map(mapUser),
      ...positionHolders.filter((ph) => ph.user_id).map(mapHolder),
    ]);
  }

  if (role === ROLES.CLUB_COORDINATOR) {
    const unit = await OrganizationalUnit.findOne({ "contact_info.email": username });
    if (!unit) return [];

    const positions = await Position.find({ unit_id: unit._id }).select("_id");
    const positionIds = positions.map((p) => p._id);

    const positionHolders = await PositionHolder.find({
      position_id: { $in: positionIds },
      status: "active",
    })
      .populate({ path: "user_id", select: "_id personal_info.name role username" })
      .populate({ path: "position_id", select: "title" });

    return dedupeUsers(positionHolders.filter((ph) => ph.user_id).map(mapHolder));
  }

  return null;
}

exports.getAssignableUsers = async (req, res) => {
  try {
    const users = await resolveAssignableUsers(req.user);
    if (users === null) {
      return res.status(403).json({ message: "You do not have permission to assign tasks" });
    }
    return res.status(200).json(users);
  } catch (error) {
    console.error("Error fetching assignable users:", error);
    return res.status(500).json({ message: "Failed to fetch assignable users" });
  }
};

// GET /api/tasks — empty result is a normal 200 + [], not a 404.
exports.getTasks = async (req, res) => {
  try {
    const userId = req.user._id;
    const tasks = await Task.find({
      $or: [{ assignees: userId }, { assigned_by: userId }],
    })
      .populate(TASK_POPULATE)
      .sort({ created_at: -1 });

    return res.status(200).json(tasks);
  } catch (error) {
    console.error("Error fetching tasks:", error);
    return res.status(500).json({ message: "Failed to fetch tasks" });
  }
};

exports.getTaskStats = async (req, res) => {
  try {
    const userId = req.user._id;

    const [assignedAgg, delegatedAgg] = await Promise.all([
      Task.aggregate([
        { $match: { assignees: userId } },
        { $group: { _id: "$status", count: { $sum: 1 } } },
      ]),
      Task.aggregate([
        { $match: { assigned_by: userId } },
        { $group: { _id: "$status", count: { $sum: 1 } } },
      ]),
    ]);

    const toMap = (agg) => agg.reduce((acc, cur) => ({ ...acc, [cur._id]: cur.count }), {});

    return res.status(200).json({
      assignedToMe: toMap(assignedAgg),
      delegatedByMe: toMap(delegatedAgg),
    });
  } catch (error) {
    console.error("Error fetching task stats:", error);
    return res.status(500).json({ message: "Failed to fetch task stats" });
  }
};

exports.createTask = async (req, res) => {
  try {
    const { title, description, assignees, deadline, priority } = req.body;
    const assignerId = req.user._id;

    if (!title || !title.trim() || !description || !description.trim() || !deadline) {
      return res.status(400).json({ message: "title, description and deadline are required" });
    }

    if (!Array.isArray(assignees) || assignees.length === 0) {
      return res.status(400).json({ message: "At least one assignee is required" });
    }

    const invalidIds = assignees.filter((id) => !mongoose.Types.ObjectId.isValid(id));
    if (invalidIds.length > 0) {
      return res.status(400).json({ message: "One or more assignee IDs are invalid" });
    }

    const deadlineDate = new Date(deadline);
    if (Number.isNaN(deadlineDate.getTime())) {
      return res.status(400).json({ message: "Deadline must be a valid date" });
    }
    const startOfToday = new Date();
    startOfToday.setHours(0, 0, 0, 0);
    if (deadlineDate < startOfToday) {
      return res.status(400).json({ message: "Deadline cannot be in the past" });
    }

    if (priority && !VALID_PRIORITIES.includes(priority)) {
      return res.status(400).json({ message: "Invalid priority value" });
    }

    // Server-side authority check: never trust the frontend's filtered
    // dropdown alone.
    const assignable = await resolveAssignableUsers(req.user);
    if (assignable === null) {
      return res.status(403).json({ message: "You do not have permission to assign tasks" });
    }

    const allowedIds = new Set(assignable.map((u) => u._id));
    const unauthorized = assignees.filter((id) => !allowedIds.has(id.toString()));
    if (unauthorized.length > 0) {
      return res.status(403).json({
        message: "You are not authorized to assign tasks to one or more selected users",
      });
    }

    const unitId = await resolveAssignerUnitId(req.user);

    const task = await Task.create({
      title: title.trim(),
      description: description.trim(),
      assigned_by: assignerId,
      assignees,
      unit_id: unitId,
      deadline: deadlineDate,
      priority: priority || "medium",
    });

    await task.populate(TASK_POPULATE);

    return res.status(201).json(task);
  } catch (error) {
    console.error("Error creating task:", error);
    if (error.name === "ValidationError") {
      return res.status(400).json({ message: error.message });
    }
    return res.status(500).json({ message: "Failed to create task" });
  }
};

// pending -> in-progress -> under-review; assigner drives
// under-review -> completed / back to in-progress. An assignee can never
// set "completed" themselves.
exports.updateTaskStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, submission_note, admin_notes, progress } = req.body;
    const userId = req.user._id.toString();

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid task id" });
    }

    if (status === undefined && typeof progress !== "number") {
      return res.status(400).json({ message: "status or progress is required" });
    }

    if (status !== undefined && !VALID_STATUSES.includes(status)) {
      return res.status(400).json({ message: "Invalid status value" });
    }

    const task = await Task.findById(id);
    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    const isAssignee = task.assignees.some((a) => a.toString() === userId);
    const isAssigner = task.assigned_by.toString() === userId;

    if (!isAssignee && !isAssigner) {
      return res.status(403).json({ message: "You are not part of this task" });
    }

    const previousStatus = task.status;
    const isStatusChange = status !== undefined && status !== previousStatus;

    if (isStatusChange) {
      const allowedNext = ALLOWED_TRANSITIONS[previousStatus] || [];
      if (!allowedNext.includes(status)) {
        return res.status(400).json({
          message: `Cannot move task from "${previousStatus}" to "${status}"`,
        });
      }

      if (status === "in-progress" && previousStatus === "pending") {
        if (!isAssignee) {
          return res.status(403).json({ message: "Only an assignee can start this task" });
        }
      }

      if (status === "under-review") {
        if (!isAssignee) {
          return res.status(403).json({ message: "Only an assignee can submit this task for review" });
        }
        if (!submission_note || !submission_note.trim()) {
          return res.status(400).json({
            message: "A submission note or link is required to submit for review",
          });
        }
        task.submission_note = submission_note.trim();
      }

      // Both "approve & complete" and "send back for rework" originate
      // from under-review and are assigner-only.
      if (previousStatus === "under-review" && (status === "completed" || status === "in-progress")) {
        if (!isAssigner) {
          return res.status(403).json({ message: "Only the assigner can review this task" });
        }
        if (admin_notes !== undefined) {
          task.admin_notes = String(admin_notes).trim();
        }
      }

      task.status = status;
    } else if (!isAssignee) {
      return res.status(403).json({ message: "Only an assignee can update progress" });
    }

    if (typeof progress === "number" && progress >= 0 && progress <= 100) {
      task.progress = progress;
    } else if (isStatusChange && status === "completed") {
      task.progress = 100;
    } else if (isStatusChange && status === "in-progress" && previousStatus === "under-review") {
      task.progress = Math.min(task.progress, 90);
    }

    await task.save();
    await task.populate(TASK_POPULATE);

    return res.status(200).json(task);
  } catch (error) {
    console.error("Error updating task status:", error);
    if (error.name === "ValidationError") {
      return res.status(400).json({ message: error.message });
    }
    return res.status(500).json({ message: "Failed to update task status" });
  }
};