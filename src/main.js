define(function(require, exports, module) {
    // import dependencies
    var Engine = require('famous/core/Engine');
    var Modifier = require('famous/core/Modifier');
    var Transform = require('famous/core/Transform');
    var Surface = require('famous/core/Surface');
    var Transitionable = require('famous/transitions/Transitionable');
    var Easing = require('famous/transitions/Easing');
    var ImageSurface = require('famous/surfaces/ImageSurface');
    var SpringTransition = require('famous/transitions/SpringTransition');
    var Timer = require('famous/utilities/Timer');

    // create the main context
    var mainContext = Engine.createContext();

    var initialTransform = Transform.translate(0, window.innerHeight * 5, 0);
    var middleTransform = Transform.identity; 
    var finalTransform = Transform.translate(0, -(window.innerHeight * 5), 0);
    var logoYPosition = new Transitionable(initialTransform);
    var formYPosition = new Transitionable(initialTransform);

    Transitionable.registerMethod('spring', SpringTransition);

    function PaypalView() {
      var self = this;
      this.position = new Transitionable(initialTransform);
      this.template = document.getElementById('paypalTemplate');
      this.surface = new Surface({
        content: _.template(this.template.innerHTML)({ address: wallet.address }),
        properties: {
          textAlign: 'center'
        }
      });
      this.animationModifier = new Modifier({
        transform: function() {
          return self.position.get();
        }
      });
      this.positionModifier = new Modifier({
        size: [300, 200],
        align: [0.5, 0.3],
        origin: [0.5, 0.5]
      });
      this.surface.on('submit', function(event) {
        self.close();
      });
    }
    PaypalView.prototype = {
      addToContext: function(context) {
        context
          .add(this.positionModifier)
          .add(this.animationModifier)
          .add(this.surface);
      },
      open: function() {
        var transition = {
          period: 500,
          method: 'spring',
          dampingRatio: 0.7
        }; 
        this.position.set(middleTransform, transition);
      },
      close: function() {
        var self = this;
        var template = document.getElementById('redirectingTemplate');
        self.surface.setContent(_.template(template.innerHTML)({ address: wallet.address }));
      }
    };

    function AccountView() {
      var self = this;
      this.position = new Transitionable(initialTransform);
      this.template = document.getElementById('accountTemplate');
      this.surface = new Surface({
        content: _.template(this.template.innerHTML)({
          address: wallet.address,
          secretKey: wallet.secret
        }),
        properties: {
          textAlign: 'center'
        }
      });
      this.animationModifier = new Modifier({
        transform: function() {
          return self.position.get();
        }
      });
      this.positionModifier = new Modifier({
        size: [300, 200],
        align: [0.5, 0.3],
        origin: [0.5, 0.5]
      });
      this.surface.on('click', function(event) {
        if (event.target.id === 'fundWallet'){
          self.close();
        }
      });
    }
    AccountView.prototype = {
      open: function() {
        var transition = {
          period: 500,
          method: 'spring',
          dampingRatio: 0.7
        }; 
        this.position.set(middleTransform, transition);
      },
      close: function() {
        var self = this;
        var transition = {
          duration: 500,
          curve: function(t) {
            return Easing.inBack(t, 0.8);
          }
        }; 
        self.position.set(finalTransform, transition, function() {
          paypalView.open();
        });
      },
      addToContext: function(context) {
        context
          .add(this.positionModifier)
          .add(this.animationModifier)
          .add(this.surface);
      }
    }

    function SecretView() {
      var self = this;
      this.position = new Transitionable(initialTransform);
      this.template = document.getElementById('secretTemplate');
      this.surface = new Surface({
        content: _.template(this.template.innerHTML)({ secretKey: wallet.secret }),
        properties: {
          textAlign: 'center'
        }
      });
      this.surface.on('click', function(event) {
        if (event.target.id === 'confirmSecret'){
          self.close();
        }
      });
      this.animationModifier = new Modifier({
        transform: function() {
          return self.position.get();
        }
      });
      this.positionModifier = new Modifier({
        size: [300, 200],
        align: [0.5, 0.3],
        origin: [0.5, 0.5]
      });
    }
    SecretView.prototype = {
      open: function() {
        var transition = {
          period: 500,
          method: 'spring',
          dampingRatio: 0.7
        }; 
        this.position.set(middleTransform, transition);
      },
      close: function() {
        var self = this;
        var transition = {
          duration: 500,
          curve: function(t) {
            return Easing.inBack(t, 0.8);
          }
        }; 
        self.position.set(finalTransform, transition, function() {
          accountView.open();
        });
      },
      addToContext: function(context) {
        context
          .add(this.positionModifier)
          .add(this.animationModifier)
          .add(this.surface);
      }
    };
       
    function LaunchView() {
      var self = this;
      this.template = document.getElementById('launchTemplate');
      this.surface = new Surface({
        content: _.template(this.template.innerHTML)(),
        properties: {
          textAlign: 'center'
        }
      });
      this.animationModifier = new Modifier({
        transform: function() {
          return formYPosition.get();
        }
      });
      this.positionModifier = new Modifier({
        size: [300, 200],
        align: [0.5, 0.3],
        transform: Transform.translate(0, 200, 0),
        origin: [0.5, 0.5]
      });
      this.surface.on('click', function(event) {
        if (event.target.id === 'getARippleWallet'){
          self.close();
        }
      });
    }
    LaunchView.prototype = {
      open: function() {
        var transition = {
          period: 500,
          method: 'spring',
          dampingRatio: 0.7
        }; 
        Timer.setTimeout(function() {
          formYPosition.set(middleTransform, transition);
        }, 0.5);
        logoYPosition.set(middleTransform, transition);
      },
      close: function() {
        var transition = {
          duration: 500,
          curve: function(t) {
            return Easing.inBack(t, 0.8);
          }
        }; 
        Timer.setTimeout(function() {
          formYPosition.set(finalTransform, transition, function() {
            secretView.open();
          });
        }, 0.5);
        logoYPosition.set(finalTransform, transition);
      },
      addToContext: function(context) {
        context
          .add(this.animationModifier)
          .add(this.positionModifier)
          .add(this.surface);
      }
    };

    function LogoView() {
      this.positionModifier = new Modifier({
        size: [300, 200],
        align: [0.5, 0.3],
        origin: [0.5, 0.5]
      });
      this.animationModifier = new Modifier({
        transform: function() {
          return logoYPosition.get();
        }
      });
      this.surface = new ImageSurface({
        content: '/img/ripple-logo.jpg',
        classes: ['double-sided'],
        properties: {
          textAlign: 'center'
        }
      });
    }
    LogoView.prototype = {
      addToContext: function(context) {
        context
          .add(this.animationModifier)
          .add(this.positionModifier)
          .add(this.surface);
      }
    };

    var logoView = new LogoView();
    logoView.addToContext(mainContext);

    var secretView = new SecretView();
    secretView.addToContext(mainContext);

    var accountView = new AccountView();
    accountView.addToContext(mainContext);

    var paypalView = new PaypalView();
    paypalView.addToContext(mainContext);

    var launchView = new LaunchView();
    launchView.addToContext(mainContext);
    launchView.open();

});
