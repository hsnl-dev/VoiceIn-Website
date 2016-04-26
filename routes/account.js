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
    successRedirect: '/account/me',
    failureRedirect: '/account/login',
    failureFlash: false,
  }));

  /* Handle Logout */
  router.get('/signout', (req, res) => {
    req.logout();
    res.redirect('/');
  });

  router.get('/me', isAuthenticated, (req, res, next) => {
    console.log(req.user);
    console.log(req.session);
    User.findOne({ _id: req.session.uuid }, (err, user) => {
      console.log(err, user);
      user.credit = user.credit.toFixed(2);
      res.render('me', { user: user });
    });
  });

  router.post('/me/update', isAuthenticated, (req, res, next) => {
    let payload = req.body;
    User.findOneAndUpdate({ _id: req.session.uuid }, payload, {}, (err) => {
      if (!err) {
        res.redirect('/account/me');
      } else {
        res.redirect('/account/me');
      }
    });
  });

  return router;
};
