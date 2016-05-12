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
	canvas.width = "1000";
	canvas.height = "700";
	var c = canvas.getContext('2d');
	c.width = 1000;
	c.height = 700;
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

	  ctx.arc(this.pos.x,this.pos.y,this.radius,0,2*Math.PI);
	  ctx.fill();


	  ctx.restore();
	};

	module.exports = Ball;


/***/ },
/* 4 */
/***/ function(module, exports) {

	var Util = {
	  checkBounds: function(obj,ctx){

	    var inelasticCoeff = 1;

	    if(Math.abs(obj.vel.y)<0.1){
	      obj.vel.y=0;
	    }


	    if((obj.pos.x +obj.radius)>ctx.width){
	      obj.pos.x=ctx.width-obj.radius*1.001;
	      obj.vel.x=-obj.vel.x*inelasticCoeff ;
	    }
	    if((obj.pos.x -obj.radius)<0) {
	      obj.pos.x=0+obj.radius*1.001;
	      obj.vel.x=-obj.vel.x*inelasticCoeff;
	    }
	    if((obj.pos.y +obj.radius)>ctx.height){
	      obj.pos.y=ctx.height-obj.radius*1.001;
	      obj.vel.y=-obj.vel.y*inelasticCoeff;
	    }
	    if((obj.pos.y -obj.radius)<0){
	      obj.pos.y=0+obj.radius*1.001;
	      obj.vel.y=-obj.vel.y*inelasticCoeff;

	    }

	  },

	  checkCollison : function(ball1,ball2){
	    var objDistance = Math.sqrt(Math.pow(ball1.pos.x-ball2.pos.x,2)+Math.pow(ball1.pos.y-ball2.pos.y,2));
	    var check = objDistance  < ball1.radius+ ball2.radius;


	     if( check ){
	      //  var diff = ball1.radius+ ball2.radius - objDistance;
	      //  var mag = Math.sqrt(Math.pow(ball1.pos.x-ball2.pos.x,2) + Math.pow(ball1.pos.y-ball2.pos.y,2));
	      //  var distance = {x: Math.abs(ball1.pos.x - ball2.pos.x)/(mag)*diff, y: Math.abs(ball1.pos.y-ball2.pos.y)/(mag)*diff};
	       //
	       //
	      //  var distCoeff = 0.51;
	       //
	      //  if(ball1.pos.x > ball2.pos.x){
	      //    ball1.pos.x+=distance.x*distCoeff;
	      //    ball2.pos.x-=distance.x*distCoeff;
	      //  }else{
	      //    ball1.pos.x-=distance.x*distCoeff;
	      //    ball2.pos.x+=distance.x*distCoeff;
	      //  }
	       //
	      //  if(ball1.pos.y > ball2.pos.y){
	      //    ball1.pos.y+=distance.y*distCoeff;
	      //    ball2.pos.y-=distance.y*distCoeff;
	      //   }else{
	      //    ball1.pos.y-=distance.y*distCoeff;
	      //    ball2.pos.y+=distance.y*distCoeff;
	      //  }

	       this.enforceCollison(ball1,ball2);
	     }



	  },

	  enforceCollison: function(ball1,ball2){

	    if(ball1.radius > 1 && ball2.radius >1){
	      var massExchange = 20;

	      if(ball1.radius > ball2.radius){





	        ball2.radius=Math.sqrt(Math.pow(ball2.radius,2)-massExchange);
	        ball1.radius=Math.sqrt(Math.pow(ball1.radius,2)+massExchange);

	      }else{
	        ball2.radius=Math.sqrt(Math.pow(ball2.radius,2)+massExchange);
	        ball1.radius=Math.sqrt(Math.pow(ball1.radius,2)-massExchange);

	      }
	    }
	  },

	  inherits: function (ChildClass, BaseClass) {
	    function Surrogate () { this.constructor = ChildClass; }
	    Surrogate.prototype = BaseClass.prototype;
	    ChildClass.prototype = new Surrogate();
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

	// Player.prototype.render = function(ctx){
	//
	//   this.pos.x+=this.vel.x;
	//   this.pos.y+=this.vel.y;
	//   Util.checkBounds(this,ctx);
	//
	//
	// };





	module.exports = Player;


/***/ }
/******/ ]);