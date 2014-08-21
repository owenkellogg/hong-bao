var Exchange = require(__dirname+'/../lib/open_exchange_client');
var assert = require('assert');

describe('Exchange Rate', function(){
  before(function(){
    exchange = new Exchange();
  });

  it('should list all results', function(done){
    exchange.getRates('USD',function(error, rates){
      done();
    });
  });

  it('should find the rate between two currencies', function(done) {
    exchange.convert({
      from_currency: 'USD',
      to_currency: 'CNY'
    }, function(error, rate) {
      console.log('RATE', rate);
      assert(rate > 2);
    });
  });

});
