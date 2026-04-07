const Template = require("../models/templateSchema");
const { HttpError } = require("../utils/httpError");
const mongoose = require("mongoose"); 

async function findTemplate(id) {

  if (!mongoose.Types.ObjectId.isValid(id)) {  
    throw new HttpError(400, "Invalid template ID format");  
  } 

  const template = await Template.findById(id);
  if (!template) throw new HttpError(404, "Selected template doesn't exist");
  return template;
}

module.exports = {
    findTemplate
}