const mongoose = require("mongoose");
const {
  BudgetTransaction,
  OrganizationalUnit,
  Event,
} = require("../models/schema");
const { ROLES } = require("../utils/roles");

const TRANSACTION_TYPES = {
  ALLOCATION: "ALLOCATION",
  EXPENSE: "EXPENSE",
  REFUND: "REFUND",
};

const GENSEC_CATEGORY_BY_ROLE = {
  [ROLES.GENSEC_SCITECH]: "scitech",
  [ROLES.GENSEC_ACADEMIC]: "academic",
  [ROLES.GENSEC_CULTURAL]: "cultural",
  [ROLES.GENSEC_SPORTS]: "sports",
};

const createHttpError = (status, message) => {
  const error = new Error(message);
  error.status = status;
  return error;
};

const normalizeEmail = (user) => {
  return String(
    (user &&
      (user.username || (user.personal_info && user.personal_info.email))) ||
      "",
  )
    .trim()
    .toLowerCase();
};

const parsePositiveAmount = (amount) => {
  const parsed = Number(amount);
  if (!Number.isFinite(parsed) || parsed <= 0) {
    return null;
  }

  return Math.round(parsed * 100) / 100;
};

const mapUnitBudget = (unit) => {
  const allocated = Number(
    unit && unit.budget_info ? unit.budget_info.allocated_budget : 0,
  );
  const spent = Number(
    unit && unit.budget_info ? unit.budget_info.spent_amount : 0,
  );

  return {
    unitId: unit._id,
    unitName: unit.name,
    category: unit.category,
    allocated,
    spent,
    remaining: Math.max(0, allocated - spent),
  };
};

const getAccessibleUnitFilter = async (user) => {
  if (!user || !user.role) {
    throw createHttpError(403, "Forbidden: Invalid user role");
  }

  if (user.role === ROLES.PRESIDENT) {
    return {};
  }

  if (GENSEC_CATEGORY_BY_ROLE[user.role]) {
    return { category: GENSEC_CATEGORY_BY_ROLE[user.role] };
  }

  if (user.role === ROLES.CLUB_COORDINATOR) {
    const userEmail = normalizeEmail(user);
    const coordUnit = await OrganizationalUnit.findOne({
      "contact_info.email": new RegExp(
        `^${userEmail.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}$`,
        "i",
      ),
    }).select("_id");

    if (!coordUnit) {
      return { _id: null };
    }

    return { _id: coordUnit._id };
  }

  throw createHttpError(403, "Forbidden: Insufficient role");
};

const assertUnitAccess = async (user, unit) => {
  if (user.role === ROLES.PRESIDENT) {
    return;
  }

  if (GENSEC_CATEGORY_BY_ROLE[user.role]) {
    if (unit.category !== GENSEC_CATEGORY_BY_ROLE[user.role]) {
      throw createHttpError(
        403,
        "Forbidden: Cannot manage budget for this unit",
      );
    }
    return;
  }

  if (user.role === ROLES.CLUB_COORDINATOR) {
    const userEmail = normalizeEmail(user);
    const ownUnit = await OrganizationalUnit.findOne({
      "contact_info.email": new RegExp(
        `^${userEmail.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}$`,
        "i",
      ),
    }).select("_id");

    if (!ownUnit || String(ownUnit._id) !== String(unit._id)) {
      throw createHttpError(
        403,
        "Forbidden: Cannot manage budget for this unit",
      );
    }
    return;
  }

  throw createHttpError(403, "Forbidden: Insufficient role");
};

const applyEventBudgetUpdate = (event, type, amount) => {
  const existingBudget = event.budget || {};
  const allocated = Number(existingBudget.allocated || 0);
  const spent = Number(existingBudget.spent || 0);

  if (type === TRANSACTION_TYPES.ALLOCATION) {
    event.budget = Object.assign({}, existingBudget, {
      allocated: allocated + amount,
      spent,
    });
    return;
  }

  if (type === TRANSACTION_TYPES.EXPENSE) {
    event.budget = Object.assign({}, existingBudget, {
      allocated,
      spent: spent + amount,
    });
    return;
  }

  if (type === TRANSACTION_TYPES.REFUND) {
    if (spent < amount) {
      throw createHttpError(
        400,
        "Refund amount cannot be greater than event spent budget",
      );
    }
    event.budget = Object.assign({}, existingBudget, {
      allocated,
      spent: spent - amount,
    });
  }
};

const runBudgetTransaction = async ({ req, res, type, successMessage }) => {
  const { unitId, eventId, amount, description } = req.body;

  if (!mongoose.Types.ObjectId.isValid(unitId)) {
    return res.status(400).json({ message: "Invalid unit ID format" });
  }

  if (eventId && !mongoose.Types.ObjectId.isValid(eventId)) {
    return res.status(400).json({ message: "Invalid event ID format" });
  }

  const normalizedAmount = parsePositiveAmount(amount);
  if (!normalizedAmount) {
    return res
      .status(400)
      .json({ message: "Amount must be a positive number" });
  }

  const session = await mongoose.startSession();

  try {
    let createdTransactionId = null;
    let updatedUnit = null;

    await session.withTransaction(async () => {
      const unit = await OrganizationalUnit.findById(unitId).session(session);
      if (!unit) {
        throw createHttpError(404, "Organizational unit not found");
      }

      await assertUnitAccess(req.user, unit);

      let linkedEvent = null;
      if (eventId) {
        linkedEvent = await Event.findById(eventId).session(session);
        if (!linkedEvent) {
          throw createHttpError(404, "Event not found");
        }

        if (String(linkedEvent.organizing_unit_id) !== String(unit._id)) {
          throw createHttpError(
            400,
            "Event does not belong to the selected organizational unit",
          );
        }
      }

      const allocated = Number(unit.budget_info.allocated_budget || 0);
      const spent = Number(unit.budget_info.spent_amount || 0);

      if (type === TRANSACTION_TYPES.ALLOCATION) {
        unit.budget_info.allocated_budget = allocated + normalizedAmount;
      }

      if (type === TRANSACTION_TYPES.EXPENSE) {
        if (spent + normalizedAmount > allocated) {
          throw createHttpError(400, "Insufficient remaining budget");
        }
        unit.budget_info.spent_amount = spent + normalizedAmount;
      }

      if (type === TRANSACTION_TYPES.REFUND) {
        if (spent < normalizedAmount) {
          throw createHttpError(
            400,
            "Refund amount cannot be greater than spent budget",
          );
        }
        unit.budget_info.spent_amount = spent - normalizedAmount;
      }

      unit.updated_at = new Date();
      await unit.save({ session });

      if (linkedEvent) {
        applyEventBudgetUpdate(linkedEvent, type, normalizedAmount);
        linkedEvent.updated_at = new Date();
        await linkedEvent.save({ session });
      }

      const remaining =
        Number(unit.budget_info.allocated_budget || 0) -
        Number(unit.budget_info.spent_amount || 0);

      const createdTransactions = await BudgetTransaction.create(
        [
          {
            unit_id: unit._id,
            event_id: linkedEvent ? linkedEvent._id : null,
            type,
            amount: normalizedAmount,
            description: description || "",
            created_by: req.user._id,
            balance_after: Math.max(0, remaining),
            updated_at: new Date(),
          },
        ],
        { session },
      );

      createdTransactionId = createdTransactions[0]._id;
      updatedUnit = unit;
    });

    const transaction = await BudgetTransaction.findById(createdTransactionId)
      .populate("unit_id", "name category")
      .populate("event_id", "title event_id")
      .populate("created_by", "username role personal_info.name");

    return res.status(201).json({
      message: successMessage,
      transaction,
      budget: mapUnitBudget(updatedUnit),
    });
  } catch (error) {
    console.error(`Error processing budget ${type.toLowerCase()}:`, error);
    const status = error.status || 500;
    const message =
      status === 500
        ? "Server error while processing budget transaction"
        : error.message;
    return res.status(status).json({ message });
  } finally {
    session.endSession();
  }
};

const getBudgetOverview = async (req, res) => {
  try {
    const { unitId } = req.query;

    if (unitId) {
      if (!mongoose.Types.ObjectId.isValid(unitId)) {
        return res.status(400).json({ message: "Invalid unit ID format" });
      }

      const unit = await OrganizationalUnit.findById(unitId).select(
        "name category budget_info",
      );
      if (!unit) {
        return res
          .status(404)
          .json({ message: "Organizational unit not found" });
      }

      await assertUnitAccess(req.user, unit);
      return res.status(200).json({ budget: mapUnitBudget(unit) });
    }

    const filter = await getAccessibleUnitFilter(req.user);
    const units = await OrganizationalUnit.find(filter)
      .select("name category budget_info")
      .sort({ name: 1 });

    return res.status(200).json({
      budgets: units.map((unit) => mapUnitBudget(unit)),
    });
  } catch (error) {
    console.error("Error fetching budget overview:", error);
    const status = error.status || 500;
    const message =
      status === 500
        ? "Server error while fetching budget overview"
        : error.message;
    return res.status(status).json({ message });
  }
};

const getBudgetTransactions = async (req, res) => {
  try {
    const { unitId, eventId, type } = req.query;

    const page = Math.max(1, Number(req.query.page || 1));
    const limit = Math.min(100, Math.max(1, Number(req.query.limit || 20)));

    const filter = {};

    if (unitId) {
      if (!mongoose.Types.ObjectId.isValid(unitId)) {
        return res.status(400).json({ message: "Invalid unit ID format" });
      }
      const unit =
        await OrganizationalUnit.findById(unitId).select("name category");
      if (!unit) {
        return res
          .status(404)
          .json({ message: "Organizational unit not found" });
      }
      await assertUnitAccess(req.user, unit);
      filter.unit_id = unit._id;
    } else {
      const accessibleFilter = await getAccessibleUnitFilter(req.user);
      const units =
        await OrganizationalUnit.find(accessibleFilter).select("_id");
      const unitIds = units.map((unit) => unit._id);

      if (unitIds.length === 0) {
        return res.status(200).json({
          transactions: [],
          pagination: { total: 0, page, limit },
        });
      }

      filter.unit_id = { $in: unitIds };
    }

    if (eventId) {
      if (!mongoose.Types.ObjectId.isValid(eventId)) {
        return res.status(400).json({ message: "Invalid event ID format" });
      }
      filter.event_id = eventId;
    }

    if (type) {
      if (!Object.values(TRANSACTION_TYPES).includes(type)) {
        return res.status(400).json({
          message: `Invalid transaction type. Allowed values: ${Object.values(TRANSACTION_TYPES).join(", ")}`,
        });
      }
      filter.type = type;
    }

    const [transactions, total] = await Promise.all([
      BudgetTransaction.find(filter)
        .sort({ created_at: -1 })
        .skip((page - 1) * limit)
        .limit(limit)
        .populate("unit_id", "name category")
        .populate("event_id", "title event_id")
        .populate("created_by", "username role personal_info.name"),
      BudgetTransaction.countDocuments(filter),
    ]);

    return res.status(200).json({
      transactions,
      pagination: { total, page, limit },
    });
  } catch (error) {
    console.error("Error fetching budget transactions:", error);
    const status = error.status || 500;
    const message =
      status === 500
        ? "Server error while fetching budget transactions"
        : error.message;
    return res.status(status).json({ message });
  }
};

const allocateBudget = async (req, res) => {
  return runBudgetTransaction({
    req,
    res,
    type: TRANSACTION_TYPES.ALLOCATION,
    successMessage: "Budget allocated successfully",
  });
};

const recordExpense = async (req, res) => {
  return runBudgetTransaction({
    req,
    res,
    type: TRANSACTION_TYPES.EXPENSE,
    successMessage: "Expense recorded successfully",
  });
};

const recordRefund = async (req, res) => {
  return runBudgetTransaction({
    req,
    res,
    type: TRANSACTION_TYPES.REFUND,
    successMessage: "Refund recorded successfully",
  });
};

module.exports = {
  TRANSACTION_TYPES,
  getBudgetOverview,
  getBudgetTransactions,
  allocateBudget,
  recordExpense,
  recordRefund,
};
