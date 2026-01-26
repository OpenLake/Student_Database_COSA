const express = require("express");
const router = express.Router();
const { PositionHolder } = require("../models/schema");

router.get("/current", async (req, res) => {
  try {
    const activeHolders = await PositionHolder.find({ status: "active" })
      .populate({
        path: "user_id",
        select:
          "personal_info.name personal_info.profilePic personal_info.email",
      })
      .populate({
        path: "position_id",
        select: "title unit_id",
        populate: {
          path: "unit_id",
          select: "name type category parent_unit_id",
        },
      });

    const groupedData = {};

    activeHolders.forEach((holder) => {
      if (
        !holder.position_id ||
        !holder.position_id.unit_id ||
        !holder.user_id
      ) {
        return;
      }

      const unit = holder.position_id.unit_id;
      const unitName = unit.name;

      if (!groupedData[unitName]) {
        groupedData[unitName] = {
          unit_info: unit,
          members: [],
        };
      }

      groupedData[unitName].members.push({
        holder_id: holder._id,
        user: holder.user_id,
        position_title: holder.position_id.title,
        tenure_year: holder.tenure_year,
      });
    });

    res.json(groupedData);
  } catch (error) {
    console.error("Error fetching current PORs:", error);
    res.status(500).json({ message: "Server Error", error: error.message });
  }
});

module.exports = router;
