const PathFinder = require(__dirname+'/../lib/pathfinder.js');

describe('PathFinder', function() {

  it('should create the appropriate gatewayd records', function(next) {
    var pathFinder = new PathFinder();

    pathFinder.buildPayment({
      to_currency: 'CNY',
      from_currency: 'USD',
      from_amount: 5,
      username: 'yuhao'
    })
    .then(function(bridgePayment) {
      payment = bridgePayment;
      console.log('BRIDGE PAYMENT', bridgePayment);
      assert(bridgePayment.rippleTransaction.id > 0);
      assert(bridgePayment.externalTransaction.id > 0);
      assert(bridgePayment.gatewayTransaction.id > 0);
      assert(bridgePayment.destinationExternalAddress.id > 0);
      assert(bridgePayment.destinationRippleAddress.id > 0);
      assert(bridgePayment.sourceRippleAddress.id > 0);
      assert(bridgePayment.policy.id > 0);
    })
    .error(console.log);
  });
});

