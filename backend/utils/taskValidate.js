const zod = require("zod");
const zodObjectId = zod.string().regex(/^[0-9a-zA-Z]{24}$/, "Invalid ObjectId");

const taskValidate = zod.object({
  title: zod.string().min(5, "Title is required"),
  description: zod.string().min(5, "Description is required"),
  priority: zod.enum(["low", "medium", "high"]),
  deadline: zod.coerce.date(),
  assignees: zod
    .array(zodObjectId)
    .min(1, "Atleast 1 user must be assigned to the task."),
});

module.exports = {
  taskValidate,
  zodObjectId,
};
