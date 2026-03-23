const express = require("express");

const isAuthenticated = require("../middlewares/isAuthenticated");
const authorizeRole = require("../middlewares/authorizeRole");
const { ROLE_GROUPS } = require("../utils/roles");
const budgetController = require("../controllers/budgetController");

const router = express.Router();

router.get(
  "/overview",
  isAuthenticated,
  authorizeRole(ROLE_GROUPS.ADMIN),
  budgetController.getBudgetOverview,
);

router.get(
  "/transactions",
  isAuthenticated,
  authorizeRole(ROLE_GROUPS.ADMIN),
  budgetController.getBudgetTransactions,
);

router.post(
  "/allocate",
  isAuthenticated,
  authorizeRole(ROLE_GROUPS.REVIEW_ROLES),
  budgetController.allocateBudget,
);

router.post(
  "/spend",
  isAuthenticated,
  authorizeRole(ROLE_GROUPS.ADMIN),
  budgetController.recordExpense,
);

router.post(
  "/refund",
  isAuthenticated,
  authorizeRole(ROLE_GROUPS.ADMIN),
  budgetController.recordRefund,
);

module.exports = router;
