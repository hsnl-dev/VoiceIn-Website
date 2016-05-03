'use strict';
const express = require('express');
const router = express.Router();
const User = require('../models/user');
const request = require('request').defaults({ encoding: null });
const api = require('../config/api-url');
const Allpay = require('allpay');
const uuid = require('node-uuid');
let headers = require('../config/secret').webServiceHeader;
const isProduction = process.env.NODE_ENV === 'production';

let allpay = new Allpay({
  merchantID: isProduction ? '1078967' : '2000132',
  hashKey: isProduction ? 'E0XUrGq721IYK3bx' : '5294y06JbISpM5x9',
  hashIV: isProduction ? 'awM2Qfkk5sF5XwTG' : 'v77hoKGq4kWxNNIS',
  mode: isProduction ? 'production' : 'test',
  debug: true,
});

const isAuthenticated = (req, res, next) => {
  // If not production (sandbox), login directly for convinience.
  if (!isProduction || req.isAuthenticated()) {
    return next();
  }

  res.redirect('/account/login');
};

module.exports = (passport) => {

  /* GET login page. */
  router.get('/login', (req, res) => {
    console.log(req);
    res.render('account/login', { message: req.flash('message') });
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
          res.render('account/me', { user: user, image: image });
        }
      });

    });
  });

  router.get('/card', isAuthenticated, (req, res, next) => {
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
          res.render('account/card', { user: user, image: image });
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

  router.get('/buy', isAuthenticated, (req, res, next) => {
    res.render('account/buy');
  });

  router.post('/buy/allpay', isAuthenticated, (req, res, next) => {
    console.log(req.body);
    console.log(process.env.NODE_ENV);
    console.log(req.session.token);

    let payload = req.body;
    let merchantNo = uuid.v4().split('-')[0].toUpperCase() + uuid.v4().split('-')[4].toUpperCase();
    allpay.aioCheckOut({
      MerchantTradeNo: merchantNo,
      MerchantTradeDate: new Date().toISOString().replace(/T/, ' ').replace(/\..+/, '').replace(/-/g, '/'),
      TotalAmount: payload.points,
      TradeDesc: 'VoiceIn ${payload.points} 點數購買',
      Items: [{
          name: '商品一',
          quantity: '1',
          price: payload.points,
        },
      ],
      ReturnURL: isProduction ? 'https://voice-in.herokuapp.com/account/buy/allpay/success' : 'https://voice-in.herokuapp.com/account/buy/allpay/sandbox',
      ChoosePayment: 'ALL',
    }, function (err, result) {
      //TODO: Save the payment record

      let form = result.html;
      res.send(form).end();
    });

  });

  router.post('/buy/allpay/success', isAuthenticated, (req, res, next) => {
    // { MerchantID: '2000132',
    // MerchantTradeNo: '245A27B010FC11E6',
    // PayAmt: '300',
    // PaymentDate: '2016/05/03 14:57:15',
    // PaymentType: 'Credit_CreditCard',
    // PaymentTypeChargeFee: '8',
    // RedeemAmt: '0',
    // RtnCode: '1',
    // RtnMsg: '交易成功',
    // SimulatePaid: '0',
    // TradeAmt: '300',
    // TradeDate: '2016/05/03 14:55:58',
    // TradeNo: '1605031455581117',
    // CheckMacValue: 'BE6723FCFFB3721B8FA81A6BFF82005A' },

    // TODO: Add points to user if payment is successful.
    console.log(req.body.MerchantTradeNo, req.body.RtnCode);
    res.status(200).end();
  });

  router.post('/buy/allpay/sandbox', (req, res, next) => {
    console.log(req.body.MerchantTradeNo, req.body.RtnCode);
    res.status(200).end();
  });

  router.post('/buy/allpay/fail', isAuthenticated, (req, res, next) => {

  });

  return router;
};
