const RoomRequest = require("../models/room.model");

// Submit room request
const submitRoomRequest = async (req, res) => {
  try {
    const request = new RoomRequest(req.body, { user_id: req.user._id });
    await request.save();
    res.send({ message: "Request submitted", request });
  } catch (error) {
    res.status(500).send({ error: "Error submitting request" });
  }
};

// Get all room requests
const getAllRoomRequests = async (_req, res) => {
  try {
    const requests = await RoomRequest.find().populate("user_id", "name");
    res.send(
      requests.map((request) => ({
        id: request._id,
        user: request.user_id.name,
        date: request.date,
        time: request.time,
        room: request.room,
        description: request.description,
        status: request.status,
      })),
    );
  } catch (error) {
    res.status(500).send({ error: "Error fetching requests" });
  }
};

// Update room request status
const updateRoomRequestStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    await RoomRequest.findByIdAndUpdate(id, { status });
    res.send({ message: "Status updated" });
  } catch (error) {
    res.status(500).send({ error: "Error updating status" });
  }
};

module.exports = {
  submitRoomRequest,
  getAllRoomRequests,
  updateRoomRequestStatus,
};
