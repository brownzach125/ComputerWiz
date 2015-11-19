var vm = require('vm');
var FireBall = require('./FireBall.js');
var Helper = require('./Helper.js');
var SpellController = require('./SpellController.js');

var WIZARD_ACCEL = 0.5;
var WIZARD_SPEED_FRICTION = 0.4;
function Wizard(x , y , game) {
    this.up = false;
    this.down = false;
    this.right = false;
    this.left = false;
    this.vector   = 0;
    this.velocity = 0;
    this.game = game;
    this.state =  {
        position: {
            x: x,
            y: y
        },
        health : 100,
        mana: 100,
        height: 20,
        width: 20,
    };
    this.spellController = new SpellController(this);
}
Wizard.prototype.restart = function(pos) {
    this.state.health = 100;
    this.state.mana = 100;
    this.state.position.x = pos.x;
    this.state.position.y = pos.y;
    this.spellController.reset();
};

Wizard.prototype.castFireBall = function(params) {
    var direction = params['0'];
    var speed = params['1'];
    var radius = params['2'];
    direction = direction * Math.PI  / 180;
    var arguments = {
        direction : direction,
        speed: speed ,
        radius: radius};
    Helper.castFireBallCheckParams( arguments );
    var manaCost = Helper.castFireBallManaCacl( arguments);
    if ( manaCost > this.state.mana ) {
        return;
    }
    else {
        this.state.mana -= manaCost;
    }
    var position = Helper.castFireBallStartPosition( arguments , this.state.position , this.state.width , this.state.height);
    var fireball = new FireBall.FireBall(direction , speed , position , radius);
    this.game.addFireBall(fireball);
};

Wizard.prototype.getPOS = function(params) {
    // TODO mana cost
  return this.state.position;
};

Wizard.prototype.moveToPOS = function(params) {
  var x = params['0'];
    var y = params['1'];
    if ( x && y ) {
        // TODO prevent from leaving arean
        this.state.position.x = x;
        this.state.position.y = y;
    }
    return this.state.position;
};

Wizard.prototype.getFireBallsPOS = function(params) {
    return this.game.fireBallList.state.fireBalls;
};

Wizard.prototype.createSpell = function ( spell ) {
    console.log("Creating spell " + spell.slot);
    var slot = spell.slot;
    var code = spell.code;
    var spellInfo = this.spellController.createSpell(spell);
    if ( spellInfo ) {
        spell.problem = spellInfo.problem;
    }
    this.client.emit('spellCreation' , spell);
};

Wizard.prototype.castSpell = function(slot) {
    this.spellController.castSpell(slot);
};

Wizard.prototype.update = function() {
    // Regain some mana
    if ( this.state.mana < 100 ) {
        this.state.mana+=.1;
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
    if ( this.vector == 0) {
        this.facing = "down";
    }
};

Wizard.prototype.takeHit = function(projectile) {
    console.log("Ive been hit");
    // TODO refine
    this.state.health-=10;
};

Wizard.prototype.keyDown = function(data) {
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
            this.castSpell(1);
            break;
        // 2
        case 50:
            this.castSpell(2);
            break;
        // 3
        case 51:
            this.castSpell(3);
            break;
        // 4
        case 52:
            this.castSpell(4);
            break;
        // 5
        case 53:
            this.castSpell(5);
            break;
        // 6
        case 54:
            this.castSpell(6);
            break;
    }
};

Wizard.prototype.keyUp = function(data) {
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

Wizard.prototype.getTopBounds = function() {
    return this.state.position.y + this.state.height
};

Wizard.prototype.getBottomBounds = function() {
    return this.state.position.y - this.state.height;
};

Wizard.prototype.getLeftBounds = function() {
    return this.state.position.x - this.state.width;
};

Wizard.prototype.getRightBounds = function() {
    return this.state.position.x + this.state.width;
};

Wizard.prototype.getTopBoundsFromPos = function(pos) {
    return pos.y + this.state.width;
};

Wizard.prototype.getBottomBoundsFromPos = function(pos) {
    return pos.y - this.state.height;
};

Wizard.prototype.getLeftBoundsFromPos = function(pos) {
    return pos.x - this.state.width;
};

Wizard.prototype.getRightBoundsFromPos = function(pos) {
    return pos.x + this.state.width;
}
module.exports = Wizard;
