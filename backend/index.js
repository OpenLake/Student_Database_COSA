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
const onboardingRoutes = require("./routes/onboarding.js");
const profileRoutes = require("./routes/profile.js");
const feedbackRoutes = require("./routes/feedbackRoutes.js");
const eventsRoutes = require("./routes/events.js");
const skillsRoutes = require("./routes/skillsRoutes.js");
const achievementsRoutes = require("./routes/achievements.js");
const positionsRoutes = require("./routes/positionRoutes.js");
const organizationalUnitRoutes = require("./routes/orgUnit.js");
const announcementRoutes = require("./routes/announcements.js");
const dashboardRoutes = require("./routes/dashboard.js");

const analyticsRoutes = require("./routes/analytics.js");
const porRoutes = require("./routes/por.js");
const budgetRoutes = require("./routes/budget.js");
const roomBookingRoutes = require("./routes/roomBooking.js");
const certificateRoutes = require("./routes/certificate");
const certificateBatchRoutes = require("./routes/certificateBatch");
const templateRoutes = require("./routes/template");


const MongoDBStore = require("connect-mongodb-session")(session);

const app = express();

const isHostedOverHttps =
  (process.env.FRONTEND_URL || "").startsWith("https://") ||
  process.env.NODE_ENV === "production";

if (isHostedOverHttps) {
  // Required behind Render's proxy, otherwise `secure` cookies are never sent.
  app.set("trust proxy", 1);
}

app.use(cors({ origin: process.env.FRONTEND_URL, credentials: true }));

// Connect to MongoDB
connectDB();

app.use(bodyParser.json());

if (!process.env.SESSION_SECRET) {
  throw new Error("SESSION_SECRET environment variable is required");
}

if (!process.env.JWT_SECRET_TOKEN) {
  throw new Error("JWT_SECRET_TOKEN environment variable is required");
}

const sessionStore = new MongoDBStore({
  uri: process.env.MONGODB_URI,
  collection: "sessions",
});

sessionStore.on("error", (error) => {
  console.error("Session store error:", error);
});

app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    store: sessionStore,
    cookie: {
      secure: isHostedOverHttps, // HTTPS only when hosted
      sameSite: isHostedOverHttps ? "none" : "lax", // cross-site when hosted
      maxAge: 7 * 24 * 60 * 60 * 1000,
    },
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
app.use("/onboarding", onboardingRoutes);
app.use("/profile", profileRoutes);
app.use("/api/certificates", certificateRoutes);
app.use("/api/batches", certificateBatchRoutes);
app.use("/api/templates", templateRoutes);
app.use("/api/feedback", feedbackRoutes);
app.use("/api/events", eventsRoutes);
app.use("/api/skills", skillsRoutes);
app.use("/api/achievements", achievementsRoutes);
app.use("/api/positions", positionsRoutes);
app.use("/api/orgUnit", organizationalUnitRoutes);
app.use("/api/announcements", announcementRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/analytics", analyticsRoutes);
app.use("/api/rooms", roomBookingRoutes);
app.use("/api/por", porRoutes);
app.use("/api/budget", budgetRoutes);

// Start the server
app.listen(process.env.PORT || 8000, () => {
  console.log(`connected to port ${process.env.PORT || 8000}`);
});
