var Util = require('./util');

var Ball = function(options){
  //id, radius, density, pos, vel
  this.id = options.id;
  this.pos = options.pos;
  this.vel = options.vel;
  this.radius = options.radius;
  this.color = options.color;
  this.mass = Math.PI*(options.radius*options.radius)*options.density;

};


Ball.prototype.render = function(ctx,balls){

  this.pos.x+=this.vel.x;
  this.pos.y+=this.vel.y;



  balls.forEach(function(ball){
    if(ball.id!==this.id){
    Util.checkCollison(this, ball);
    }
  }.bind(this));
  Util.checkBounds(this,ctx);
};




Ball.prototype.draw = function(ctx){
  ctx.save();
  ctx.beginPath();
  ctx.fillStyle = this.color;
  ctx.arc(this.pos.x,this.pos.y,this.radius,0,2*Math.PI);
  ctx.fill();


  ctx.restore();
};

module.exports = Ball;
