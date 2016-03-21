'use strict';
const express = require('express');
const router = express.Router();
const fetch = require('isomorphic-fetch');
const api = require('../config/api-url');

let headers = {
  apiKey: process.env.apiKey,
  'Content-Type': 'application/json',
};

router.get('/:iconId/', (error, req, res) => {
  fetch(`${api.apiRoute}/${api.latestVersion}/providers/${qrCodeUuid}`, {
    headers: headers,
  }).then(response => {
    return response.json();
  }).then(data => {
    console.log(data);
    res.send('');
  });
});

module.exports = router;
