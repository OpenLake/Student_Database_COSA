const Template = require("../models/templateSchema");
const { HttpError } = require("../utils/httpError");

async function findTemplate(id) {
  const template = await Template.findById(id);
  if (!template) throw new HttpError(400, "Selected template doesn't exist");
  return template;
}

module.exports = {
    findTemplate
}