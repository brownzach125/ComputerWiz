/*
    Centralized location for all Spell information
    TODO make game effects object for spells to use.
 */

if ( typeof window === 'undefined') {
    var FireBall = require('../../FireBall.js');
    var Helper = require('../../Helper.js');
}
else {
}

var SpellBook = {};
SpellBook.castFireBall = {};
SpellBook.castFireBall.code = function(game, wizard, direction ,speed , radius) {
    direction = direction * Math.PI  / 180;
    var arguments = {
        direction : direction,
        speed: speed,
        radius: radius
    };
    Helper.castFireBallCheckParams( arguments );
    var manaCost = Helper.castFireBallManaCacl( arguments);
    if ( !Helper.checkAndSubtractMana(wizard, manaCost)) {
        // Don't do anything not enough mana for that
        return;
    }
    var state = wizard.worldObject.state;
    var position = Helper.castFireBallStartPosition( arguments , state.position, state.width , state.height);
    var fireball = new FireBall.FireBall(direction , speed , position , radius);
    game.addFireBall(fireball);
};
SpellBook.castFireBall.description = "This is where a description should go !";



if ( typeof window === 'undefined') {
    module.exports = SpellBook;
}
else {
}