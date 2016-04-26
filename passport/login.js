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
    let phoneNumber = req.body.phoneNumber;

    let payload = JSON.stringify({
      code: password,
      phoneNumber: `+886${phoneNumber}`,
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
        }

        console.log(res);
        return res.json();
      })
      .then(userData => {
        console.log(userData);
        done(null, { _id: req.session.uuid });

      })
      .catch((error) => {
        console.error(error);
        done(err);
      });
  }));
};
