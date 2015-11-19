var HELPER = {};
HELPER.castFireBallCheckParams = function(params) {
    var speed = params.speed;
    var radius = params.radius;
    if ( Math.abs(speed) > 10 ) {
        throw {message:"CastFireBall:Speed is too large"};
    }
    if ( Math.abs(radius) > 20) {
        throw {message:"CastFireBall:Radius is too large"};
    }
};
HELPER.castFireBallManaCacl = function(params) {
    var speed = params.speed;
    var radius = params.radius;
    var manaCost = Math.abs(speed) + radius / 5;
    return manaCost;
};
HELPER.castFireBallStartPosition = function(params , casterPosition , casterWidth , casterHeight) {
    var direction = params.direction;
    var radius    = params.radius;
    //console.log(direction * 180 / Math.PI);
    //console.log(params);
    //console.log(arguments);
    var position = {
        x : casterPosition.x + Math.sin(direction) * (casterWidth * 2  + radius),
        y : casterPosition.y + Math.cos(direction) * (casterHeight * 2 + radius),
    };
    //console.log(position);
    return position;
};

module.exports = HELPER;