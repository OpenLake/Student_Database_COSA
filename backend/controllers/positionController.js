const { Position, PositionHolder } = require("../models/schema");
const { v4: uuidv4 } = require("uuid");

// POST for adding a new position
exports.addPosition = async (req, res) => {
    try {
        const {
            title,
            unit_id,
            position_type,
            responsibilities,
            description,
            position_count,
            requirements,
        } = req.body;

        // Validation
        if (!title || !unit_id || !position_type) {
            return res.status(400).json({ error: "Missing required fields" });
        }

        const newPosition = new Position({
            position_id: uuidv4(),
            title,
            unit_id,
            position_type,
            responsibilities,
            description,
            position_count,
            requirements,
        });

        await newPosition.save();
        res.status(201).json(newPosition);
    } catch (error) {
        console.error("Error adding position:", error);
        res.status(500).json({ error: "Server error" });
    }
};

// for getting all the position
exports.getAllPositions = async (req, res) => {
    try {
        const positions = await Position.find().populate(
            "unit_id",
            "name category contact_info.email",
        );
        res.json(positions);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Error fetching positions." });
    }
};

//add position holder
exports.addPositionHolder = async (req, res) => {
    try {
        const {
            user_id,
            position_id,
            tenure_year,
            appointment_details,
            performance_metrics,
            status,
        } = req.body;
        if (!user_id || !position_id || !tenure_year) {
            return res.status(400).json({ message: "Missing required fields." });
        }

        // Step 1: Fetch the position to get the position_count
        const position = await Position.findById(position_id);
        if (!position) {
            return res.status(404).json({ message: "Position not found." });
        }

        // Step 2: Count how many holders already exist for this position and tenure
        const existingCount = await PositionHolder.countDocuments({
            position_id,
            tenure_year,
        });

        if (existingCount >= position.position_count) {
            return res.status(400).json({
                message: `Maximum position holders (${position.position_count}) already appointed for the year ${tenure_year}.`,
            });
        }

        console.log(req.body);
        const newPH = new PositionHolder({
            por_id: uuidv4(),
            user_id,
            position_id,
            tenure_year,
            appointment_details:
                appointment_details &&
                    (appointment_details.appointed_by ||
                        appointment_details.appointment_date)
                    ? appointment_details
                    : undefined,
            performance_metrics: {
                events_organized:
                    performance_metrics &&
                        performance_metrics.events_organized !== undefined
                        ? performance_metrics.events_organized
                        : 0,
                budget_utilized:
                    performance_metrics &&
                        performance_metrics.budget_utilized !== undefined
                        ? performance_metrics.budget_utilized
                        : 0,
                feedback:
                    performance_metrics && performance_metrics.feedback
                        ? performance_metrics.feedback.trim()
                        : undefined,
            },
            status,
        });

        const saved = await newPH.save();
        res.status(201).json(saved);
    } catch (err) {
        console.error("Error adding position holder:", err);
        res.status(500).json({ message: "Internal server error" });
    }
};

// Get all position holders
exports.getAllPositionHolders = async (req, res) => {
    try {
        const positionHolders = await PositionHolder.find()
            .populate("user_id", "personal_info.name user_id username")
            .populate({
                path: "position_id",
                select: "title unit_id position_type",
                populate: {
                    path: "unit_id",
                    select: "name",
                },
            })
            .populate(
                "appointment_details.appointed_by",
                "personal_info.name username user_id",
            );

        res.json(positionHolders);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Error fetching position holders." });
    }
};

// Get positions  by id
exports.getPositionHoldersByUserId = async (req, res) => {
    const userId = req.params.userId;
    try {
        const positionHolder = await PositionHolder.find({ user_id: userId })
            .populate({
                path: "position_id",
                populate: {
                    path: "unit_id",
                    model: "Organizational_Unit",
                },
            })
            .populate("appointment_details.appointed_by");
        res.json(positionHolder);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Error fetching position holder." });
    }
};
