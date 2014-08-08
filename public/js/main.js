
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

  var STRIPE_API_PUBLIC_KEY='pk_test_NYwm9XdrPXhV9RGCurabqrKc';
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
    this.rippleAddress = options.rippleAddress || 'r4EwBWxrx5HxYRyisfGzMto3AT8FZiYdWk';
    this.amount = options.amount || 2;
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
          console.log('SUCCESS', response);
          alert('success');
        },
        error: function(error){
          console.log('ERROR', error);
          alert('error');
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

  var handler = StripeCheckout.configure({
    key: STRIPE_API_PUBLIC_KEY,
    image: STRIPE_LOGO_IMAGE,
    token: function(token) {
      var payment = new GatewayPayment({
        destinationAddress: 'r4EwBWxrx5HxYRyisfGzMto3AT8FZiYdWk',
        destinationAmount: convertDollarsToXrp(dollars),
        sourceAddress: token.id,
        sourceAmount: dollars
      });
      inboundBridgeClient.postGatewayPayment(payment);
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

  var validNames = {};
  var invalidNames = {};

  var $buyXrpButton = $('#buyXrpButton');
  var $nameInput = $('input');

  $('form').on('submit', function(event) {
    event.preventDefault();
    var address = $nameInput.val();
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
})
