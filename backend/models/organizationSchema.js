const mongoose = require("mongoose");

//organizational unit
const organizationalUnitSchema = new mongoose.Schema({
  unit_id: {
    type: String,
    required: true,
    unique: true,
  },
  name: {
    type: String,
    required: true,
    unique: true,
  },
  type: {
    type: String,
    enum: ["Council", "Club", "Committee", "independent_position"],
    required: true,
  },
  description: {
    type: String,
  },
  parent_unit_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Organizational_Unit",
    default: null,
  },
  hierarchy_level: {
    type: Number,
    required: true,
  },
  category: {
    type: String,
    enum: ["cultural", "scitech", "sports", "academic", "independent"],
    required: true,
  },
  is_active: {
    type: Boolean,
    default: true,
  },
  contact_info: {
    email: {
      type: String,
      required: true,
      unique: true,
    },
    social_media: [
      {
        platform: {
          type: String,
          required: true,
        },
        url: {
          type: String,
          required: true,
        },
      },
    ],
  },
  budget_info: {
    allocated_budget: {
      type: Number,
      default: 0,
    },
    spent_amount: {
      type: Number,
      default: 0,
    },
  },
}, {timestamps: true});

const OrganizationalUnit = mongoose.model(
  "Organizational_Unit",
  organizationalUnitSchema,
);

module.exports = OrganizationalUnit;
