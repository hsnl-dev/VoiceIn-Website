'use strict';
const express = require('express');
const router = express.Router();
const fetch = require('isomorphic-fetch');

router.get('/', function(req, res, next) {
  let qrCodeUuid = req.query.id;
  let headers = {
    'apiKey': process.env.apiKey,
    'Accept': 'application/json',
    'Content-Type': 'application/json'
  };

  fetch(`https://voicein.herokuapp.com/api/v1/providers/${qrCodeUuid}`, {
    headers: headers
  })
    .then(res => {
      return res.json();
    })
    .then(userData => {
      console.log(userData);
    });

  res.render('qrcode', {qrCodeUuid: qrCodeUuid});
});

module.exports = router;
