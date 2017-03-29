const passport = require('passport');
const User = require('../models/user');
const config = require('../config');
const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
const LocalStrategy = require('passport-local');

// Set up for options for JWT Strategy.
const jwtOptions = {
  jwtFromRequest: ExtractJwt.fromHeader('authorization'),
  secretOrKey: config.secret
};

// Create Local Strategy
const localOptions = { usernameField: 'email' };
const localLogin = new LocalStrategy({ localOptions }, function(email, password, done) {

});

// Create JWT strategy.
const jwtLogin = new JwtStrategy(jwtOptions, function(payload, done) {
  // See if the user ID in the payload exists in our DB
  // if it does, call 'done' with that other
  // otherwise, call done without a user object
  User.findById(payload.sub, function(err, user) {
    if (err) { return done(err, false); }

    if (user) {
      done(null, user);
    } else {
      done(null, false);
    }

  })
});

// Tell passport to use this strategy.
passport.use(jwtLogin);
