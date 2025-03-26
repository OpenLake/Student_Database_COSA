const express = require("express");
require("dotenv").config();
// eslint-disable-next-line node/no-unpublished-require
const cors = require("cors");
const session = require("express-session");
const bodyParser = require("body-parser");
const { connectDB } = require("./config/database");
const passport = require("./config/passport");
const seedDefaultRoles = require("./config/default_role");

// Import routes
const authRoutes = require("./routes/auth.routes");
const generalRoutes = require("./routes/general.routes");
const tenureRoutes = require("./routes/tenure.routes");
const skillRoutes = require("./routes/skill.routes");
const eventRoutes = require("./routes/events.routes");
const roomRoutes = require("./routes/room.routes");
const feedbackRoutes = require("./routes/feedback.routes");
const { default: mongoose } = require("mongoose");

// Parse command-line arguments
const args = process.argv.slice(2);
const shouldSeedRoles = args.includes("--seed-roles");

const app = express();
// Connect to MongoDB
(async () => {
  try {
    await connectDB();
    mongoose.connection.once("open", async () => {
      console.log("✅ MongoDB Connected Successfully");
      if (shouldSeedRoles) {
        console.log("Seeding default roles...");
        await seedDefaultRoles();
      }
    });
  } catch (error) {
    console.error("Database connection failed:", error);
    process.exitCode = 1;
  }
})();

// Configure CORS
app.use(
  cors({
    origin: [
      process.env.FRONTEND_URL,
      "http://localhost:3000",
      "http://127.0.0.1:3000",
    ],
    credentials: true,
    exposedHeaders: ["set-cookie", "Access-Control-Allow-Origin"],
  }),
);

// Middleware
app.use(bodyParser.json());
app.use(
  session({
    secret: process.env.SESSION_SECRET || "keyboard cat",
    resave: false,
    saveUninitialized: false,
  }),
);

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", process.env.FRONTEND_URL);
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept",
  );
  next();
});

// Initialize passport
app.use(passport.initialize());
app.use(passport.session());

// Home route
app.get("/", (_req, res) => {
  res.redirect(process.env.FRONTEND_URL);
});

// Mount route handlers
app.use("/api/auth", authRoutes);
app.use("/api/student", generalRoutes);
app.use("/api/tenure", tenureRoutes);
app.use("/api/skills", skillRoutes);
app.use("/api/events", eventRoutes);
app.use("/api/rooms", roomRoutes);
app.use("/api/feedback", feedbackRoutes);

// Error handling middleware
app.use((req, res, _, err) => {
  console.error(err.stack);
  res.status(500).json({ error: "Internal Server Error" });
});

// Start the server
const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
