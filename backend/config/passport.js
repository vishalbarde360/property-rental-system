const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const User = require("../models/User");

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: process.env.GOOGLE_CALLBACK_URL,
    },

    async (accessToken, refreshToken, profile, done) => {
      try {
        const email = profile.emails?.[0]?.value?.toLowerCase();

        if (!email) {
          return done(new Error("Google account email not available"));
        }

        let user = await User.findOne({ email });

        // Existing user
        if (user) {
          if (user.status === "disabled") {
            return done(new Error("Account disabled"));
          }

          if (!user.googleId) {
            user.googleId = profile.id;
          }

          user.authProvider = "google";

          if (!user.profileImage && profile.photos?.[0]?.value) {
            user.profileImage = profile.photos[0].value;
          }

          await user.save();

          return done(null, user);
        }

        // New Google user
        user = await User.create({
          name: profile.displayName,
          email,
          googleId: profile.id,
          authProvider: "google",
          profileImage: profile.photos?.[0]?.value,
          role: "tenant",
        });

        return done(null, user);
      } catch (error) {
        return done(error, null);
      }
    }
  )
);

module.exports = passport;