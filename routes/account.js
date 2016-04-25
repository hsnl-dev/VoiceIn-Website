const express = require('express');
const router = express.Router();

const isAuthenticated = function (req, res, next) {
  // if user is authenticated in the session, call the next() to call the next request handler
  // Passport adds this method to request object. A middleware is allowed to add properties to
  // request and response objects
  if (req.isAuthenticated()) {
    return next();
  }

  // if the user is not authenticated then redirect him to the login page
  res.redirect('/');
};

module.exports = function (passport) {

  /* GET login page. */
  router.get('/login', function (req, res) {
    res.render('login', {});
  });

  /* Handle Login POST */
  router.post('/loginRequest', passport.authenticate('login', {
    successRedirect: '/',
    failureRedirect: '/account/login',
    failureFlash: false,
  }));

  /* Handle Logout */
  router.get('/signout', function (req, res) {
    req.logout();
    res.redirect('/');
  });

  return router;
};
