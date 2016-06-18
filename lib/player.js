var Ball = require('./ball');
var Util = require('./util');

var Player = function(options){
    Ball.call(this, options);
};

Util.inherits(Player, Ball);

module.exports = Player;
