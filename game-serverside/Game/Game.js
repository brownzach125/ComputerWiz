var GameStates = require('../shared/GameStates.js');

var GameParent = require('./GameParent.js');
var Player = require('../Player/Player.js');
var Match = require('./Match.js');

function Game() {
    GameParent.call(this);
}

Game.prototype = Object.create(GameParent.prototype);
Game.prototype.constructor = Game;

Game.prototype.startGame = function() {
    // Games start in the spell_creation mode
    if (GameParent.prototype.startGame.call(this))
        this.changeState(GameState.spell_creation);
};


module.exports = Game;