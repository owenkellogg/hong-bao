
describe('PathFinder', function() {

  it('should create the appropriate gatewayd records', function(next) {
    var pathFinder = new PathFinder();

    pathFinder.buildPayment({
      to_currency: 'CYN',
      from_currency: 'USD',
      to_amount: 100,
      username: 'yuhao'
    })
    .then(function(bridgePayment) {
      assert(bridgePayment.rippleTransaction.id > 0);
      assert(bridgePayment.externalTransaction.id > 0);
      assert(bridgePayment.gatewayTransaction.id > 0);
      assert(bridgePayment.destinationExternalAddress.id > 0);
      assert(bridgePayment.destinationRippleAddress.id > 0);
      assert(bridgePayment.sourceRippleAddress.id > 0);
      assert(bridgePayment.policy.id > 0);
    });
  });
});

