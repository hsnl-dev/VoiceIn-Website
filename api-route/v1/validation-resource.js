'use strict';
const express = require('express');
const router = express.Router();
const fetch = require('isomorphic-fetch');
const api = require('../../config/api-url');

let headers = {
  apiKey: process.env.apiKey,
  'Content-Type': 'application/json',
};

router.post('/', (req, res, next) => {
  let phoneNumber = req.body.phoneNumber;
  let mode = req.body.mode;

  let payload = JSON.stringify({
    mode: mode === 'app' ? 'weblogin' : null,
    phoneNumber: `+886${phoneNumber}`,
  });

  console.log(payload);

  fetch(`${api.apiRoute}/${api.latestVersion}/accounts/validations`, {
    headers: headers,
    method: 'POST',
    body: payload,
  })
    .then(resp => {
      if (!resp.ok) {
        // throw Error(res.statusText);
        res.send(resp.status).end();
      }

      console.log(resp.status);
      return resp.json();
    })
    .then(userData => {
      console.log(userData);
      var sess = req.session;
      sess.uuid = userData.userUuid;
      res.send(res.status).end();
    })
    .catch((error) => {
      console.error(error);
    });
});

module.exports = exports = router;
