var vm = require('vm');
var FireBall = require('./FireBall.js');

var WIZARD_SPEED = 2;
var WIZARD_ACCEL = 0.5;
var WIZARD_SPEED_FRICTION = 0.4;


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
    var position = {
        x : casterPosition.x + Math.sin(direction) * (casterWidth  + radius),
        y : casterPosition.y + Math.cos(direction) * (casterHeight + radius),
    };
    return position;
};



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

    this.x = 1;
    this.scripts = {
        1: null,
        2: null,
        3: null,
        4: null,
        5: null,
    };

    // Object presented to players for their 'spells'
    // Restricts access to variables
    var that = this;
    var Helper = HELPER;
    function BASIC() {
        this.castFireBall = function(direction , speed , radius) {
            var arguments = {direction : direction,
            speed: speed ,
            radius: radius};
            Helper.castFireBallCheckParams( arguments );
            var manaCost = Helper.castFireBallManaCacl( arguments);
            if ( manaCost > that.state.mana ) {
                return;
            }
            else {
                that.state.mana -= manaCost;
            }
            var position = Helper.castFireBallStartPosition( arguments , that.state.position , that.state.width , that.state.height);
            direction = direction * Math.PI  / 180;
            var fireball = new FireBall.FireBall(direction , speed , position , radius);
            that.game.addFireBall(fireball);
        }
    }
    this.basic = new BASIC();
    var sandbox = {
        BASIC: this.basic,
    };
    this.context = vm.createContext(sandbox);
}

Wizard.prototype.restart = function(pos) {
    this.state.health = 100;
    this.state.mana = 100;
    this.state.position.x = pos.x;
    this.state.position.y = pos.y;
};


Wizard.prototype.createSpell = function ( spell ) {
    console.log("Creating spell " + spell.slot);
    var slot = spell.slot;
    var code = spell.code;
    console.log(code);
    var script = new vm.Script(code);
    var spell = this.analyzeSpell(script);
    this.scripts[slot] = script;
    spell.slot = slot;
    spell.code = code;
    this.client.emit('spellCreation' , spell);
};

/*
    To analyze the spell I essentiall run the spell, but i need to reset state...
    its ugly
 */
Wizard.prototype.analyzeSpell = function(script) {
    // TODO Run the spell and check certain things to determine mana cost
    var startMana = this.state.mana;
    var spell = {
        mana : 1,
        problem : ''
    };
    try {
        //vm.runInNewContext('var x = 1000; while(x > 0){ x--; console.log(x);}' , { console: console } , {timeout: 10});
        script.runInContext(this.context , {timeout : 100});
    }
    catch( err ) {
        // TODO get more information to send
        spell.problem = err.message;
        console.log(err);
    }

    // TODO hack
    this.state.mana= startMana;
    this.game.fireBallList.clear();

    return spell;
};

Wizard.prototype.castSpell = function(slot) {
    console.log("Spell " + slot + " casted");
    if ( slot in this.scripts && this.scripts[slot]) {
        this.scripts[slot].runInContext(this.context);
    }
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
};








module.exports = Wizard;