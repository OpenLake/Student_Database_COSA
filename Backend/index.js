const express = require("express");
require("dotenv").config();
// eslint-disable-next-line node/no-unpublished-require
const cors = require("cors");
const routes_auth = require("./routes/auth");
const routes_general = require("./routes/route");
const session = require("express-session");
const bodyParser = require("body-parser");
const { connectDB } = require("./db");
const myPassport = require("./models/passportConfig"); // Adjust the path accordingly
const routes_tenure = require("./routes/tenureRoutes.js");
const onboardingRoutes = require("./routes/onboarding.js");
const profileRoutes = require("./routes/profile.js");
const feedbackRoutes = require("./routes/feedbackRoutes.js");
const eventsRoutes = require("./routes/events.js");
const skillsRoutes = require("./routes/skillsRoutes.js");
const achievementsRoutes = require("./routes/achievements.js");
const positionsRoutes = require("./routes/positionRoutes.js");
const app = express();
app.use(cors({ origin: process.env.FRONTEND_URL, credentials: true }));

// Connect to MongoDB
connectDB();

app.use(bodyParser.json());

app.use(
  session({
    secret: "keyboard cat",
    resave: false,
    saveUninitialized: false,
  }),
);

app.use(myPassport.initialize());
app.use(myPassport.session());

// app.get("/", (_req, res) => {
//   res.redirect(process.env.FRONTEND_URL);
// });

// Mount your route handlers
app.use("/", routes_general);
app.use("/auth", routes_auth);
app.use("/tenure", routes_tenure);
app.use("/onboarding", onboardingRoutes);
app.use("/profile", profileRoutes);
app.use("/api/feedback", feedbackRoutes);
app.use("/api/events", eventsRoutes);
app.use("/api/skills", skillsRoutes);
app.use("/api/achievements", achievementsRoutes);
app.use("/api/positions", positionsRoutes);
// Start the server
app.listen(process.env.PORT || 8000, () => {
  console.log(`connected to port ${process.env.PORT || 8000}`);
});
