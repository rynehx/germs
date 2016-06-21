/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	var canvas = document.getElementById('canvas');
	canvas.width = window.innerWidth*0.95;
	canvas.height = window.innerHeight*0.95;
	var c = canvas.getContext('2d');
	c.width = window.innerWidth*0.95;
	c.height = window.innerHeight*0.95;
	var Game = __webpack_require__(1);

	document.addEventListener("DOMContentLoaded", function(){

	  var game = new Game(c,canvas);
	  game.animate();

	});


/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	var Germ = __webpack_require__(2);
	var msg= "0:0";
	var targetPos = {x:0, y:0};
	var Player = __webpack_require__(5);
	var Util = __webpack_require__(4);

	function getMousePos(ctx,e){
	  var canvasBox = this.canvas.getBoundingClientRect();
	  return {x: e.clientX - canvasBox.left, y: e.clientY -canvasBox.top};
	}



	var Game = function(ctx,canvas){
	  this.germN = 300;
	  this.playerSize  = Math.floor(((ctx.width+ctx.height)/1800)*12);
	  this.maxGermSize = Math.floor(((ctx.width+ctx.height)/1800)*16);
	  this.backgroundImageUrl = "https://s3-us-west-1.amazonaws.com/germ/Silver-Blur-Background_fk8fyd.jpg";
	  this.ctx = ctx;
	  this.canvas = canvas;
	  this.germs = [];
	  this.makeGerms(this.germN/2, this.maxGermSize);
	  this.player =  "";//this.makePlayer();
	  this.start = true;
	  this.over = false;
	  this.debugger = false;

	  this.canvas.addEventListener('mousemove',
	  function(e){this.handleMouseMove(ctx,e);}.bind(this), false);
	  this.createBackground();
	  document.addEventListener('keydown',  function(e){this.handleKeyDown(e);}.bind(this), false);
	//  this.canvas.addEventListener('keyup',this.handleKeyDown);

	};

	Game.prototype.handleKeyDown= function(e){
	  var key = e.keyCode;
	  var speedThresh = 10;
	 if(key === 38 || key === 87){//up
	   if(this.player.vel.y>-speedThresh){
	     this.player.vel.y-=0.5;
	     this.handleEject(this);
	   }
	 }else if(key === 39 || key === 68){//right
	   if(this.player.vel.x<speedThresh){
	     this.player.vel.x+=0.5;
	      this.handleEject(this);
	   }
	 }else if(key === 40 || key === 83){//down
	   if(this.player.vel.y<speedThresh){
	    this.player.vel.y+=0.5;
	     this.handleEject(this);
	   }
	 }else if(key === 65 || key === 37){//left
	   if(this.player.vel.x>-speedThresh){
	     this.player.vel.x-=0.5;
	      this.handleEject(this);
	   }
	 }else if(key === 32 && this.over){
	   this.germs = [];
	   this.makeGerms(this.germN, this.maxGermSize);
	   this.player =  this.makePlayer(this.playerSize);
	   this.over = false;
	 }else if(key === 67){
	   this.debugger = !this.debugger;
	 }else if(key === 32 && (this.start)){
	   this.germs = [];
	   this.makeGerms(this.germN, this.maxGermSize);
	   this.player =  this.makePlayer(this.playerSize);
	   this.start = false;
	 }else if(key === 82){
	   this.germs = [];
	   this.makeGerms(this.germN, this.maxGermSize);
	   this.player =  this.makePlayer(this.playerSize);
	   this.start = false;
	 }
	};


	Game.prototype.handleEject = function(game){

	  game.player.radius=Math.sqrt(Math.pow(game.player.radius,2)*0.99);

	   var vec = {x: -game.player.vel.x/(Util.magnitude(game.player.vel.x,game.player.vel.y)),
	     y: -game.player.vel.y/(Util.magnitude(game.player.vel.x,game.player.vel.y)) };

	   var pos = {x: (vec.x*game.player.radius*1.3)+ game.player.pos.x,
	     y: (vec.y*game.player.radius*1.3)+ game.player.pos.y};

	   var vel = {x: -game.player.vel.x, y:-game.player.vel.y};
	   var radius =  Math.sqrt(Math.pow(game.player.radius,2)*0.01);
	   var density = 1;

	   var newGerm = new Germ({id:game.germs.length+1,
	     radius: radius, density: density, pos: pos, vel: vel, color:"#469eb4"});  //"#66cdaa"
	   game.germs.push(newGerm);
	},

	Game.prototype.handleMouseMove = function(ctx, e){
	  var mousePos = getMousePos(ctx,e);
	  msg = "" + mousePos.x + " : " + mousePos.y;
	  targetPos = mousePos;
	};


	Game.prototype.makePlayer = function(size){
	  var pos = {x:this.ctx.width/2, y:this.ctx.height/2};
	  var vel = {x: 0 , y: 0};
	  var radius =  size;
	  var density = 1;
	  var options = {id:9000, radius: radius, density: density, pos: pos, vel: vel, color:"#4682b4"};
	  return new Player(options);

	};

	Game.prototype.makeGerms = function(num, maxRadius){
	  for(var i = 0; i<num;i++){
	    var pos = {x:Math.random()*this.ctx.width, y:Math.random()*this.ctx.height};
	    if(pos.x > this.ctx.width*0.4 && pos.x < this.ctx.width*0.6 && pos.y > this.ctx.height*0.4 && pos.y < this.ctx.height*0.6){
	      i-=1;
	      continue;
	    }
	    var vel = {x: (Math.random() - 0.5) * 1, y: (Math.random() - 0.5) * 1};
	    var radius =  Math.random() * maxRadius;
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

	  var eliminated = this.germs.every(function(el){
	    return el.color !== "#66cdaa";
	  });

	  if(eliminated){
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
	  var playFont = (ctx.width+ctx.height)/1800*60;
	  var instructionFont = (ctx.width+ctx.height)/1800*20;

	  ctx.fillStyle="#FFFFFF";
	  ctx.font = playFont+ "px Arial";
	  ctx.fillText("press space to play!",ctx.width/2 - (ctx.width/1000*225) ,ctx.height/2);

	  ctx.font = instructionFont + "px Arial";
	  ctx.fillText("Intructions:", ctx.width*0.02 , ctx.height*0.1);
	  ctx.fillText("1. use WASD or arrow keys to move", ctx.width*0.02, ctx.height*0.1 + instructionFont);
	  ctx.fillText("2. collide with smaller germs to eat them", ctx.width*0.02, ctx.height*0.1 + instructionFont*2);
	  ctx.fillText("3. avoid bigger germs", ctx.width*0.02, ctx.height*0.1 + instructionFont*3);
	  ctx.fillText("4. moving ejects your own mass!", ctx.width*0.02, ctx.height*0.1 + instructionFont*4);
	  ctx.fillText("5. press 'r' to restart", ctx.width*0.02, ctx.height*0.1 + instructionFont*5);
	  ctx.fillText("6. to win absorb all GREEN germs", ctx.width*0.02, ctx.height*0.1 + instructionFont*6);
	  ctx.restore();

	};

	Game.prototype.renderOver = function(ctx){
	  ctx.save();
	  ctx.globalAlpha = 0.5;
	  ctx.fillRect(0,0,ctx.width,ctx.height);
	  ctx.restore();

	  ctx.save();


	  if(this.over === "lost"){
	    var overFont = (ctx.width+ctx.height)/1800*40;
	    ctx.fillStyle="#FFFFFF";
	    ctx.font = overFont+ "px Arial";
	    ctx.fillText("Game Over :\(",ctx.width/2 - (ctx.width/1000*120) ,ctx.height/2 - overFont*1.4);
	    ctx.fillText("press space to play again",ctx.width/2 - (ctx.width/1000*200) ,ctx.height/2 );

	  }else if (this.over === "won"){
	    var overFont = (ctx.width+ctx.height)/1800*40;
	    ctx.fillStyle="#FFFFFF";
	    ctx.font = overFont+ "px Arial";
	    ctx.fillText("  You Won! ", ctx.width/2 - (ctx.width/1000*120) ,ctx.height/2 - overFont*1.4);
	    ctx.fillText("press space to play again",ctx.width/2 - (ctx.width/1000*200) ,ctx.height/2 );
	  }
	  ctx.restore();
	};

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

	  if(this.debugger){
	  this.cursorPos(ctx);
	  }

	  this.germs.forEach(function(germ){germ.draw(ctx);});
	  if(this.start){
	    this.checkStart(ctx);
	  }else{
	    this.player.draw(ctx);
	  }


	  if(this.over){
	    this.renderOver(ctx);
	  }
	};


	Game.prototype.drawBackground = function(ctx){
	  ctx.drawImage(this.backgroundImage, 0, 0, ctx.width, ctx.height);
	};

	Game.prototype.createBackground = function(){
	  this.backgroundImage = new Image();
	  this.backgroundImage.src = this.backgroundImageUrl;
	};




	Game.prototype.animate = function(){
	  this.ctx.clearRect(0, 0, this.ctx.width, this.ctx.height);
	  this.render(this.ctx);
	  this.draw(this.ctx);
	  requestAnimationFrame(this.animate.bind(this));
	};

	module.exports = Game;


/***/ },
/* 2 */
/***/ function(module, exports, __webpack_require__) {

	var Ball = __webpack_require__(3);
	var Util = __webpack_require__(4);

	var Germ = function(options){
	    Ball.call(this, options);
	};

	Util.inherits(Germ, Ball);

	module.exports = Germ;


/***/ },
/* 3 */
/***/ function(module, exports, __webpack_require__) {

	var Util = __webpack_require__(4);

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


/***/ },
/* 4 */
/***/ function(module, exports) {

	var Util = {
	  checkBounds: function(obj, ctx){

	    var inelasticCoeff = 0.5;

	    if(Math.abs(obj.vel.y) < 0.1){
	      obj.vel.y = 0;
	    }

	    if((obj.pos.x + obj.radius) > ctx.width){
	      obj.pos.x = ctx.width - obj.radius*1.001;
	      obj.vel.x =- obj.vel.x * inelasticCoeff ;
	    }
	    if((obj.pos.x - obj.radius) < 0) {
	      obj.pos.x = 0 + obj.radius * 1.001;
	      obj.vel.x =- obj.vel.x * inelasticCoeff;
	    }
	    if((obj.pos.y + obj.radius) > ctx.height){
	      obj.pos.y = ctx.height - obj.radius*1.001;
	      obj.vel.y =- obj.vel.y * inelasticCoeff;
	    }
	    if((obj.pos.y - obj.radius) < 0){
	      obj.pos.y = 0 + obj.radius * 1.001;
	      obj.vel.y =- obj.vel.y * inelasticCoeff;
	    }
	  },

	  checkCollison : function(ball1, ball2){
	    var objDistance = Math.sqrt(Math.pow(ball1.pos.x-ball2.pos.x,2) + Math.pow(ball1.pos.y-ball2.pos.y,2));
	    var check = objDistance  < ball1.radius + ball2.radius;

	     if( check ){
	       this.enforceCollison(ball1,ball2);
	     }
	  },

	  enforceCollison: function(ball1, ball2){
	    var massExchange = 16;

	    if(ball1.radius > 0 && ball2.radius > 0){
	      if(ball1.radius > ball2.radius){
	        if(ball2.radius > 4.001){
	          massExchange = (ball2.radius/4)*16;//dynamic scaling mass exchange
	        ball2.radius = Math.sqrt(Math.pow(ball2.radius,2) - massExchange);
	        ball1.radius = Math.sqrt(Math.pow(ball1.radius,2) + massExchange);
	        }else{
	          ball2.radius = 0;
	          ball1.radius = Math.sqrt(Math.pow(ball1.radius,2) + Math.pow(ball2.radius, 2));
	        }
	      }else{
	        if(ball1.radius > 4.001){
	            massExchange = (ball1.radius/4)*16;//dynamic scaling mass exchange
	          ball2.radius = Math.sqrt(Math.pow(ball2.radius,2) + massExchange);
	          ball1.radius = Math.sqrt(Math.pow(ball1.radius,2) - massExchange);
	        }else{
	          ball1.radius = 0;
	          ball2.radius = Math.sqrt(Math.pow(ball2.radius,2) + Math.pow(ball1.radius, 2));
	        }
	      }

	    }
	  },

	  inherits: function (ChildClass, BaseClass) {
	    function Surrogate () { this.constructor = ChildClass; }
	    Surrogate.prototype = BaseClass.prototype;
	    ChildClass.prototype = new Surrogate();
	  },

	  magnitude: function(unit1, unit2){
	    return Math.sqrt(Math.pow(unit1,2)+Math.pow(unit2,2));
	  }

	};

	module.exports = Util;


/***/ },
/* 5 */
/***/ function(module, exports, __webpack_require__) {

	var Ball = __webpack_require__(3);
	var Util = __webpack_require__(4);

	var Player = function(options){
	    Ball.call(this, options);
	};

	Util.inherits(Player, Ball);

	module.exports = Player;


/***/ }
/******/ ]);