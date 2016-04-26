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
      let payload = JSON.stringify({
        phoneNumber: phoneNumber,
        mode: $('input:radio[name=push-opt]:checked').val(),
      });

      console.log(payload);

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
          return response;
        } else {
          var error = new Error(response.statusText);
          error.response = response;;
          throw error;
        }
      }).then(res => {
        return res.json();
      }).then(data => {
        // dealing with data.
      }).catch(error => {
        console.log('request failed', error);
      });
    },

    render: () => {

    },
  });

  let formView = new FormView();
});
