var canvas = document.getElementById('canvas');
canvas.width = "1000";
canvas.height = "700";
var c = canvas.getContext('2d');
c.width = 1000;
c.height = 700;
var Game = require('./game');



document.addEventListener("DOMContentLoaded", function(){

  var game = new Game(c,canvas);
  game.animate();

});
