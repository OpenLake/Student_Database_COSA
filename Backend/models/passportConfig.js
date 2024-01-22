// models/passportConfig.js
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const User = require("./student");

// Local Strategy
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
    }
  )
);

// Google OAuth Strategy
passport.use(
  new GoogleStrategy(
    {
      clientID: " ",
      clientSecret:"",
      callbackURL: "", // Update with your callback URL
    },
    async (accessToken, refreshToken, profile, done) => {
      // Check if the user already exists in your database
      try {
        const user = await User.findOne({ googleId: profile.id });

        if (user) {
          // If user exists, return the user
          return done(null, user);
        }

        // If user doesn't exist, create a new user in your database
        const newUser = new User({
          googleId: profile.id,
          email: profile.emails[0].value,
          // Add other necessary fields as needed
        });

        await newUser.save();
        return done(null, newUser);
      } catch (error) {
        return done(error);
      }
    }
  )
);

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser((id, done) => {
  User.findById(id, (err, user) => {
    done(err, user);
  });
});

module.exports = passport;
