var Exchange = require(__dirname+'/../lib/open_exchange_client');

describe('Exchange Rate', function(){
  before(function(done){
    exchange = new Exchange();
    done();
  });

  it('should list all results', function(done){
    exchange.getRates(function(error, rates){
      console.log('rates', rates);
      done();
    });
    

  });

});