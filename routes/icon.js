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

router.get('/:id', (req, res, next) => {
  let iconId = req.params.id;
  console.log(`${api.apiRoute}/${api.latestVersion}/icons/${iconId}`);
  fetch(`${api.apiRoute}/${api.latestVersion}/icons/${iconId}`, {
    headers: headers,
  })
    .then(res => {
      if (!res.ok) {
        throw Error(res.statusText);
      }

      return res.json();
    })
    .then(userData => {
      console.log(userData);

      let options = {
        url: `${api.apiRoute}/${api.latestVersion}/avatars/${userData.provider.profilePhotoId}?size=mid`,
        headers: headers,
      };

      // get the user's avatars and response.
      request.get(options, (error, response, body) => {
        if (!error && response.statusCode == 200) {
          let base64data = 'data:' + response.headers['content-type'] + ';base64,' + new Buffer(body).toString('base64');
          userData.image = base64data;
          res.render('icon', userData);
        }
      });
    })
    .catch((error) => {
      console.error(error);
      res.render('not-found');
    });
});
router.post('/:id/call', (req, res, next) => {
  let iconId = req.params.id;
  console.log(`${api.apiRoute}/${api.latestVersion}/icons/${iconId}/calls`);

  fetch(`${api.apiRoute}/${api.latestVersion}/icons/${iconId}/calls`, {
    headers: headers,
    method: 'POST',
  })
    .then(response => {
      res.status(response.status).end();
    });
});
module.exports = router;
