var http = require('superagent');
var queryString = require('qs');

function FederationResolver() {

}

FederationResolver.prototype = {
  constructor: FederationResolver,
  
  getQuote: function(options, callback) {
    if (!options.destination_amount) {
      callback(new Error('no destination_amount'));
    }
    if (!options.destination_currency === 'CNY') {
      callback(new Error('destination_currency must be CNY'));
    }
    if (!options.username) {
      callback(new Error('no alipay username'));
    }

    var url = 'https://ripplecn.com/bridge?' + queryString.stringify({
      type: 'quote',
      amount: options.destination_amount + '/' + 'CNY',
      address: 'rfLkDwAEQSpTvShmSLLSGWhMmEk65Va1jR',
      full_name: 1,
      contact_info: 1,
      alipay_account: options.username,
      destination: 'z'
    });

    http
      .get(url)
      .end(function(error, response) {
        if (error) {
          callback(error);
        } else {
          var quote = response.body.quote; 
          callback(null, {
            invoice_id: quote.invoice_id,
            destination_tag: quote.destination_tag,
            destination_address: quote.address,
            expires: quote.expires,
            destination_amount: response.body.amount,
            source_amount: parseFloat(quote.send[0].value)
          });
        }
      });
  }
}

module.exports = FederationResolver;

