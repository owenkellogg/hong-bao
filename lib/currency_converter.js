const OpenExchangeClient = require(__dirname+'/open_exchange_client.js');

function CurrencyConverter() {
  this.exchangeClient = new OpenExchangeClient();
}

CurrencyConverter.prototype = {
  dollarsToYuan: function(options, callback) {
    this.exchangeClient.convert({
      to_currency: 'CNY',
      from_currency: 'USD'
    }, function(error, rate) {
      if (error) {
        return callback(error);
      }
      callback(null, options.dollars * rate);
    });
  }
}

module.exports = CurrencyConverter;

