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
const app = express();
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
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", process.env.FRONTEND_URL);
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept",
  );
  next();
});

app.use(myPassport.initialize());
app.use(myPassport.session());

app.get("/", (_req, res) => {
  res.redirect(process.env.FRONTEND_URL);
});

// Mount your route handlers
app.use("/", routes_general);
app.use("/auth", routes_auth);
app.use("/tenure", routes_tenure);

// Start the server
app.listen(process.env.PORT || 8000, () => {
  console.log(`connected to port ${process.env.PORT || 8000}`);
});
