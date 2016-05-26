module.exports = exports = {
  sandbox: {

  },
  production: {
    url: process.env.isProduction === 'true' ?
    'mongodb://hsnl-dev:hsnl33564hsnl33564@ds019882.mlab.com:19882/voicein-production'
    : 'mongodb://hsnl-dev:hsnl33564hsnl33564@ds013908.mlab.com:13908/voicein',
  },
};
