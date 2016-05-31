$(() => {
  const $dialog = document.querySelector('#dialog');
  let isConfirmClicked = false;

  let FormView = Backbone.View.extend({
    el: '.vcard-content',
    events: {
      'click .confirm-btn': 'addProvider',
      'click .explain-btn': 'showExplainModal',
    },
    initialize: () => {
      let $switchToSafariAlert = $('.switch-to-safari-alert');
      let parser = new UAParser();
      let result = parser.getResult();
      let isApple = result.device.vendor === 'Apple';
      let isMobileSafari = result.browser.name === 'Mobile Safari' && result.device.type === 'mobile';
      let isMobileChrome = result.browser.name === 'Chrome';

      if (!$dialog.showModal) {
        dialogPolyfill.registerDialog($dialog);
      }

      // insert the current url to link.
      $('.copy-url-link').attr('href', window.location.href);

      if (isApple) {
        // Check user agent to determine if show the tutorial view.
        if (!isMobileSafari || isMobileChrome) {
          $switchToSafariAlert.removeClass('content-hidden');
        } else {
          $switchToSafariAlert.addClass('content-hidden');
        }
      } else {
        $switchToSafariAlert.addClass('content-hidden');
      }

      // The user agent detect.
      // $('.ua-section').html(`${result.browser.name} 於 ${result.device.model} @ ${result.device.vendor}`);
      // console.log(result);

      $dialog.querySelector('button:not([disabled])').addEventListener('click', function () {
        $dialog.close();
      });
    },

    addProvider: (e) => {
      if (isConfirmClicked) {
        return;
      } else {
        isConfirmClicked = true;
      }

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

      let isPhoneInValid = $('.phonenumber-field').hasClass('is-invalid') || $('#phoneNumber').val() === '';
      let isNameInValid = $('#name').val().trim() === '';

      if (isNameInValid) {
        $('.notification-text').html('請輸入姓名喔。');
        $dialog.showModal();
        isConfirmClicked = false;
        return false;
      }

      if (isPhoneInValid) {
        $('.notification-text').html('請輸入正確的電話號碼喔。');
        $dialog.showModal();
        isConfirmClicked = false;
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
          let host = 'https://voicein.kits.tw';

          if (location.host === 'voicein.kits.tw') {
            host = 'https://voice-in.herokuapp.com';
          }

          let url = `/icon/${data.iconId}`;

          $('.notification-text').html('成功加入，只剩下最後一步了!');
          $dialog.showModal();

          window.location = url;
        }
      }).catch(error => {
        console.log('request failed', error);
        $('.notification-text').html('抱歉... 網路或伺服器錯誤，請再嘗試一次。');
        $dialog.showModal();
        isConfirmClicked = false;
      });
    },

    showExplainModal: () => {
      $('.notification-text').html('因為提供您的電話號碼後，我們的服務才能夠撥打電話給您，並讓您與此聯絡人通話。請放心，您的電話號碼對方將不會看見。');
      $dialog.showModal();
    },

    render: () => {

    },
  });

  let formView = new FormView();
});
