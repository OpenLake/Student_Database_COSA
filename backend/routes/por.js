const express = require("express");
const router = express.Router();
const porController = require(
  "../controllers/porController"
);
router.get("/current", porController.getCurrentPORs);

module.exports = router;
