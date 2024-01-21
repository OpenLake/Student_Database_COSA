const express = require("express");
const app = express();
const routes_auth = require("./routes/auth");
const routes_general = require("./routes/route");
const session = require("express-session");
const bodyParser = require("body-parser");
const connectDB = require("./db");
const passport = require("../Backend/models/passportConfig");

require("dotenv").config();

// // Connect to MongoDB
// connectDB();

app.use(bodyParser.json());

app.use(
  session({
    secret: "keyboard cat",
    resave: false,
    saveUninitialized: false,
  }),
);

app.use(passport.initialize());
app.use(passport.session());

// Mount your route handlers
app.use("/", routes_general);
app.use("/auth", routes_auth);

// Start the server
app.listen(process.env.PORT || 8000, () => {
  console.log(`connected to port ${process.env.PORT || 8000}`);
});
