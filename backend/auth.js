import passport from 'passport';
// import GoogleStrategy from 'passport-google-oauth20';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import dotenv from 'dotenv';
// import User from './models/user.js';
import { User } from './models/users.js';
dotenv.config();

//https://www.passportjs.org/packages/passport-google-oauth2/
passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: process.env.GOOGLE_CALLBACK_URL,
    passReqToCallback: true
  },
  async function(request, accessToken, refreshToken, profile, done) {
    try{
      let user = await User.findOne({ where: { googleId: profile.id } });
      if(!user){
        user = await User.create({
          googleId: profile.id,
          name: profile.displayName,
          email: profile.emails[0].value
        });
      }
      return done(null, user);
    }catch(err){
      return done(err, null);
    }
  }
));

passport.serializeUser(function(user, done) { 
  done(null, user.googleId);
});

passport.deserializeUser(function(googleId, done) {
  try{
    const newUser = User.findOne({ where: { googleId: googleId } });
    return done(null, newUser);
  }catch(err){
    return done(err, null);
  }
 
} );