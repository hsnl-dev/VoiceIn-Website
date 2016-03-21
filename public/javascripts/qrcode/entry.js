$(function () {
  let FormView = Backbone.View.extend({
    el: '.vcard-content',
    events: {
      'click .confirm-btn': 'addProvider',
    },
    initialize: function () {
      console.log(this);
    },

    addProvider: function (e) {
      console.log(e);
    },

    render: function () {

    },
  });

  let formView = new FormView();
});
