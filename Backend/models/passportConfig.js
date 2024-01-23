// models/passportConfig.js
const passport = require("passport");
const LocalStrategy = require("passport-local");
// const GoogleStrategy = require("passport-google-oauth20").Strategy;
const { User } = require("./student");

passport.use(
  new LocalStrategy(
    {
      usernameField: "email",
    },
    User.authenticate(),
  ),
);

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// Google OAuth Strategy
// passport.use(
//   new GoogleStrategy(
//     {
//       clientID: " ",
//       clientSecret:"",
//       callbackURL: "", // Update with your callback URL
//     },
//     async (accessToken, refreshToken, profile, done) => {
//       // Check if the user already exists in your database
//       try {
//         const user = await User.findOne({ googleId: profile.id });

//         if (user) {
//           // If user exists, return the user
//           return done(null, user);
//         }

//         // If user doesn't exist, create a new user in your database
//         const newUser = new User({
//           googleId: profile.id,
//           email: profile.emails[0].value,
//           // Add other necessary fields as needed
//         });

//         await newUser.save();
//         return done(null, newUser);
//       } catch (error) {
//         return done(error);
//       }
//     }
//   )
// );

// passport.serializeUser((user, done) => {
//   done(null, user.id);
// });

// passport.deserializeUser(async (id, done) => {
//   try {
//     const user = await User.findById(id);
//     done(null, user);
//   } catch (err) {
//     done(err);
//   }
// });

module.exports = passport;
