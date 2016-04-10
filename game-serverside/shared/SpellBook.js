/*
    Centralized location for all Spell information
    TODO make game effects object for spells to use.
 */

var SpellBook = {};
SpellBook.castFireBall = {
    code: function(game, wizardName, direction ,speed , radius) {
        game.createFireBall(wizardName, direction, speed, radius);
    },
    description: "This is where a description should go!"
};

//----------------------------------------------
// Special Functions that  need to be implemented at spell Process level
SpellBook.sleep  = {
    description: "Use this function to make your spell sleep for set time",
    code: null
};

if ( typeof window === 'undefined') {
    module.exports = SpellBook;
}