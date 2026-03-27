const router = require("express").Router();
const {
  createBatch,
  editBatch,
  getBatchUsers,
  duplicateBatch,
  deleteBatch,
  archiveBatch,
  getUserBatches,
  approverEditBatch,
  approveBatch,
  rejectBatch,
} = require("../controllers/certificateBatchController");

const { isAuthenticated } = require("../middlewares/isAuthenticated");
const authorizeRole = require("../middlewares/authorizeRole");
const { ROLE_GROUPS, ROLES } = require("../utils/roles");

router.get(
  "/:userId",
  isAuthenticated,
  authorizeRole(ROLE_GROUPS.ADMIN),
  getUserBatches,
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

router.patch(
  "/approver/edit-batch",
  isAuthenticated,
  authorizeRole([...ROLE_GROUPS.GENSECS, ROLES.PRESIDENT]),
  approverEditBatch,
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

router.get(
  "/:batchId/approve",
  isAuthenticated,
  authorizeRole(ROLE_GROUPS.ADMIN),
  approveBatch,
);

router.get(
  "/:batchId/reject",
  isAuthenticated,
  authorizeRole(ROLE_GROUPS.ADMIN),
  rejectBatch,
);

module.exports = router;
