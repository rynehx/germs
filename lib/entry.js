var canvas = document.getElementById('canvas');
canvas.width = window.innerWidth*0.95;
canvas.height = window.innerHeight*0.95;
var c = canvas.getContext('2d');
c.width = window.innerWidth*0.95;
c.height = window.innerHeight*0.95;
var Game = require('./game');

document.addEventListener("DOMContentLoaded", function(){

  var game = new Game(c,canvas);
  game.animate();

});
