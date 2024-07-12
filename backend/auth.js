import passport from 'passport';
import GoogleStrategy from 'passport-google-oauth20';

//https://www.passportjs.org/packages/passport-google-oauth2/
passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: process.env.GOOGLE_CALLBACK_URL,
    passReqToCallback: true
  },
  function(request, accessToken, refreshToken, profile, done) {
    return done(err, profile)
  }
));