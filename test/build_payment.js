var Payment = require(__dirname+'/../lib/build_payment');

describe('Build bridge payment', function(){
  before(function(done){
    payment = new Payment({
      to_amount: 2
    });
    done();
  });

  it('should respond with payment object', function(done){
    payment.build(function(error, response){
      console.log('error', error);
      console.log('error', response);
      done();
    });

  });

});