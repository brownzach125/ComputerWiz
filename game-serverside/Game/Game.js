var GameStates = require('../shared/GameStates.js');

var GameParent = require('./GameParent.js');
var Player = require('../Player/Player.js');
var Match = require('./Match.js');

function Game(gamedict, gameUID) {
    GameParent.call(this, gamedict, gameUID);
}

Game.prototype = Object.create(GameParent.prototype);
Game.prototype.constructor = Game;

Game.prototype.startGame = function() {
    // Games start in the spell_creation mode
    if (GameParent.prototype.startGame.call(this))
        this.changeState(GameStates.spell_creation);
};


module.exports = Game;