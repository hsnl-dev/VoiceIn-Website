$(()=> {
  let PaymentFormView = Backbone.View.extend({
    el: '.payment-form',
    events: {
      'click .confrim-payment-btn': 'confirmPayment',
    },
    initialize: () => {

    },

    confirmPayment: (evt) => {
      console.log('confirm');
      $('.payment-form form').submit();
    },
  });
  let paymentFormView = new PaymentFormView();
});
