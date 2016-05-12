var Germ = require('./germ');
var msg= "0:0";
var targetPos = {x:0, y:0};
var Player = require('./player');
var Util = require('./util');

function getMousePos(ctx,e){
  var canvasBox = this.canvas.getBoundingClientRect();
  return {x: e.clientX - canvasBox.left, y: e.clientY -canvasBox.top};
}



var Game = function(ctx,canvas){
  this.backgroundImage = "http://res.cloudinary.com/bravaudio/image/upload/v1463032054/Silver-Blur-Background_fk8fyd.jpg";
  this.ctx = ctx;
  this.canvas = canvas;
  this.germs = [];
  this.makeGerms(200);
  this.player =  "";//this.makePlayer();
  this.start = true;
  this.over = false;
  this.debugger = false;
  this.canvas.addEventListener('mousemove',
  function(e){this.handleMouseMove(ctx,e);}.bind(this), false);

  document.addEventListener('keydown',  function(e){this.handleKeyDown(e);}.bind(this), false);
//  this.canvas.addEventListener('keyup',this.handleKeyDown);

};

Game.prototype.handleKeyDown= function(e){

  var key = e.keyCode;



 if(key == 38 || key == 87){//up
   if(this.player.vel.y>-2.5){
     this.player.vel.y-=0.3;
     this.handleEject(this);
   }
 }else if(key == 39 || key == 68){//right
   if(this.player.vel.x<2.5){
     this.player.vel.x+=0.3;
      this.handleEject(this);
   }
 }else if(key == 40 || key == 83){//down
   if(this.player.vel.y<2.5){
    this.player.vel.y+=0.3;
     this.handleEject(this);
   }
 }else if(key == 65 || key == 37){//left
   if(this.player.vel.x>-2.5){
     this.player.vel.x-=0.3;
      this.handleEject(this);
   }
 }else if(key == 32 && this.over ){
   this.germs = [];
   this.makeGerms(300);
   this.player =  this.makePlayer();
   this.over = false;
 }else if(key == 67){
   this.debugger = !this.debugger;
 }else if(key == 32 && (this.over || this.start)){
   this.germs = [];
   this.makeGerms(300);
   this.player =  this.makePlayer();
   this.start = false;
 }



};


Game.prototype.handleEject = function(game){

  game.player.radius=Math.sqrt(Math.pow(game.player.radius,2)*0.95);

   var vec = {x: -game.player.vel.x/(Util.magnitude(game.player.vel.x,game.player.vel.y)), y: -game.player.vel.y/(Util.magnitude(game.player.vel.x,game.player.vel.y)) }
   var pos = {x: (vec.x*game.player.radius*1.3)+ game.player.pos.x, y: (vec.y*game.player.radius*1.3)+ game.player.pos.y};

   var vel = {x: -game.player.vel.x, y:-game.player.vel.y};
   var radius =  Math.sqrt(Math.pow(game.player.radius,2)*0.05);
   var density = 1;

   var newGerm = new Germ({id:game.germs.length+1, radius: radius, density: density, pos: pos, vel: vel, color:"#66cdaa"});
   game.germs.push(newGerm);
},

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
  var options = {id:9000, radius: radius, density: density, pos: pos, vel: vel, color:"#4682b4"};
  return new Player(options);

};

Game.prototype.makeGerms = function(num){
  for(var i = 0; i<num;i++){
    var pos = {x:Math.random()*this.ctx.width, y:Math.random()*this.ctx.height};
    var vel = {x:(Math.random()-0.5)*1, y:(Math.random()-0.5)*1};
    var radius =  Math.random()*15;
    var density = 1;
    var options = {id:i+1, radius: radius, density: density, pos: pos, vel: vel, color:"#66cdaa"};
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


Game.prototype.checkGameOver = function(){
  if(this.player.radius <= 1 ){
    this.over = "lost";
  }
  if(this.germs.length===0){
    this.over = "won";
  }
};

Game.prototype.checkStart = function(ctx){
  if(this.start){
    this.renderStart(ctx);
  }
};

Game.prototype.renderStart = function(ctx){

  ctx.save();
  ctx.globalAlpha = 0.2;
  ctx.fillRect(0,0,ctx.width,ctx.height);
  ctx.restore();



  ctx.save();


    ctx.fillStyle="#FFFFFF";
    ctx.font = "60px Arial";
    ctx.fillText("press space to play!",ctx.width/2-250,ctx.height/2-10);

  ctx.restore();


};

Game.prototype.renderOver = function(ctx){
  ctx.save();
  ctx.globalAlpha = 0.5;
  ctx.fillRect(0,0,ctx.width,ctx.height);
  ctx.restore();

  ctx.save();


  if(this.over === "lost"){

    ctx.fillStyle="#FFFFFF";
    ctx.font = "30px Arial";
    ctx.fillText("Game Over :\(",ctx.width/2-80,ctx.height/2-30);
    ctx.fillText("press space to play again",ctx.width/2-150,ctx.height/2);

  }else if (this.over === "won"){
    ctx.fillStyle="#FFFFFF";
    ctx.font = "30px Arial";
    ctx.fillText("You Won!",ctx.width/2-30,ctx.height/2-10);
    ctx.fillText("press space to play again",ctx.width/2-150,ctx.height/2-30);
  }
  ctx.restore();
},

Game.prototype.render = function(ctx){
  if(!this.start){

      this.player.render(ctx,this.germs);
  }


for(var i =0;i < this.germs.length; i++){
    this.germs[i].render(ctx,this.germs);

    if(this.germs[i].radius<=1){
     this.germs.splice(i,1);
     i-=1;
    }
  }

  this.checkGameOver();

};

Game.prototype.draw = function(ctx){
  this.drawBackground(ctx);
  if(this.start){
    this.checkStart(ctx);
  }else{
    this.player.draw(ctx);
  }

  if(this.debugger){
  this.cursorPos(ctx);
  }
  this.germs.forEach(function(germ){germ.draw(ctx);});

  if(this.over){
    this.renderOver(ctx);
  }
};


Game.prototype.drawBackground = function(ctx){
  base_image = new Image();
  base_image.src = this.backgroundImage;
  ctx.drawImage(base_image, 0, 0, ctx.width, ctx.height);
};




Game.prototype.animate = function(){
  this.ctx.clearRect(0, 0, this.ctx.width, this.ctx.height);
  this.render(this.ctx);
  this.draw(this.ctx);
  requestAnimationFrame(this.animate.bind(this));
};

module.exports = Game;
