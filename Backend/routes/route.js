const express = require("express");
const router = express.Router();
//const Event = require("../models/Event");
const RoomRequest = require("../models/RoomRequest");

router.get("/", (req, res) => {
  res.json({
    message: "API is running successfully",
    status: "healthy",
    timestamp: new Date().toISOString(),
    endpoints: {
      feedback: "POST /feedback, GET /feedback, GET /feedback/:userId",
      events: "POST /events, GET /events, DELETE /events/:id",
      rooms:
        "POST /room/request, GET /room/requests, PUT /room/request/:id/status",
      skills: "GET /skills, POST /skills, DELETE /skills/:studentId/:skillId",
      student: "POST /fetch",
    },
  });
});

router.post("/room/request", async (req, res) => {
  try {
    const request = new RoomRequest(req.body);
    await request.save();
    res.send({ message: "Request submitted", request });
  } catch (error) {
    res.status(500).send({ error: "Error submitting request" });
  }
});

// View all booking requests
router.get("/room/requests", async (req, res) => {
  try {
    const requests = await RoomRequest.find();
    res.send(requests);
  } catch (error) {
    res.status(500).send({ error: "Error fetching requests" });
  }
});

// Update request status
const authenticatePresident = (req, res, next) => {
  // if (req.user.role !== "president") {
  //   return res.status(403).send({ message: "Unauthorized" });
  // }
  next();
};

router.put(
  "/room/request/:id/status",
  authenticatePresident,
  async (req, res) => {
    try {
      const { id } = req.params;
      const { status } = req.body;
      await RoomRequest.findByIdAndUpdate(id, { status });
      res.send({ message: "Status updated" });
    } catch (error) {
      res.status(500).send({ error: "Error updating status" });
    }
  },
);

module.exports = router;
