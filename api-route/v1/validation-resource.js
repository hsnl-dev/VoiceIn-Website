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
  let phoneNumber = req.query.phoneNumber;
  let payload = JSON.stringify({
    mode: 'weblogin',
    phoneNumber: `+886${phoneNumber}`,
  });

  fetch(`${api.apiRoute}/${api.latestVersion}/accounts/validations`, {
    headers: headers,
    method: 'POST',
    body: payload,
  })
    .then(res => {
      if (!res.ok) {
        throw Error(res.statusText);
      }

      console.log(res.statusText);
      return res.json();
    })
    .then(userData => {
      console.log(userData);

    })
    .catch((error) => {
      console.error(error);
    });
});

module.exports = exports = router;
