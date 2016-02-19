/* jshint node:true */

var Intersectable = require('./../Intersectable.js');

var WIZARD_ACCEL = 0.5;
var WIZARD_SPEED_FRICTION = 0.4;

var WIZARD_WIDTH = 30; //TODO this could be dynamic?
var WIZARD_HEIGHT = 44;

function WizardWorldObject(x , y, wizard) {
    this.wizard = wizard;
    this.up = false;
    this.down = false;
    this.right = false;
    this.left = false;
    this.vector   = 0;
    this.velocity = 0;
    this.game = wizard.game;
    this.state =  {
        position: {
            x: x,
            y: y
        },
        health : 100,
        mana: 100,
        height: WIZARD_HEIGHT,
        width: WIZARD_WIDTH,
    };
}

WizardWorldObject.prototype = new Intersectable();

WizardWorldObject.prototype.restart = function(pos) {
    this.state.health = 100;
    this.state.mana = 100;
    this.state.position.x = pos.x;
    this.state.position.y = pos.y;
};

WizardWorldObject.prototype.update = function() {
    // Regain some mana
    if ( this.state.mana < 100 ) {
        this.state.mana += 0.1;
    }

    var moving = false;
    var vX = 0;
    var vY = 0;

    if(this.up) {
        vY -= 1;
        moving = true;
    }
    if(this.down) {
        vY += 1;
        moving = true;
    }
    if(this.left) {
        vX -= 1;
        moving = true;
    }
    if(this.right) {
        vX += 1;
        moving = true;
    }
    if(moving) {
        this.velocity += WIZARD_ACCEL;
        this.vector = Math.atan2(vX, vY);
    }
    var newPos = {
        x: this.state.position.x + Math.sin(this.vector ) *  this.velocity,
        y: this.state.position.y + Math.cos(this.vector ) *  this.velocity
    };

    if(this.game.canBeAt({x: newPos.x, y: this.state.position.y}, this)) {
        this.state.position.x = newPos.x;
    }
    else { // try to move a smaller amount
        newPos.x = this.state.position.x + Math.sin(this.vector ) * this.velocity / 2;
        if(this.game.canBeAt({x: newPos.x, y: this.state.position.y}, this))
            this.state.position.x = newPos.x;
    }

    if(this.game.canBeAt({x: this.state.position.x, y: newPos.y}, this)) {
        this.state.position.y = newPos.y;
    }
    else { // try to move a smaller amount
        newPos.y = this.state.position.y + Math.cos(this.vector ) *  this.velocity / 2;
        if(this.game.canBeAt({x: this.state.position.x, y: newPos.y}, this))
            this.state.position.y = newPos.y;
    }
    this.velocity -= this.velocity * WIZARD_SPEED_FRICTION;

    //update facing
    if(this.vector > 0 && this.vector < Math.PI)
        this.state.facing = "right";
    else if(this.vector < 0)
        this.state.facing = "left";
    if ( this.vector == Math.PI) {
        this.state.facing = "up";
    }
    if ( this.vector === 0) {
        this.facing = "down";
    }
};

WizardWorldObject.prototype.takeHit = function(projectile) {
    this.state.health-=10;
};

WizardWorldObject.prototype.keyDown = function(data) {
    switch (data) {
        // W, Up Arrow
        case 87:
        case 38: 	this.up = true;
            break;

        // A, Left Arrow
        case 65:
        case 37: 	this.left = true;
            break;

        // S, Down Arrow
        case 83:
        case 40: 	this.down = true;
            break;

        // D, Right Arrow
        case 68:
        case 39: 	this.right = true;
            break;
        // 1
        case 49:
            this.wizard.castSpell(1);
            break;
        // 2
        case 50:
            this.wizard.castSpell(2);
            break;
        // 3
        case 51:
            this.wizard.castSpell(3);
            break;
        // 4
        case 52:
            this.wizard.castSpell(4);
            break;
        // 5
        case 53:
            this.wizard.castSpell(5);
            break;
        // 6
        case 54:
            this.wizard.castSpell(6);
            break;
    }
};

WizardWorldObject.prototype.keyUp = function(data) {
    switch (data) {
        // W, Up Arrow
        case 87:
        case 38: 	this.up = false;
            break;
        // A, Left Arrow
        case 65:
        case 37: 	this.left = false;
            break;
        // S, Down Arrow
        case 83:
        case 40: 	this.down = false;
            break;
        // D, Right Arrow
        case 68:
        case 39: 	this.right = false;
            break;

    }
};

module.exports = WizardWorldObject;