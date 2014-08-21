var Exchange = require(__dirname+'/../lib/open_exchange_client');
var async = require('async');

function Payment(payment){
  this.payment = payment
}

Payment.prototype = {
  build: function(callback){
    var self = this;
    async.waterfall([
      function(next) {
        self._getPrice('CNY', next);
      },
      function(next) {
        self._convert({
          amount: self.payment
        }, next);
      }
    ], callback);
  },
  _validate: function(){
    if (!Number(this.payment.to_amount)) {
      return new Error('to_amount must be a number');
    } else {
      return Number(this.payment.to_amount);
    }
  },
  _getPrice: function(currency, callback){
    var exchange = new Exchange();
    if (currency) {
      exchange.getRates(currency, function(error, rate){
        if (error) { return callback(new Error()) }
        callback(null, rate);
      });
    }
  },
  _convert: function(options, callback){
    var self = this;

    if(typeof self._validate() === 'number') {
      var convertedAmount = options.amount * currencyRate;
      callback(null, convertedAmount);
    }

  }
};

module.exports = Payment;