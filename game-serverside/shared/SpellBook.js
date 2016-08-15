/*
    Centralized location for all Spell information
    TODO make game effects object for spells to use.
 */

var SpellBook = {};
SpellBook.castFireBall = {
    name: "castFireBall",
    code: function(game, wizardName, direction ,speed , radius) {
        game.createFireBall(wizardName, direction, speed, radius);
    },
    brief_description: "Hurls a fireball",
    description: "Creates a fireball heading direction specified with speed and radius provided.\n" +
    "The mana cost is related to the speed and radius",
    params: [
        {
            name: "direction",
            description: "The direction to lob the fireball in. Angle in degrees with 0 degrees being to the right of the wizard",
            type: "number"
        },
        {
            name: "speed",
            description: "The rate at which the fireball travels min:0 max:10",
            type: "number"
        },
        {
            name: "radius",
            description: "Radius of the fireball. min:1 max:10",
            type:"number"
        }
    ],
    returnValue: "void"
};

SpellBook.teleport = {
    name: "teleport",
    code: function(game, wizardName) {

    },
    brief_description: "Teleport Self to New Location",
    description: "Teleport Self to New Location Specified by x and y coordinate"
};

//----------------------------------------------
// Special Functions that  need to be implemented at spell Process level
SpellBook.sleep  = {
    name: "sleep",
    brief_description: "Pauses the spell",
    description: "Use this function to make your spell sleep for set time",
    params: [
        {
            name: "time",
            description: "Amount of time to pause in milliseconds",
            type: "number"
        }
    ],
    code: null
};

SpellBook.hide = {
    name: "hide",
    brief_description: "Hide away",
    description: "I wanna hide away",
};

if ( typeof window === 'undefined') {
    module.exports = SpellBook;
}