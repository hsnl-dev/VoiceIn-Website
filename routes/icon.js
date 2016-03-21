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
  res.send('');
});

module.exports = router;
