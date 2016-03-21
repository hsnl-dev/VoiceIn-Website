'use strict';
const express = require('express');
const router = express.Router();
const fetch = require('isomorphic-fetch');
const request = require('request').defaults({ encoding: null });
const api = require('../config/api-url');

let headers = {
  apiKey: process.env.apiKey,
  'Content-Type': 'application/json',
};

router.get('/', (req, res, next) => {
  let qrCodeUuid = req.query.id;
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
        if (!error && response.statusCode === 200) {
          let base64data = 'data:' + response.headers['content-type'] + ';base64,' + new Buffer(body).toString('base64');
          userData.image = base64data;
          userData.qrCodeUuid = qrCodeUuid;
          res.render('provider-information', userData);
        }
      });
    });
});

// This route deals with adding new icon.
router.post('/add/:qrCodeUuid', (req, res, next) => {
  let qrCodeUuid = req.params.qrCodeUuid;
  let payload = JSON.stringify(req.body);

  fetch(`${api.apiRoute}/${api.latestVersion}/icons`, {
    method: 'POST',
    headers: headers,
    body: payload,
  }).then(res => {
    console.log(res.status);
    if (res.status >= 400) {
      //TODO Error Handling.
      return res;
    } else {
      return res.json();
    }
  }).then(response => {
    if (response.iconId !== 'undefined') {
      console.log(response.iconId);
      res.send(response);
    } else {
      res.status(response.status);
      res.send('');
    }

  });
});

module.exports = router;
