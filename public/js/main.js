
$(function() {
  _.templateSettings = { 
      interpolate: /\{\{\=(.+?)\}\}/g,
      evaluate: /\{\{(.+?)\}\}/g
  };  

  var Router = Backbone.Router.extend({
    routes: {
      "": "index",
      ":name": "nameLookup",
    },
    index: function() {
      $('.nameForm').show();
      $('.prices').hide();
      $('#rippleName').html('');
    },
    nameLookup: function(name) {
      $('.nameForm').hide();
      $('.prices').show();
      $('#rippleName').html(name);
    }
  });

  var router = new Router();

  Backbone.history.start({ pushState: false });
  router.navigate('/', { trigger: true });

  var STRIPE_API_PUBLIC_KEY='pk_live_dzfTEzp9g8RiyQeZCrmLBilF';
  var STRIPE_LOGO_IMAGE='/img/ripple-rocket-150x150.png';

  var Rippler = Backbone.Model.extend({
    lookup: function(name, callback) {
      $.ajax({
        type: 'GET',
        url: 'https://id.ripple.com/v1/authinfo?username='+name,
        success: function(authInfo) {
          callback(null, authInfo);
        },
        error: function(error) {
          callback(new Error('AuthServerError', null));
        }
      });
    }   
  }); 

  rippler = new Rippler();
  rippler.on('change:address', function() {
    router.navigate(rippler.get('address'), { trigger: true }); 

  });

  function GatewayPayment(options) {
    this.destinationAddress = options.destinationAddress;
    this.sourceAddress = options.sourceAddress;
    this.sourceAmount = options.sourceAmount;
    this.destinationAmount = options.destinationAmount;
  }

  GatewayPayment.prototype = {
    toJSON: function() {
      return {
        rippleAddress: this.destinationAddress,
        stripeToken: this.sourceAddress,
        amount: this.sourceAmount
      }
    }
  }

  function StripeInboundBridgeClient(options) {
    if (!options.stripeApiKey) {
      throw new Error('MissingStripeApiKey');
    }
    this.stripeApiKey = options.stripeApiKey;
  }

  StripeInboundBridgeClient.prototype = {
    postGatewayPayment: function(payment, callback) {
      $.ajax({
        url: '/stripe',
        type: 'POST',
        data: payment.toJSON(),
        success: function(response){
          callback(null, response);
        },
        error: function(error){
          callback(error, null);
        }
      });
    }
  };

  function convertDollarsToXrp(dollars) {
    return Math.round((dollars / 0.006) * 0.97);
  }

  var inboundBridgeClient = new StripeInboundBridgeClient({
    stripeApiKey: STRIPE_API_PUBLIC_KEY
  });

  function PaymentClickHandler() {
  }

  PaymentClickHandler.prototype = {
    handleClick: function() {
    }
  }

  $('.supported button.btn').on('click', function(event) {
    event.preventDefault();
    var dollars = parseInt($(this).data('dollars'));
    var xrp = convertDollarsToXrp(dollars);
    var handler = StripeCheckout.configure({
      key: STRIPE_API_PUBLIC_KEY,
      image: STRIPE_LOGO_IMAGE,
      token: function(token) {
        var payment = new GatewayPayment({
          destinationAddress: rippler.get('address'),
          destinationAmount: convertDollarsToXrp(dollars),
          sourceAddress: token.id,
          sourceAmount: dollars
        });
        inboundBridgeClient.postGatewayPayment(payment, function(error, response) {
          if (error) {
            alert('error');
          } else {
            $('.submittingTransaction').removeClass('hidden');
            $('.nameForm').addClass('hidden');
            $('.prices').addClass('hidden');
            $('.transactionConfirmed').addClass('hidden');
            var webSocket = new WebSocket('wss://s1.ripple.com');
            webSocket.onopen = function() {
              webSocket.send(JSON.stringify({
                "command": "subscribe",
                "accounts": [rippler.get('address')]
              }));
            };
            webSocket.onmessage = function(event) {
              try {
                var message = JSON.parse(event.data);
                var transaction = message.transaction;
                if (transaction.Destination === rippler.get('address')){
                  if (transaction.Account === 'rUy57HSCpdbDDhzB58Y2NjaomzuqCxaxd3') {
                    console.log(transaction);
                    $('.submittingTransaction').addClass('hidden');
                    $('.nameForm').addClass('hidden');
                    $('.prices').addClass('hidden');
                    $('.transactionConfirmed').removeClass('hidden');
                    $('#transactionAmount').html(''+(transaction.Amount / 1000000)+' XRP');
                    $('#transactionHash').html(transaction.hash);
                    $('#viewInGraph').attr('href', 'https://ripple.com/graph#'+transaction.hash);
                  } else {
                    console.log('transaction to address but not from bridge.');
                  }
                } else {
                  console.log('transaction involving but not to address.');
                }
              } catch(exception) {
                console.log('error', exception);
              }
            };
          }
        });
      }
    });
    handler.open({
      name: 'Ripple Launch',
      description: xrp+' XRP ($'+dollars+'.00)',
      amount: dollars * 100
    });
  });

  var validNames = {};
  var invalidNames = {};

  var $buyXrpButton = $('#buyXrpButton');
  var $nameInput = $('input');

  $('form').on('submit', function(event) {
    event.preventDefault();
    var address = $nameInput.val();
    if (ripple.UInt160.is_valid(address)) {
      return rippler.set('address', address);
    }
    rippler.lookup(address, function(error, authInfo) {
      if (error) {
      } else {
        if (authInfo.address) {
          rippler.set('address', authInfo.address);
        } else {
          alert('invalid ripple address');
        }
      }
    });
  });

  $('#mainHeader').on('click', function() {
    rippler.set('address', null);
    router.navigate('/', { trigger: true });
  });
})
