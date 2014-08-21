var http = require('superagent');

function OpenExchange () {
  this.base_url = 'http://openexchangerates.org/api';
  this.app_id = '0e77d00004454f1aad43b574997bf3aa';
}

OpenExchange.prototype = {
  getRates: function(currency, callback){
    var self = this;
    var url = self.base_url+'/latest.json?app_id='+self.app_id;
    http
      .get(url)
      .end(function(error, response){
        if(error) {
          callback(new Error(error));
        } else {
          callback(null, response.body.rates);
        }
      });
  },

  convert: function(options, callback) {
    var _this = this;
    if (!options.to_currency) {
      return callback(new Error('to_currency must be provided'));   
    }
    if (!options.from_currency) {
      return callback(new Error('from_currency must be provided'));   
    }
    _this.getRates(options.from_currency, function(error, rates) {
      if (error) {
        return callback(error);
      }
      if (!rates[options.to_currency]) {
        return callback(new Error('no conversion for currency pair'));
      }
      callback(null, rates[options.to_currency]);
    });
  }
};

module.exports = OpenExchange;

