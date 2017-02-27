const passport = require('passport-jwt');
const JwtStrategy = passport.Strategy;
const ExtractJwt = passport.ExtractJwt;

const Users = require('../models/users');
const db_config = require('../configs/database');

module.exports = (passport) => {
  let opts = {};
  opts.jwtFromRequest = ExtractJwt.fromAuthHeader();
  opts.secretOrKey = db_config.secret;

  passport.use(new JwtStrategy(opts, (jwt_payload, done) => {
    Users.getUserById(jwt_payload._doc._id, (err, user) => {
      if (err) {
        return done(err, false);
      }

      if (user) {
        return done(null, user);
      } else {
        return done(null, false);
      }
    });
  }));
};