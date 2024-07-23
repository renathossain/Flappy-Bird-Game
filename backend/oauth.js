import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import dotenv from 'dotenv';
import { User } from './models/users.js';
dotenv.config();

passport.use(new GoogleStrategy({
  clientID: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  callbackURL: "http://localhost:3000/auth/google/callback",
  passReqToCallback: true
},
  async function (request, accessToken, refreshToken, profile, done) {
    try {
      // Find user
      let user = await User.findOne({ where: { id: profile.id } });

      const userData = {
        id: profile.id,
        email: profile.emails[0].value,
        displayName: profile.displayName,
        familyName: profile.name.familyName,
        givenName: profile.name.givenName,
        photo: profile.photos[0].value
      };

      // Check if user exists
      if (user) {
        // Update existing user
        user = await user.update(userData);
      } else {
        // Create new user
        user = await User.create(userData);
      }

      return done(null, profile);
    } catch (err) {
      return done(err, null);
    }
  }
));

passport.serializeUser(function (user, done) {
  done(null, user);
});

passport.deserializeUser(function (user, done) {
  done(null, user);
});