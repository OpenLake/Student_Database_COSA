const passport = require("passport");
const LocalStrategy = require("passport-local");
const GoogleStrategy = require("passport-google-oauth20");
const { User } = require("../models/user.model");

// Local Strategy
passport.use(
  new LocalStrategy(
    {
      usernameField: "email",
    },
    User.authenticate(),
  ),
);

// Google OAuth Strategy
passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: `${process.env.BACKEND_URL}/api/auth/google/verify`,
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        const user = await User.findOne({ username: profile.emails[0].value });

        if (user) {
          return done(null, user);
        }

        const newUser = new User({
          username: profile.emails[0].value,
          name: profile.displayName,
          strategy: "google",
        });

        await newUser.save();
        return done(null, newUser);
      } catch (error) {
        return done(error);
      }
    },
  ),
);

passport.serializeUser((user, done) => {
  done(null, {
    _id: user._id,
    role: user.role,
  });
});

passport.deserializeUser(async (userKey, done) => {
  try {
    const user = await User.findById(userKey._id).select(
      "_id role name ID_No username",
    );
    done(null, user);
  } catch (err) {
    done(err);
  }
});

module.exports = passport;
