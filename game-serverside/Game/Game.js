var GameStates = require('../shared/GameStates.js');

var GameParent = require('./GameParent.js');
var Player = require('../Player/Player.js');
var Match = require('./Match.js');

function Game() {
    GameParent.call(this);
}

Game.prototype = Object.create(GameParent.prototype);
Game.prototype.constructor = Game;

module.exports = Game;