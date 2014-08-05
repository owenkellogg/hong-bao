
$(function() {

  function convertDollarsToXrp(dollars) {
    return Math.round((dollars / 0.006) * 0.97);
  }

  var handler = StripeCheckout.configure({
    key: 'pk_test_6pRNASCoBOKtIshFeQd4XMUh',
    image: '/img/ripple-rocket-150x150.png',
    token: function(token) {
      alert(token.id);
      // Use the token to create the charge with a server-side script.
      // You can access the token ID with `token.id`
    }
  });

  $('.supported button.btn').on('click', function(event) {
    event.preventDefault();

    var dollars = parseInt($(this).data('dollars'));
    var xrp = convertDollarsToXrp(dollars);
    handler.open({
      name: 'Ripple Launch',
      description: xrp+' XRP ($'+dollars+'.00)',
      amount: dollars * 100
    });
  });
})
