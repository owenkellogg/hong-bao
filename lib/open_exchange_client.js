var http = require('superagent');

function OpenExchange () {
  this.base_url = 'http://openexchangerates.org/api';
  this.app_id = '0e77d00004454f1aad43b574997bf3aa';
}

OpenExchange.prototype = {
  getRates: function(currency, callback){
    var self = this;
    var url = self.base_url+'/latest.json?app_id='+self.app_id;
    console.log('url', url);
    http
      .get(url)
      .end(function(error, response){
        if(error) {
          callback(new Error(error));
        } else {
          callback(null, response.body.rates);
        }
      });
  }

};

module.exports = OpenExchange;

