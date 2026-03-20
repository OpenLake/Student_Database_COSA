const router = require("express").Router();
const {
  createBatch,
  editBatch,
  getAllBatches,
  getBatchUsers,
  duplicateBatch,
  deleteBatch,
  archiveBatch,
} = require("../controllers/certificateBatchController");

const { isAuthenticated } = require("../middlewares/isAuthenticated");
const authorizeRole = require("../middlewares/authorizeRole");
const { ROLE_GROUPS } = require("../utils/roles");

router.get(
  "/",
  isAuthenticated,
  authorizeRole(ROLE_GROUPS.COORDINATORS),
  getAllBatches,
);
router.post(
  "/create-batch",
  isAuthenticated,
  authorizeRole(ROLE_GROUPS.COORDINATORS),
  createBatch,
);

router.patch(
  "/edit-batch",
  isAuthenticated,
  authorizeRole(ROLE_GROUPS.COORDINATORS),
  editBatch,
);

router.post(
  "/batch-users",
  isAuthenticated,
  authorizeRole(ROLE_GROUPS.COORDINATORS),
  getBatchUsers,
);

router.post(
  "/duplicate-batch",
  isAuthenticated,
  authorizeRole(ROLE_GROUPS.COORDINATORS),
  duplicateBatch,
);

router.delete(
  "/delete-batch",
  isAuthenticated,
  authorizeRole(ROLE_GROUPS.COORDINATORS),
  deleteBatch,
);

router.patch(
  "/archive-batch",
  isAuthenticated,
  authorizeRole(ROLE_GROUPS.COORDINATORS),
  archiveBatch,
);

module.exports = router;
