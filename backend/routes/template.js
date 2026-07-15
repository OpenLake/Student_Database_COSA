const router = require("express").Router();

const {
  getTemplates,
  getTemplate,
  createTemplate,
  updateTemplate,
  deleteTemplate,
} = require("../controllers/templateController");

const isAuthenticated = require("../middlewares/isAuthenticated");
const authorizeRole = require("../middlewares/authorizeRole");
const { ROLE_GROUPS } = require("../utils/roles");

// View all templates
router.get(
  "/",
  isAuthenticated,
  getTemplates
);

// View a single template
router.get(
  "/:id",
  isAuthenticated,
  getTemplate
);

// Create template
router.post(
  "/",
  isAuthenticated,
  authorizeRole(ROLE_GROUPS.COORDINATORS),
  createTemplate
);

// Update template
router.patch(
  "/:id",
  isAuthenticated,
  authorizeRole(ROLE_GROUPS.COORDINATORS),
  updateTemplate
);

// Delete template
router.delete(
  "/:id",
  isAuthenticated,
  authorizeRole(ROLE_GROUPS.COORDINATORS),
  deleteTemplate
);

module.exports = router;