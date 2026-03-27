const mongoose = require("mongoose");

const templateSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: {type: String},
    design: {type: String, default: "Default"},
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    category: {
        type: String,
        enum: ["CULTURAL", "TECHNICAL", "SPORTS", "ACADEMIC", "OTHER"],
    },
    status: {
        type: String,
        enum: ["Draft", "Active", "Archived"],
        default: "Draft"
    }
}, {timestamps: true});


module.exports = mongoose.model("Template", templateSchema);