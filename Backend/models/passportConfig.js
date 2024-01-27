const passport = require("passport");
const LocalStrategy = require("passport-local");
const GoogleStrategy = require("passport-google-oauth20");
const { User } = require("./student");

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
      clientID:
        "468147803346-55rcefrkn5d8ecv0oemb8ppff86mcfvk.apps.googleusercontent.com",
      clientSecret: "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",
      callbackURL: "http://localhost:8000/auth/google/verify", // Update with your callback URL
    },
    async (accessToken, refreshToken, profile, done) => {
      // Check if the user already exists in your database
      try {
        const user = await User.findOne({ username: profile.emails[0].value });

        if (user) {
          // If user exists, return the user
          return done(null, user);
        }

        // If user doesn't exist, create a new user in your database
        const newUser = new User({
          username: profile.emails[0].value,
          name: profile.displayName,
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
  let key = {
    id: user._id,
    type: "User",
  };

  if (user.googleId) {
    key = {
      id: user.googleId,
      type: "Google",
    };
  }

  done(null, key);
});

passport.deserializeUser(async (key, done) => {
  try {
    let user = null;

    if (key.type === "Google") {
      user = await User.findOne({ googleId: key.id });
    } else {
      user = await User.findById(key.id);
    }

    done(null, user);
  } catch (err) {
    done(err);
  }
});

module.exports = passport;
