const express = require("express");

const routes_auth = require("./routes/auth");
const routes_general = require("./routes/route");
const session = require("express-session");
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const bodyParser = require("body-parser");
const connectDB = require("./db");
const mongoose = require("mongoose");
const passportLocalMongoose = require("passport-local-mongoose");
var findOrCreate = require("mongoose-findorcreate");
require("dotenv").config();

const userSchema = new mongoose.Schema({
  email: String,
  password: String,
});
const User = mongoose.model("user", userSchema);
userSchema.plugin(passportLocalMongoose); //hash and salt our password and save users in mongoDB database
userSchema.plugin(findOrCreate);
passport.use(
  new LocalStrategy(
    {
      usernameField: "email",
      passwordField: "password",
    },
    (username, password, done) => {
      User.findOne({ email: username }, (err, user) => {
        if (err) {
          return done(err);
        }
        if (!user) {
          return done(null, false, { message: "Incorrect username." });
        }
        if (!user.validPassword(password)) {
          return done(null, false, { message: "Incorrect password." });
        }
        return done(null, user);
      });
    },
  ),
);

// Serialize and deserialize user
passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser((id, done) => {
  User.findById(id, (err, user) => {
    done(err, user);
  });
});

// Initialize Express app
const app = express();

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

// Initialize Passport
app.use(passport.initialize());
app.use(passport.session());

// Mount your route handlers

app.post("/register", async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check if the user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists." });
    }

    // Create a new user
    const newUser = new User({ email });
    await newUser.setPassword(password);
    await newUser.save();

    // Authenticate the user and redirect to a protected route
    req.login(newUser, (err) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ message: "Internal Server Error" });
      }
      return res
        .status(201)
        .json({ message: "Registration successful", user: newUser });
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});
// server.js or your main server file

// ... (Previous imports and configurations)

app.post("/login", passport.authenticate("local"), (req, res) => {
  // If authentication is successful, this function will be called
  res.status(200).json({ message: "Login successful", user: req.user });
});

// Example middleware to protect a route that requires authentication
const isAuthenticated = (req, res, next) => {
  if (req.isAuthenticated()) {
    return next();
  }
  res.status(401).json({ message: "Unauthorized" });
};

// Example protected route
app.get("/protected", isAuthenticated, (req, res) => {
  res.status(200).json({ message: "Protected route", user: req.user });
});

app.use("/", routes_general);
app.use("/auth", routes_auth);

// Start the server
app.listen(process.env.PORT || 8000, () => {
  console.log(`connected to port ${process.env.PORT || 8000}`);
});
