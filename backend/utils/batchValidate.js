const zod = require("zod");

const zodObjectId = zod.string().regex(/^[0-9a-zA-Z]{24}$/, "Invalid ObjectId");

const validateBatchSchema = zod.object({
  title: zod.string().min(5, "Title should be atleast 5 characters"),
  eventId: zodObjectId,
  templateId: zodObjectId,
  signatoryDetails: zod
    .array(
      zod.object({
        name: zod.string().min(3, "Name must be atleast 5 characters"),
        signature: zod.string().optional(),
        role: zod.string().min(1, "Invalid position"),
      }),
    )
    .nonempty("At least one signatory is required"),
  users: zod.array(zodObjectId).min(1, "Atleast 1 user must be associated."),
});

const validateBatchUsersIds = zod
  .array(zodObjectId)
  .nonempty("At least 1 participant is required");

module.exports = {
  validateBatchSchema,
  zodObjectId,
  validateBatchUsersIds,
};
