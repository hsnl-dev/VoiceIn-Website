$(function () {
  let FormView = Backbone.View.extend({
    el: 'body',
    events: {
      'click .confirm-btn': 'initCall',
      'click #err-close': 'buttonClose',
      'click #calling-modal-close': 'callingModalClose',
      'click .already-ath-btn': 'hideAtnSection',
      'click .edit-btn': 'showEditModal',
      'click .edit-dialog-btn--closed': 'hideEditModal',
      'click .edit-dialog-btn--saved': 'saveUserData',
      'click .period-btn--started': 'openStartTimePicker',
      'click .period-btn--ended': 'openEndTimePicker',
      'click #mddtp-time__ok': 'setTimeMoment',
      'click .isEnable-switch': 'toggleEnableSwitch',
      'click .android-ath-close-btn': 'closeAndroidTutorial',
    },
    initialize: function () {
      let parser = new UAParser();
      let result = parser.getResult();
      let isApple = result.device.vendor === 'Apple';
      let isMobileSafari = result.browser.name === 'Mobile Safari' && result.device.type === 'mobile';
      let isMobileChrome = result.browser.name === 'Chrome';

      this.mdTimePicker = new mdDateTimePicker({
        type: 'time',
      });
      this.editTimeState = 'start';

      if (document.referrer !== '') {
        // To determine if show the ath tutorial based on browser and timing.
        if (isApple) {
          this.addtohome = addToHomescreen({
            message: '請點選 <img src="/dist/public/images/icon/ios-sharing.png" width="20" style="vertical-align: top;"/>，再點選 <img src="/dist/public/images/icon/ios-add-to-screen.png" width="25"/> 加至主畫面，將此聯絡人加到主畫面。',
            lifespan: 0,
            displayPace: 0,
            autostart: false,
            startDelay: 0,
          });
          this.addtohome.show();
        } else {
          $('.android-ath-section').removeClass('content-hidden');
        }
      }

    },

    toggleEnableSwitch: function (e) {
      let $toggleSwitch = $(e.currentTarget);
      let $userInfoSaveBtn = $('.edit-dialog-btn--saved');

      $toggleSwitch.toggleClass('is-checked');

      // Save the data
      $userInfoSaveBtn.click();
    },

    setTimeMoment: function () {
      let editTimeState = this.editTimeState;
      let $periodStart = $('.period-btn--started');
      let $periodEnd = $('.period-btn--ended');
      let $userInfoSaveBtn = $('.edit-dialog-btn--saved');

      if (editTimeState === 'start') {
        let time = (this.mdTimePicker.time().format('HH:mm'));

        $periodStart.html(time);
      } else {
        let time = (this.mdTimePicker.time().format('HH:mm'));

        $periodEnd.html(time);
      }

      // Save the data
      $userInfoSaveBtn.click();
    },

    openStartTimePicker: function () {
      this.mdTimePicker.toggle();
      let time = this.mdTimePicker.time();

      this.editTimeState = 'start';
    },

    openEndTimePicker: function () {
      this.mdTimePicker.toggle();
      this.editTimeState = 'end';
    },

    showEditModal: function () {
      let dialog = document.querySelector('.edit-dialog');

      if (!dialog.showModal) {
        dialogPolyfill.registerDialog(dialog);
      }

      dialog.show();
    },

    hideEditModal: function () {
      let dialog = document.querySelector('.edit-dialog');

      dialog.close();
    },

    saveUserData: function () {
      let $buttonClicked = $('.edit-dialog-btn--saved');
      let iconUuid = $buttonClicked.data('icon-uuid');
      let payload = JSON.stringify({
        name: $('#name').val(),
        phoneNumber: `+886${$('#phoneNumber').val()}`,
        company: $('#company').val(),
        location: '',
        availableStartTime: $('.period-btn--started').text().replace(/\n|" "/g, ''),
        availableEndTime: $('.period-btn--ended').text().replace(/\n|" "/g, ''),
        isEnable: $('.isEnable-switch').hasClass('is-checked').toString(),

        // profile: '',
      });

      let options = {
        method: 'PUT',
        headers: {
          'Content-type': 'application/json',
          Accept: 'application/json',
        },
        body: payload,
      };

      let isPhoneNumberInValid = $('.phonenumber-field').hasClass('is-invalid') || $('#phoneNumber').val() === '';
      let isNameInValid = $('#name').val().trim() === '';

      if (isNameInValid) {
        alert('電話號碼格式有誤');
        return false;
      } else {
        localStorage.setItem('name', $('#name').val());
      }

      if (isPhoneNumberInValid) {
        alert('電話號碼格式有誤');
        return false;
      } else {
        localStorage.setItem('phoneNumber', $('#phoneNumber').val());
        localStorage.setItem('company', $('#company').val());
      }

      $buttonClicked.html($buttonClicked.data('save-text'));

      fetch(`/icon/${iconUuid}/edit`, options)
      .then(response => {
        if (response >= 400) {
          let err = new Error('Error');

          throw err;
        } else {
          $buttonClicked.html($buttonClicked.data('done-text'));
          let dialog = document.querySelector('.edit-dialog');

          if (typeof dialog.close === 'function') {
            dialog.close();
          }

          $buttonClicked.html($buttonClicked.data('original-text'));
        }
      }).catch(err => {
        alert('抱歉，儲存失敗，請再嘗試一次。');
        console.error(err);
      });
    },

    hideAtnSection: function () {
      localStorage.setItem('hideAtnSection', true);
      $('.ath-section').hide();
    },

    buttonClose: function () {
      let errdialog = $('dialog.error-dialog').get(0);

      if (!errdialog.showModal) {
        dialogPolyfill.registerDialog(errdialog);
      }

      errdialog.close();
    },

    callingModalClose: function () {
      let errdialog = $('dialog.progress-dialog').get(0);

      if (!errdialog.showModal) {
        dialogPolyfill.registerDialog(errdialog);
      }

      errdialog.close();
    },

    initCall: function () {
      let iconUuid = $('.icon-info').data('iconid');
      let dialog = $('dialog.progress-dialog').get(0);
      let errdialog = $('dialog.error-dialog').get(0);

      if (!dialog.showModal) {
        dialogPolyfill.registerDialog(dialog);
        dialogPolyfill.registerDialog(errdialog);
      }

      dialog.showModal();
      let options = {
        method: 'POST',
      };

      fetch(`/icon/${iconUuid}/call`, options)
       .then(response => {

         if (response.status >= 200 && response.status < 300) {
           //  dialog.close();
           return response;
         } else {
           if (response.status === 402) {
             // payment required.
             $('.error-dialog p').html('對方點數不足，無法撥打。');
           }  else {
             let error = new Error(response.statusText);

             error.response = response;
             throw error;
           }

         }
       })
       .catch(error => {

         dialog.close();
         errdialog.showModal();
         console.log('request failed', error);
       });
    },

    closeAndroidTutorial: () => {
      $('.android-ath-section').addClass('content-hidden');
    },

    render: () => {

    },
  });

  let formView = new FormView();
});
