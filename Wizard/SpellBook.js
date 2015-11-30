/*
      This is where the basic spell components are defined.
 */
var FireBall = require('../FireBall.js');
var Helper = require('../Helper.js');

function SpellBook(wizard) {
    this.wizard = wizard;
    this.game = wizard.game;
    this.state = wizard.worldObject.state;
}

SpellBook.prototype.castFireBall = function(params) {
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
    if ( !this.checkAndSubtractMana(manaCost)) {
        // Don't do anything not enough mana for that
        return;
    }
    var position = Helper.castFireBallStartPosition( arguments , this.state.position , this.state.width , this.state.height);
    var fireball = new FireBall.FireBall(direction , speed , position , radius);
    this.game.addFireBall(fireball);
};


SpellBook.prototype.getPOS = function(params) {
    // This one is free
    return this.state.position;
};

SpellBook.prototype.moveToPOS = function(params) {
    var currentPosition = this.state.position;
    var x = params['0'];
    var y = params['1'];
    if ( !( x && y)) {
        // TODO invlide params feedback
        return;
    }

    var newPos = {
        x: x,
        y: y
    };

    if (! this.game.canBeAt(newPos , this.wizard.worldObject)) {
        // TODO invalid params feedback
        return;
    }

    var distance = Math.sqrt( Math.pow(currentPosition.x - newPos.x,2)   + Math.pow(currentPosition.y - newPos.y,2));
    var manaCost = distance / 50;
    if ( this.checkAndSubtractMana(manaCost) ) {
        this.state.position.x = x;
        this.state.position.y = y;
    }
    return this.state.position;
};


SpellBook.prototype.getFireBallsPOS = function(params) {
    // Costs 5 cause....
    var manaCost = 5;
    if ( this.checkAndSubtractMana(manaCost)) {
        return this.game.fireBallList.state.fireBalls;
    } else {
        return [];
        //return errorMessage("");
    }
};

SpellBook.prototype.getOpponentPOS = function(params) {
    var manaCost = 1;
    if( !this.checkAndSubtractMana(manaCost) ) {
        return;
    }
    if ( this.game.redWizard == this) {
        return this.game.redWizard.worldObject.state.position;
    }else {
        return this.game.blueWizard.worldObject.state.position;
    }
};

// Helper Functions
SpellBook.prototype.checkAndSubtractMana = function(cost) {
    if ( cost > this.state.mana) {
        return false;
    }  else {
       this.state.mana -= cost;
        return true;
    }
};

module.exports = SpellBook;