'use strict';
const LocalStrategy = require('passport-local').Strategy;
const api = require('../config/api-url');

let headers = {
  apiKey: process.env.apiKey,
  'Content-Type': 'application/json',
};

module.exports = function (passport) {
  passport.use('login', new LocalStrategy({
    passReqToCallback: true,
  },
  function (req, username, password, done) {
    console.log(username, password);

    let payload = JSON.stringify({
      code: password,
      phoneNumber: `+886${username}`,
      password: null,
      mode: 'disposablePass',
    });

    console.log(payload);

    fetch(`${api.apiRoute}/${api.latestVersion}/accounts/tokens`, {
      headers: headers,
      method: 'POST',
      body: payload,
    })
      .then(res => {
        if (!res.ok) {
          throw Error(res.statusText);
          done(null, false, req.flash('message', '登入失敗，請確定手機或登入碼正確'));
        }

        console.log(res);
        return res.json();
      })
      .then(userData => {
        console.log(userData);
        req.session.token = userData.token;
        done(null, { _id: req.session.uuid });

      })
      .catch((error) => {
        console.error(error);
        done(null, false, req.flash('message', '登入失敗，請確定手機或登入碼正確'));
      });
  }));
};
