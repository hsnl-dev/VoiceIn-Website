'use strict';
const express = require('express');
const router = express.Router();
const User = require('../models/user');
const isAuthenticated = (req, res, next) => {
  if (req.isAuthenticated()) {
    return next();
  }

  res.redirect('/');
};

module.exports = (passport) => {

  /* GET login page. */
  router.get('/login', (req, res) => {
    res.render('login', {});
  });

  /* Handle Login POST */
  router.post('/loginRequest', passport.authenticate('login', {
    successRedirect: '/',
    failureRedirect: '/account/login',
    failureFlash: false,
  }));

  /* Handle Logout */
  router.get('/signout', (req, res) => {
    req.logout();
    res.redirect('/');
  });

  router.get('/me', (req, res, next) => {
    User.findOne({ _id:'218ba36a-3717-4322-94c8-5847a15c691d' }, (err, user) => {
      console.log(err, user);
      user.credit = user.credit.toFixed(2);
      res.render('me', { user: user });
    });
  });

  router.post('/me/update', (req, res, next) => {
    let payload = req.body;
    User.findOneAndUpdate({ _id:'218ba36a-3717-4322-94c8-5847a15c691d' }, payload, {}, (err) => {
      if (!err) {
        res.redirect('/account/me');
      } else {
        res.redirect('/account/me');
      }
    });
  });

  return router;
};
