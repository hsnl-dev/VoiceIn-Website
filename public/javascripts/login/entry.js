$(() => {
  let FormView = Backbone.View.extend({
    el: '.login-form',
    events: {
      'click .send-code-btn': 'sendCode',
    },
    initialize: () => {

    },

    sendCode: () => {
      console.log('SEND CODE!');
      let phoneNumber = $('#phone-number-input').val();
      let $loginBtn = $('.login-btn');
      let $sendCodebtn = $('.send-code-btn');
      let payload = JSON.stringify({
        phoneNumber: phoneNumber,
        mode: $('input:radio[name=push-opt]:checked').val(),
      });

      console.log(payload);
      $loginBtn.prop('disabled', true);
      $sendCodebtn.html($sendCodebtn.data('send'));

      let options = {
        method: 'POST',
        headers: {
          'Content-type': 'application/json',
          Accept: 'application/json',
        },
        body: payload,
      };

      fetch(`/api/v1/validations/`, options)
      .then(response => {
        if (response.status >= 200 && response.status < 300) {
          console.log(response.status);
          $('.login-btn').prop('disabled', false);
          $sendCodebtn.html($sendCodebtn.data('normal'));
          return response;
        } else {
          var error = new Error(response.statusText);
          error.response = response;
          $loginBtn.prop('disabled', true);
          $sendCodebtn.html($sendCodebtn.data('fail'));
          throw error;
        }
      }).then(res => {
        console.log(res);
      }).catch(error => {
        console.log('request failed', error);
      });
    },

    render: () => {

    },
  });

  let UserInforView = Backbone.View.extend({
    el: 'body',
    events: {
      'click .user-edit-btn': 'toggleToEditView',
      'click .user-unedit-btn': 'unToggleToEditView',
      'click .user-save-btn': 'updateUserInformation',
    },
    initialize: () => {
      let template = _.template($('#info-template').html(), {});
      $('.user-information-section').html(template);
    },

    toggleToEditView: () => {
      let template = _.template($('#edit-template').html(), {});
      $('.user-information-section').html(template);
    },

    unToggleToEditView: () => {
      let template = _.template($('#info-template').html(), {});
      $('.user-information-section').html(template);
    },

    updateUserInformation: () => {
      $('.update-form').submit();
    },

    render: () => {

    },
  });

  let formView = new FormView();
  let userInforView = new UserInforView();

});
