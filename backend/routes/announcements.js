const express = require("express");
const router = express.Router();
const isAuthenticated = require("../middlewares/isAuthenticated");
const announcementController = require("../controllers/announcementController");

router.post("/", isAuthenticated, announcementController.createAnnouncement);

// GET / - list announcements with filtering, search, pagination and sorting
router.get("/", announcementController.getAnnouncements);

// GET /:id - fetch a single announcement by id
router.get("/:id", announcementController.getAnnouncementById);

// PUT /:id - update an announcement by id
router.put(
  "/:id",
  isAuthenticated,
  // allow authors, admins and gensec/president roles to update announcements
  // authorizeRole(["admin", "gen_sec", "president", "gensec"]),
  announcementController.updateAnnouncement
);

// DELETE /:id - delete an announcement by id
router.delete("/:id", isAuthenticated, announcementController.deleteAnnouncement);

module.exports = router;
