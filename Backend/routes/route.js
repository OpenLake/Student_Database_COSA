const express = require("express");
const router = express.Router();

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

// Update request status
// const authenticatePresident = (req, res, next) => {
//   // if (req.user.role !== "president") {
//   //   return res.status(403).send({ message: "Unauthorized" });
//   // }
//   next();
// };

module.exports = router;
