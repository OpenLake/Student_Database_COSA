const router = require("express").Router();
const { createBatch } = require("../controllers/certificateController");

const { jwtIsAuthenticated } = require("../middlewares/isAuthenticated");

router.post("/", jwtIsAuthenticated, createBatch);

module.exports = router;
