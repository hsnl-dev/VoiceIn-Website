$(function () {
  let FormView = Backbone.View.extend({
    el: 'body',
    events: {
      'click .confirm-btn': 'initCall',
      'click #err-close': 'buttonClose',
      'click .ath-btn': 'showAtnModal',
      'click .already-ath-btn': 'hideAtnSection',
      'click .edit-btn': 'showEditModal',
      'click .edit-dialog-btn--closed': 'hideEditModal',
      'click .edit-dialog-btn--saved': 'saveUserData',
    },
    initialize: function () {
      let isHideAtnSection = localStorage.getItem('hideAtnSection');

      if (isHideAtnSection) {
        $('.ath-section').hide();
      } else {
        this.addtohome = addToHomescreen({
          message: '請點選按鈕，再點選加至主畫面(Add to Home Screen)，將此網頁加到主畫面。',
          lifespan: 0,
          autostart: true,
        });
      }
    },

    showEditModal: function (e) {
      let dialog = document.querySelector('.edit-dialog');
      if (!dialog.showModal) {
        dialogPolyfill.registerDialog(dialog);
      }

      dialog.show();
    },

    hideEditModal: function (e) {
      let dialog = document.querySelector('.edit-dialog');
      dialog.close();
    },

    saveUserData: function (e) {
      let $buttonClicked = $(e.currentTarget);
      let iconUuid = $buttonClicked.data('icon-uuid');
      let payload = JSON.stringify({
        name: $('#name').val(),
        phoneNumber: `+886${$('#phoneNumber').val()}`,
        company: $('#company').val(),
        location: '',
        availableStartTime: '00:00',
        availableEndTime: '23:59',
        isEnable: 'true',

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

      let isInValid = $('.phonenumber-field').hasClass('is-invalid') || $('#phoneNumber').val() === '';

      if (isInValid) {
        alert('電話號碼格式有誤');
      }

      $buttonClicked.html($buttonClicked.data('save-text'));

      fetch(`/icon/${iconUuid}/edit`, options)
      .then(response => {
        if (response >= 400) {
          let err = new Error('Error!!!!!!!!!!');
          throw err;
        } else {
          $buttonClicked.html($buttonClicked.data('done-text'));
        }
      }).catch(err => {
        alert('抱歉，儲存失敗，請再嘗試一次。');
        console.error(err);
      });
    },

    hideAtnSection: function (e) {
      localStorage.setItem('hideAtnSection', true);
      $('.ath-section').hide();
    },

    showAtnModal: function (e) {
      this.addtohome.show(true);
    },

    buttonClose: function (event) {
      let errdialog = $('dialog.error-dialog').get(0);
      if (!errdialog.showModal) {
        dialogPolyfill.registerDialog(errdialog);
      }

      console.log(event);
      errdialog.close();
    },

    initCall: function (e) {
      console.log(e);
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
           dialog.close();
           return response;
         } else {
           var error = new Error(response.statusText);
           error.response = response;;
           throw error;
         }
       })
       .catch(error => {

         dialog.close();
         errdialog.showModal();
         console.log('request failed', error);
       });
    },

    render: function () {

    },
  });

  let formView = new FormView();
});
