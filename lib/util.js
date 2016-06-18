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
