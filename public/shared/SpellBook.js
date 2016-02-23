/*
    Centralized location for all Spell information
    TODO make game effects object for spells to use.
 */

var SpellBook = {};
SpellBook.castFireBall = {};
SpellBook.castFireBall.code = function(game, wizardName, direction ,speed , radius) {
    game.createFireBall(wizardName, direction, speed, radius);
};
SpellBook.castFireBall.description = "This is where a description should go!";

if ( typeof window === 'undefined') {
    module.exports = SpellBook;
}