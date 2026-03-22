const Task = require("../models/taskSchema");
const User = require("../models/userSchema");

async function getTasks(req, res) {
  try {
    //console.log(req.user);
    const id = req.user._id;
    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const tasks = await Task.find({
      $or: [{ assigned_to: user._id }, { assigned_by: user._id }],
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

    res.json(tasks);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
}

module.exports = { getTasks };
