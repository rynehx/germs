var Germ = require('./germ');
var msg= "0:0";
var targetPos = {x:0, y:0};
var Player = require('./player');


function getMousePos(ctx,e){
  var canvasBox = this.canvas.getBoundingClientRect();
  return {x: e.clientX - canvasBox.left, y: e.clientY -canvasBox.top};
}



var Game = function(ctx,canvas){
  this.ctx = ctx;
  this.canvas = canvas;
  this.germs = [];
  this.makeGerms(30);
  this.player =  this.makePlayer();
  this.canvas.addEventListener('mousemove',
  function(e){this.handleMouseMove(ctx,e);}.bind(this), false);

  document.addEventListener('keydown',  function(e){this.handleKeyDown(e);}.bind(this), false);
//  this.canvas.addEventListener('keyup',this.handleKeyDown);

};

Game.prototype.handleKeyDown= function(e){

  var key = e.keyCode;



 if(key == 38 || key == 87){//up
   if(Math.abs(this.player.vel.y)<2){
     this.player.vel.y-=0.3;
   }
 }else if(key == 39 || key == 69){//right
   if(Math.abs(this.player.vel.x)<2){
     this.player.vel.x+=0.3;
   }
 }else if(key == 40 || key == 83){//down
   if(Math.abs(this.player.vel.y)<2){
    this.player.vel.y+=0.3;
   }
 }else if(key == 64 || key == 37){//left
   if(Math.abs(this.player.vel.x)<2){
     this.player.vel.x-=0.3;
   }
 }



};

Game.prototype.handleMouseMove = function(ctx, e){
  var mousePos = getMousePos(ctx,e);
  msg = "" + mousePos.x + " : " + mousePos.y;
  targetPos = mousePos;
};


Game.prototype.makePlayer = function(){
  var pos = {x:this.ctx.width/2, y:this.ctx.height/2};
  var vel = {x: 0 , y: 0};
  var radius =  12;
  var density = 1;
  var options = {id:9000, radius: radius, density: density, pos: pos, vel: vel};
  return new Player(options);

};

Game.prototype.makeGerms = function(num){
  for(var i = 0; i<num;i++){
    var pos = {x:Math.random()*this.ctx.width, y:Math.random()*this.ctx.height};
    var vel = {x:(Math.random()-0.5)*1, y:(Math.random()-0.5)*1};
    var radius =  10;
    var density = 1;
    var options = {id:i+1, radius: radius, density: density, pos: pos, vel: vel};
    var newGerm = new Germ(options);
    this.germs.push(newGerm);
  }

};

Game.prototype.cursorPos = function(ctx){

  ctx.save();
  ctx.font = "20px Georgia";
  ctx.fillText(msg,10,20);
  ctx.restore();
};




Game.prototype.render = function(ctx){
  console.log(this.germs.length)
  this.player.render(ctx,this.germs);



for(var i =0;i < this.germs.length; i++){
    console.log(this.germs[i].radius)
    this.germs[i].render(ctx,this.germs);

    if(this.germs[i].radius<=1){
     this.germs.splice(i,1);
     i-=1;
    }


  }



};

Game.prototype.draw = function(ctx){
  this.player.draw(ctx);
  this.cursorPos(ctx);
  this.germs.forEach(function(germ){germ.draw(ctx);});

};





Game.prototype.animate = function(){
  this.ctx.clearRect(0, 0, this.ctx.width, this.ctx.height);
  this.render(this.ctx);
  this.draw(this.ctx);
  requestAnimationFrame(this.animate.bind(this));
};

module.exports = Game;
