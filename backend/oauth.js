import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import dotenv from 'dotenv';
import { User, PurchasedSkins } from './models/users.js';
dotenv.config();

passport.use(new GoogleStrategy({
  clientID: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  callbackURL: process.env.CALLBACK_URL,
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
        user = await User.create({
          ...userData,
          currentSkin: 1 // Set default skin ID
        });

        // Assign skins (IDs 1, 2, 3) to the new user
        const skinIds = [1, 2, 3];
        const purchasedSkins = skinIds.map(skinId => ({
          userId: user.id,
          skinId
        }));

        await PurchasedSkins.bulkCreate(purchasedSkins);
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