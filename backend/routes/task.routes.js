const router = require("express").Router();
const { isAuthenticated } = require("../middlewares/isAuthenticated");
const {
  getTasks,
  updateTask,
  createTask,
  getTaskUsers,
} = require("../controllers/taskController");

router.get("/", isAuthenticated, getTasks);
router.patch("/:taskId", isAuthenticated, updateTask);
router.post("/create-task", isAuthenticated, createTask);
router.get("/get-users", isAuthenticated, getTaskUsers);

module.exports = router;
