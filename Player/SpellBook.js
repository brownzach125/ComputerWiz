/*
      Every wizard has a personal spellbook object. Right now they are all just copies of the spell book object
      in shared/spellbook, but one day they could be different.

 */
var masterSpellBook = require('../public/shared/SpellBook.js');

function SpellBook(wizard) {
    this.wizard = wizard;
    this.game = wizard.game;

    for (var obj in masterSpellBook) {
        this[obj] = masterSpellBook[obj].code;
    }
}

/*

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
*/

module.exports = SpellBook;