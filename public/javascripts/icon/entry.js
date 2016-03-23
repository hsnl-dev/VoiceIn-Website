$(function () {
  let FormView = Backbone.View.extend({
    el: 'body',
    events: {
      'click .confirm-btn': 'initCall',
      'click #err-close': 'buttuonClose',
    },
    initialize: function () {
      console.log(this);
    },

    buttuonClose: function (event) {
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
        method:'POST',
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
