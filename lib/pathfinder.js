var Promise = require('bluebird');
var FederationResolver = require(__dirname+'/federation_resolver.js');
var CurrencyConverter = require(__dirname+'/currency_converter.js');

function Pathfinder() {
  this.federationResolver = new FederationResolver();
}

Pathfinder.buildPayment = function(options, callback) {
  var resolver = Promise.pending();

  if (!(options.to_currency === 'CNY')) {
    return resolver.reject(new Error('to_currency must be CNY'));
  }
  if (!(options.from_currency === 'USD')) {
    return resolver.reject(new Error('from_currency must be USD'));
  }
  if (!options.to_amount) {
    return resolver.reject(new Error('to_amount must be provided'));
  }
  if (!options.from_amount) {
    return resolver.reject(new Error('from_amount must be provided'));
  }
  if (!options.username) {
    return resolver.reject(new Error('username must be provided'));
  }

  converter.dollarToYuan({
    dollars: options.from_amount 
  }, function(error, converstion) {
    if (error ) {
      return resolver.reject(new Error('currency conversion error'));
    } 
    federationResolver.getQuote({
      destination_amount: converstion.yuan,
      destination_currency: options.to_currency,
      username: options.username
    }, function(error, quote) {
      if (error) {
        return resolver.reject(new Error('federation quote error'));
      }
      resolver.resolve(quote);
    )};
  });
  
  return resolver.promise;
}

