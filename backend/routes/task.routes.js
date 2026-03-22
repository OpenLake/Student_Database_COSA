const router = require("express").Router();
const { getTasks } = require("../controllers/taskController");

router.get("/", getTasks);

module.exports = router;
