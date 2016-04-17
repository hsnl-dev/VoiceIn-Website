$(() => {
  const api = require('../config/api-url.js');
  const $dialog = document.querySelector('#dialog');

  let FormView = Backbone.View.extend({
    el: '.vcard-content',
    events: {
      'click .confirm-btn': 'addProvider',
    },
    initialize: () => {
      if (!$dialog.showModal) {
        dialogPolyfill.registerDialog($dialog);
      }

      $dialog.querySelector('button:not([disabled])').addEventListener('click', function () {
        $dialog.close();
      });
    },

    addProvider: (e) => {
      let $buttonClicked = $(e.currentTarget);
      let qrCodeUuid = $buttonClicked.data('qrcode-uuid');
      let payload = JSON.stringify({
          providerUuid: qrCodeUuid,
          customer: {
            name: $('#name').val(),
            phoneNumber: `+886${$('#phoneNumber').val()}`,
            company: $('#company').val(),
            location: '',
            availableStartTime: '00:00',
            availableEndTime: '23:59',

            // profile: '',
          },
        });

      let isInValid = $('.phonenumber-field').hasClass('is-invalid') || $('#phoneNumber').val() === '';

      if (isInValid) {
        $('.notification-text').html('請輸入正確的電話號碼。');
        $dialog.showModal();
        return false;
      }

      let options = {
        method: 'POST',
        headers: {
          'Content-type': 'application/json',
          Accept: 'application/json',
        },
        body: payload,
      };

      fetch(`/qrcode/add/${qrCodeUuid}`, options)
      .then(response => {
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
        if (data.iconId) {
          let host = 'https://voice-in.herokuapp.com';

          $('.notification-text').html('成功加入，只剩下最後一步了!');
          $dialog.showModal();

          let newWindow = window.open(`${host}/icon/${data.iconId}`, '_blank');
          newWindow.focus();
        }
      }).catch(error => {
        console.log('request failed', error);
        $('.notification-text').html('抱歉... 網路或伺服器錯誤，請再嘗試一次。');
        $dialog.showModal();
      });
    },

    render: () => {

    },
  });

  let formView = new FormView();
});
