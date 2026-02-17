const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const LocalStrategy = require("passport-local").Strategy;
const isIITBhilaiEmail = require("../utils/isIITBhilaiEmail");
const User = require("../models/userSchema");
const { loginValidate } = require("../utils/authValidate");
const bcrypt = require("bcrypt");
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
      const email = profile.emails?.[0]?.value;  
      if (!email) {  
        return done(null, false, { message: "Email not available from Google." });  
      }  
      if (!isIITBhilaiEmail(profile.emails[0].value)) {
        console.log("Google OAuth blocked for: ", profile.emails[0].value);
        return done(null, false, {
          message: "Only @iitbhilai.ac.in emails are allowed.",
        });
      }
      try {
        const user = await User.findOne({ username: email });

        if (user) {
          // If user exists, return the user
          return done(null, user);
        }
        // If user doesn't exist, create a new user in your database
        const newUser = await User.create({
          username: email,
          role: "STUDENT",
          strategy: "google",
          personal_info: {
            name: profile.displayName || "No Name",
            email: email,
            profilePic:
              profile.photos && profile.photos.length > 0
                ? profile.photos[0].value
                : "https://www.gravatar.com/avatar/?d=mp",
          },
          onboardingComplete: false,
        });

        return done(null, newUser);
      } catch (error) {
        return done(error);
      }
    },
  ),
);

//Local Strategy
passport.use(new LocalStrategy(async (username, password, done) => {
  
  const result = loginValidate.safeParse({ username, password });

  if (!result.success) {
    let errors = result.error.issues.map((issue) => issue.message);
    return done(null, false, {message: errors});
  }

  try{
      
      const user = await User.findOne({ username });
      if (!user) {
        return done(null, false, {message: "Invalid user credentials"});
      }
      

      if (user.strategy !== "local" || !user.password) {
          return done(null, false, { message: "Invalid login method" });
      }

      const isValid = await bcrypt.compare(password, user.password);
      if (!isValid) {
        return done(null, false, { message: "Invalid user credentials" });
      }
      

      return done(null, user);
  }catch(err){
    return done(err);
  }

}));


//When login succeeds this will run 
// serialize basically converts user obj into a format that can be transmitted(like a string, etc...)
// here take user obj and done callback and store only userId in session 
passport.serializeUser((user, done) => {
  done(null, user._id.toString());
});

//When a request comes in, take the stored id, fetch full user from DB, and attach it to req.user.
passport.deserializeUser(async (id, done) => {
  try {
    let user = await User.findById(id);
    if(!user) return done(null, false);
    done(null, user);
  } catch (err) {
    done(err, null);
  }
});

module.exports = passport;
