const secret = {
  webServiceHeader:  {
    apiKey: process.env.apiKey,
    'Content-Type': 'application/json',
  },
  allpaySecret: {
    merchantID: '1078967',
    hashKey: 'E0XUrGq721IYK3bx',
    hashIV: 'awM2Qfkk5sF5XwTG',
    mode: 'production',
  },
  testAllpaySecret: {
    merchantID: '2000132',
    hashKey: '5294y06JbISpM5x9',
    hashIV: 'v77hoKGq4kWxNNIS',
    mode: 'test',
  },
};

module.exports = exports = secret;
