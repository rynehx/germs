var Ball = require('./ball');
var Util = require('./util');

var Player = function(options){

    Ball.call(this, options);
};

Util.inherits(Player, Ball);

// Player.prototype.render = function(ctx){
//
//   this.pos.x+=this.vel.x;
//   this.pos.y+=this.vel.y;
//   Util.checkBounds(this,ctx);
//
//
// };





module.exports = Player;
