const express = require("express");
const router = express.Router();
const isAuthenticated = require("../middlewares/isAuthenticated");
const {
  getTasks,
  createTask,
  updateTaskStatus,
  getAssignableUsers,
  getTaskStats,
} = require("../controllers/taskController");

router.get("/stats", isAuthenticated, getTaskStats);
router.get("/assignable-users", isAuthenticated, getAssignableUsers);
router.get("/", isAuthenticated, getTasks);
router.post("/", isAuthenticated, createTask);
router.patch("/:id/status", isAuthenticated, updateTaskStatus);

module.exports = router;