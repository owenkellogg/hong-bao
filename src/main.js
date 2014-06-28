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

    var finalTransform = Transform.identity; 
    var initialTransform = Transform.translate(0, window.innerHeight * 5, 0);
    var yPosition = new Transitionable(initialTransform);

    Transitionable.registerMethod('spring', SpringTransition);

    // create the main context
    var mainContext = Engine.createContext();

    // your app here
    var logo = new ImageSurface({
        content: '/img/ripple-logo.jpg',
        classes: ['double-sided']
    });

    var form = new Surface({
      content: '<form><label for="rippleName">Login with Ripple Name</label></input><input type="text" name="rippleName"/></form>'
    });

    var formPositionModifier = new Modifier({
      size: [200, 200],
      align: [0.5, 0.3],
      transform: Transform.translate(0, 200, 0),
      origin: [0.5, 0.5]
    });

    var logoModifier = new Modifier({
      size: [200, 200],
      align: [0.49, 0.3],
      origin: [0.5, 0.5]
    });

    var groupModifier = new Modifier({
      transform: function() {
        return yPosition.get()
      }
    });

    var groupNode = mainContext.add(groupModifier);

    groupNode.add(logoModifier).add(logo);
    groupNode.add(formPositionModifier).add(form);

    var transition = {
      period: 500,
      method: 'spring',
      dampingRatio: 0.7
    }; 

    yPosition.set(finalTransform, transition);
});
