var express = require('express');

var router = express.Router();
router.use('/', express.static(__dirname+'/public'));
router.use('/buy-xrp', function(request, response) {
  response.render('buy-xrp');
});

module.exports =  router;

