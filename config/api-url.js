'use strict';
module.exports = exports = {
  apiRoute: process.env.isProduction === 'true' ? 'https://voicein-api.kits.tw/api' : 'https://voicein.herokuapp.com/api',
  latestVersion: 'v2',
  webSeverApiVersion: 'v1',
};
