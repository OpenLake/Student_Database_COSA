const Template = require("../models/templateSchema");

// GET /api/templates
async function getTemplates(req, res) {
  try {
    const templates = await Template.find()
      .populate({
        path: "createdBy",
        select: "personal_info",
      })
      .sort({ createdAt: -1 });

    return res.status(200).json({
      message: templates,
    });
  } catch (err) {
    return res.status(500).json({
      message: err.message,
    });
  }
}

// GET /api/templates/:id
async function getTemplate(req, res) {
  try {
    const { id } = req.params;

    const template = await Template.findById(id).populate({
      path: "createdBy",
      select: "personal_info",
    });

    if (!template) {
      return res.status(404).json({
        message: "Template not found",
      });
    }

    return res.status(200).json({
      message: template,
    });
  } catch (err) {
    return res.status(500).json({
      message: err.message,
    });
  }
}

// POST /api/templates
async function createTemplate(req, res) {
  try {
    const {
      title,
      description,
      category,
      design,
      status,
    } = req.body;

    if (!title || !category) {
      return res.status(400).json({
        message: "Title and category are required",
      });
    }

    const template = await Template.create({
      title,
      description,
      category,
      design: design || "default.html",
      status: status || "Draft",
      createdBy: req.user._id,
    });

    return res.status(201).json({
      message: template,
    });
  } catch (err) {
    return res.status(500).json({
      message: err.message,
    });
  }
}

// PATCH /api/templates/:id
async function updateTemplate(req, res) {
  try {
    const { id } = req.params;

    const template = await Template.findById(id);

    if (!template) {
      return res.status(404).json({
        message: "Template not found",
      });
    }

  const ALLOWED_FIELDS = [
  "title",
  "description",
  "category",
  "design",
  "status",
];

ALLOWED_FIELDS.forEach((field) => {
  if (req.body[field] !== undefined) {
    template.set(field, req.body[field]);
  }
});


    await template.save();

    return res.status(200).json({
      message: template,
    });
  } catch (err) {
    return res.status(500).json({
      message: err.message,
    });
  }
}

// DELETE /api/templates/:id
async function deleteTemplate(req, res) {
  try {
    const { id } = req.params;

    const template = await Template.findById(id);

    if (!template) {
      return res.status(404).json({
        message: "Template not found",
      });
    }

    await template.deleteOne();

    return res.status(200).json({
      message: "Template deleted successfully",
    });
  } catch (err) {
    return res.status(500).json({
      message: err.message,
    });
  }
}

module.exports = {
  getTemplates,
  getTemplate,
  createTemplate,
  updateTemplate,
  deleteTemplate,
};