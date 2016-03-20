'use strict';
const express = require('express');
const router = express.Router();
const fetch = require('isomorphic-fetch');
const request = require('request').defaults({ encoding: null });
const api = require('../config/api-url');

router.get('/', function (req, res, next) {
  let qrCodeUuid = req.query.id;
  let headers = {
    apiKey: process.env.apiKey,
    'Content-Type': 'application/json',
  };

  /**
    Get providers' information.
  **/
  fetch(`${api.apiRoute}/${api.latestVersion}/providers/${qrCodeUuid}`, {
    headers: headers,
  })
    .then(res => {
      return res.json();
    })
    .then(userData => {
      let options = {
        url: `${api.apiRoute}/${api.latestVersion}/avatars/${userData.avatarId}?size=mid`,
        headers: headers,
      };

      // get the user's avatars and response.
      request.get(options, (error, response, body) => {
        if (!error && response.statusCode == 200) {
          let base64data = 'data:' + response.headers['content-type'] + ';base64,' + new Buffer(body).toString('base64');
          userData.image = base64data;
          res.render('qrcode', userData);
        }
      });
    });
});

module.exports = router;
