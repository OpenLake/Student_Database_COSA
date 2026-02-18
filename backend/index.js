const express = require("express");
require("dotenv").config();
// eslint-disable-next-line node/no-unpublished-require
const { connectDB } = require("./config/db.js");
const MongoStore = require("connect-mongo");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const routes_auth = require("./routes/auth");
const routes_general = require("./routes/route");
const session = require("express-session");
const myPassport = require("./config/passportConfig.js"); // Adjust the path accordingly
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
const certificateRoutes = require("./routes/certificateRoutes.js");
const app = express();

if (process.env.NODE_ENV === "production") {
  app.set("trust proxy", 1);
}

app.use(cors({ origin: process.env.FRONTEND_URL, credentials: true }));


app.use(cookieParser());

//Replaced bodyParser with express.json() - the new standard
app.use(express.json());

app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: process.env.NODE_ENV === "production", // HTTPS only in prod
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax", // cross-origin in prod
      maxAge: 60*60*1000
    },
    store: MongoStore.create({
      mongoUrl: process.env.MONGODB_URI,
      ttl: 60*60*1000,
      collectionName: "sessions"
    }),
    name: "token"
  }),
);

//Needed to initialize passport and all helper methods to req object
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
app.use("/api/feedback", feedbackRoutes);
app.use("/api/events", eventsRoutes);
app.use("/api/skills", skillsRoutes);
app.use("/api/achievements", achievementsRoutes);
app.use("/api/positions", positionsRoutes);
app.use("/api/orgUnit", organizationalUnitRoutes);
app.use("/api/announcements", announcementRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/analytics", analyticsRoutes);
app.use("/api/certificate-batches", certificateRoutes);

// Start the server

(async function(){
  // Connect to MongoDB
  await connectDB();
  app.listen(process.env.PORT || 5000, () => {
    console.log(`connected to port ${process.env.PORT || 5000}`);
  });
})();
