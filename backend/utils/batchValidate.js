const zod = require("zod");

const zodObjectId = zod.string().regex(/^[a-f0-9]{24}$/, "Invalid ObjectId");

const validateBatchSchema = zod.object({
  title: zod.string().min(5, "Title must be atleast 5 characters"),
  unit_id: zodObjectId,
  commonData: zod.record(zod.string(), zod.string()),
  template_id: zod.string().min(1, "Template ID is required"),
  users: zod.array(zodObjectId).min(1, "Atl east 1 user must be associated."),
});

module.exports = {
  validateBatchSchema,
  zodObjectId,
};
