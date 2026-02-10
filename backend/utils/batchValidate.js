const zod = require("zod");

const zodObjectId = zod.string().regex(/^[a-f0-9]{24}$/, "Invalid ObjectId");

const validateBatchSchema = zod.object({
  title: zod.string().min(5, "Title is required"),
  unit_id: zodObjectId,
  commonData: zod.record(zod.string(), zod.string()),
  template_id: zod.string(),
  users: zod.array(zodObjectId).min(1, "Atleast 1 user must be associated."),
});

module.exports = {
  validateBatchSchema,
  zodObjectId,
};
