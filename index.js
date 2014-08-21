var express = require('express');
var buildPayment = require(__dirname+'/lib/build_payment');

var router = new express.Router();
router.use('/', express.static(__dirname+'/public'));
/*router.use('/buy-xrp', function(request, response) {
  response.render('buy-xrp');
});
*/

router.get('/bridge/payments/:alipay_username/:amount', buildPayment);

module.exports =  router;

