$(() => {
  const api = require('../config/api-url.js');
  let FormView = Backbone.View.extend({
    el: '.vcard-content',
    events: {
      'click .confirm-btn': 'addProvider',
    },
    initialize: () => {

    },

    addProvider: (e) => {
      let $buttonClicked = $(e.currentTarget);
      let qrCodeUuid = $buttonClicked.data('qrcode-uuid');
      let payload = JSON.stringify({
          providerUuid: qrCodeUuid,
          customer: {
            name: $('#name').val(),
            phoneNumber: $('#phoneNumber').val(),
            company: $('#company').val(),
            location: '',
            availableStartTime: '00:00',
            availableEndTime: '23:59',

            // profile: '',
          },
        });

      let options = {
        method: 'POST',
        headers: {
          'Content-type': 'application/json',
          Accept: 'application/json',
        },
        body: payload,
      };

      fetch(`/qrcode/add/${qrCodeUuid}`, options)
      .then( response => {
        if (response.status >= 200 && response.status < 300) {
          return response;
        } else {
          var error = new Error(response.statusText);
          error.response = response;;
          throw error;
        }
      }).then(res => {
        return res.json();
      }).then(data => {
        window.location = `/icon/${data.iconId}`;
      }).catch(error => {
        console.log('request failed', error);
      });
    },

    render: () => {

    },
  });

  let formView = new FormView();
});
