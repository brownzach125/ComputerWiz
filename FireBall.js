/* jshint node:true */

var Intersectable = require('./public/Intersectable.js');

var FIREBALL_WIDTH = 46; 
var FIREBALL_HEIGHT = 27;

function FireBallList(game) {
    this.state = {
        // Holds the fireball states
        fireBalls: []
    };
    this.fireBalls = [];
    this.game = game;
}

FireBallList.prototype.addFireBall = function(fireball) {
    this.fireBalls.push(fireball);
    this.state.fireBalls.push(fireball.state);
    fireball.list = this;
};

FireBallList.prototype.update = function() {
    var removeList = [];
    for ( var index in this.fireBalls ) {
        if (this.fireBalls[index].update()) {
            removeList.push(index);
        }
    }
    for ( var index in removeList ) {
        var v = removeList[index];
        this.fireBalls.splice(v , 1);
        this.state.fireBalls.splice(v , 1);
    }
};

FireBallList.prototype.clear = function() {
    this.fireBalls = [];
    this.state.fireBalls = [];
};

function FireBall(direction , velocity , pos , radius) {
    this.state = {
        direction: direction,
        velocity: velocity,
        position: {
            x: pos.x,
            y: pos.y
        },
        radius: radius,
        width: radius * FIREBALL_WIDTH / FIREBALL_HEIGHT,
        height: radius  * FIREBALL_HEIGHT / FIREBALL_WIDTH
    };
    console.log(this.state.width);
    console.log(this.state.height);
}

FireBall.prototype = new Intersectable();

FireBall.prototype.update = function() {
    var newPos = {
        x: this.state.position.x + Math.cos(this.state.direction ) *  this.state.velocity,
        y: this.state.position.y + Math.sin(this.state.direction ) *  this.state.velocity
    };
    this.state.position = newPos;
    var nohit = this.list.game.canBeAt(newPos, this);
    this.list.game.hitWizard(this);
    if ( !nohit) {
        return true;
    }
    return false;
};

module.exports = {
    FireBallList : FireBallList,
    FireBall : FireBall
};