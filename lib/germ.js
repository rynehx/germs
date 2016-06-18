var Ball = require('./ball');
var Util = require('./util');

var Germ = function(options){
    Ball.call(this, options);
};

Util.inherits(Germ, Ball);

module.exports = Germ;
