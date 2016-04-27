'use strict';
const express = require('express');
const router = express.Router();
const User = require('../models/user');
const request = require('request').defaults({ encoding: null });
const api = require('../config/api-url');

let headers = {
  apiKey: process.env.apiKey,
  'Content-Type': 'application/json',
};

const isAuthenticated = (req, res, next) => {
  if (req.isAuthenticated()) {
    return next();
  }

  res.redirect('/account/login');
};

module.exports = (passport) => {

  /* GET login page. */
  router.get('/login', (req, res) => {
    console.log(req);
    res.render('login', { message: req.flash('message') });
  });

  /* Handle Login POST */
  router.post('/loginRequest', passport.authenticate('login', {
    successRedirect: '/account/me',
    failureRedirect: '/account/login',
    failureFlash: true,
  }));

  /* Handle Logout */
  router.get('/signout', (req, res) => {
    req.logout();
    res.redirect('/');
  });

  router.get('/me', isAuthenticated, (req, res, next) => {
    console.log(req.user);
    console.log(req.session);
    User.findOne({ _id: req.user.id }, (err, user) => {
      console.log(err, user);

      let options = {
        url: `${api.apiRoute}/${api.latestVersion}/avatars/${user.profilePhotoId}?size=mid`,
        headers: headers,
      };
      let image = '';

      // get the user's avatars and response.
      request.get(options, (error, response, body) => {
        if (!error && response.statusCode == 200) {
          let base64data = 'data:' + response.headers['content-type'] + ';base64,' + new Buffer(body).toString('base64');
          image = base64data;
          user.credit = user.credit.toFixed(2);
          res.render('me', { user: user, image: image });
        }
      });

    });
  });

  router.post('/me/update', isAuthenticated, (req, res, next) => {
    let payload = req.body;
    User.findOneAndUpdate({ _id: req.user.id }, payload, {}, (err) => {
      if (!err) {
        res.redirect('/account/me');
      } else {
        res.redirect('/account/me');
      }
    });
  });

  return router;
};
