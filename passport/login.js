var LocalStrategy = require('passport-local').Strategy;

module.exports = function (passport) {
  passport.use('login', new LocalStrategy({
    passReqToCallback: true,
  },
  function (req, username, password, done) {
    console.log(username, password);
    done(null, { _id: '1234' });
  }));
};
