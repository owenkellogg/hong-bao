var assert = require('assert');
var FederationResolver = require(__dirname+'/../lib/federation_resolver.js');

describe('Federation Resolver', function() {

  before(function() {
    federation = new FederationResolver({
      domain: 'ripplecn.com'
    });
  });

  it.skip("should look up the required fields", function() {
    federation.getRequiredFields()
  });

  it("should get a payment quote", function(next) {
    federation.getQuote({
      username: 'yuhao',
      destination_currency: 'CNY',
      destination_amount: 10,
    }, function(error, quote) {
      console.log(error, quote);
      assert(quote.invoice_id);
      assert(quote.expires);
      assert(quote.destination_tag > 0);
      assert(quote.destination_address);
      assert(quote.destination_amount);
      assert(quote.source_amount);
      assert(quote.source_amount > quote.destination_amount);
      next();
    });
  });
});

