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
      let $nameField = $('#name');
      let $phoneNumberField = $('#phoneNumber');
      let $companyField = $('#company');

      if (!$dialog.showModal) {
        dialogPolyfill.registerDialog($dialog);
      }

      $nameField.val(localStorage.getItem('name') != null ? localStorage.getItem('name') : '');
      $phoneNumberField.val(localStorage.getItem('phoneNumber') != null ? localStorage.getItem('phoneNumber') : '');
      $companyField.val(localStorage.getItem('company') != null ? localStorage.getItem('company') : '');

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
        let url = window.location.href;

        window.location = `intent${url.replace(/http|https/g, '')}#Intent;scheme=https;package=com.android.chrome;S.browser_fallback_url=${url};end`;
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
        $('.notification-text').html('請輸入您的暱稱或姓名。');
        $dialog.showModal();
        isConfirmClicked = false;
        return false;
      } else {
        localStorage.setItem('name', $('#name').val());
      }

      if (isPhoneInValid) {
        $('.notification-text').html('請輸入您的手機號碼(09 開頭)。');
        $dialog.showModal();
        isConfirmClicked = false;
        return false;
      } else {
        localStorage.setItem('phoneNumber', $('#phoneNumber').val());
        localStorage.setItem('company', $('#company').val());
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
      }).then(res => res.json())
      .then(data => {
        if (data.iconId) {
          let parser = new UAParser();
          let result = parser.getResult();
          let isApple = result.device.vendor === 'Apple';
          let host = '://voicein.kits.tw';

          if (location.host !== 'voicein.kits.tw') {
            host = '://voice-in.herokuapp.com';
          }

          let url = `/icon/${data.iconId}`;

          $('.notification-text').html('快完成了，請跟隨教學加入聯絡人至主畫面。');
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
