'use strict';
const express = require('express');
const router = express.Router();
const fetch = require('isomorphic-fetch');
const request = require('request').defaults({ encoding: null });
const api = require('../config/api-url');
const headers = require('../config/secret').webServiceHeader;

router.get('/:id', (req, res) => {
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

      if (userData.provider.profilePhotoId != null) {
        // get the user's avatars and response.
        request.get(options, (error, response, body) => {
          if (!error && response.statusCode == 200) {
            let base64data = 'data:' + response.headers['content-type'] + ';base64,' + new Buffer(body).toString('base64');

            userData.image = base64data;
            res.render('icon', userData);
          }
        });
      } else {
        userData.image = './dist/public/images/qrcode/user.png';
        res.render('icon', userData);
      }
    })
    .catch((error) => {
      console.error(error);
      res.render('not-found');
    });
});

router.get('/:id/informations', (req, res) => {
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
      let response = {
        isTargetEnable: userData.isTargetEnable,
        userName: userData.provider.userName,
      };

      res.json(response).end();
    })
    .catch((error) => {
      console.error(error);
      res.status(error.response.status).end();
    });
});

router.post('/:id/call', (req, res) => {
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

router.put('/:id/edit', (req, res) => {
  let iconId = req.params.id;
  let payload = JSON.stringify(req.body);
  let updateRoute = `${api.apiRoute}/${api.latestVersion}/icons/${iconId}`;
  let options = {
    headers: headers,
    method: 'PUT',
    body: payload,
  };

  console.log(options);

  fetch(updateRoute, options)
  .then(response => {
    if (response.status >= 400 && response.status !== 402) {
      let err = new Error('Some damn err...');

      err.response = response;
      throw err;
    } else {
      res.status(response.status).end();
    }
  }).catch(err => {
    console.error(err);
    res.status(err.response.status).end();
  });
});

router.post('/:id/ping', (req, res) => {
  let iconId = req.params.id;
  let payload = JSON.stringify(req.body);
  let updateRoute = `${api.apiRoute}/${api.latestVersion}/icons/${iconId}/ping`;
  let options = {
    headers: headers,
    method: 'POST',
    body: payload,
  };

  console.log(options);

  fetch(updateRoute, options)
  .then(response => {
    if (response.status >= 400 && response.status !== 402) {
      let err = new Error('Some damn err...');

      err.response = response;
      throw err;
    } else {
      res.status(response.status).end();
    }
  }).catch(err => {
    console.error(err);
    res.status(err.response.status).end();
  });
});

module.exports = router;
