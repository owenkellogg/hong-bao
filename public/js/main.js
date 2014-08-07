
$(function() {

  function convertDollarsToXrp(dollars) {
    return Math.round((dollars / 0.006) * 0.97);
  }

  var handler = StripeCheckout.configure({
    key: 'pk_test_NYwm9XdrPXhV9RGCurabqrKc',
    image: '/img/ripple-rocket-150x150.png',
    token: function(token) {
      $.ajax({
        url: '/stripe',
        type: 'POST',
        data: {
          stripeToken: token.id,
          rippleAddress: 'r4EwBWxrx5HxYRyisfGzMto3AT8FZiYdWk',
          amount: 2
        },
        success: function(response){
          console.log('SUCCESS', response);
          alert('success');
        },
        error: function(error){
          console.log('ERROR', error);
          alert('error');
        }
      });
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
