const passport = require("passport");
const LocalStrategy = require("passport-local");
const GoogleStrategy = require("passport-google-oauth20");
//const { User } = require("./student");
const isIITBhilaiEmail = require("../utils/isIITBhilaiEmail");
const getRole = require("../middlewares/getRole");
const { User } = require("./schema");
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
      callbackURL: `${process.env.BACKEND_URL}/auth/google/verify`, // Update with your callback URL
    },
    async (accessToken, refreshToken, profile, done) => {
      // Check if the user already exists in your database
      if (!isIITBhilaiEmail(profile.emails[0].value)) {
        console.log("Google OAuth blocked for: ", profile.emails[0].value);
        return done(null, false, {
          message: "Only @iitbhilai.ac.in emails are allowed.",
        });
      }
      try {
        const user = await User.findOne({ username: profile.emails[0].value });

        if (user) {
          // If user exists, return the user
          return done(null, user);
        }
        // If user doesn't exist, create a new user in your database
        const userRole = await getRole(profile.emails[0].value);
        const newUser = new User({
          username: profile.emails[0].value,
          role: userRole,
          strategy: "google",
          personal_info: {
            name: profile.displayName || "No Name",
            email: profile.emails[0].value,
            profilePic:
              profile.photos && profile.photos.length > 0
                ? profile.photos[0].value
                : "https://www.gravatar.com/avatar/?d=mp",
          },
          onboardingComplete: userRole !== "STUDENT",
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
  done(null, user);
});

passport.deserializeUser(async (userKey, done) => {
  try {
    let user = await User.findById(userKey._id);
    done(null, user);
  } catch (err) {
    done(err);
  }
});

module.exports = passport;
