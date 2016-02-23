var Player = require('../Player/Player.js');
var Match = require('./Match.js');

GameStates = {};
GameStates.SpellCreation = 0;
GameStates.Match = 1;

function Game(clients) {
    this.redWizard  = new Player(this, clients[0], 'redWizard');
    this.blueWizard = new Player(this, clients[1], 'blueWizard');
    this.changeState(GameStates.SpellCreation);
}

Game.prototype.changeState = function(state) {
    this.state = state;
    this.redWizard.changeState(state);
    this.blueWizard.changeState(state);
};

//------------------------
// Functions that tell the game that a player wants to do some state change
//------------------------
Game.prototype.playerIsReadyToFight = function() {
    if ( this.redWizard.state  == PlayerStates.ReadyToFight &&
        this.blueWizard.state == PlayerStates.ReadyToFight ) {
        this.startMatch();
        this.changeState(GameStates.Match);
    }
};

Game.prototype.playerWantsToRestart = function() {
    // Right now just go ahead and end match and go back to spellcreation
    this.stopMatch();
    this.changeState(GameStates.SpellCreation);
};

Game.prototype.playerPutKeyDown = function(wizardName, data) {
    if ( this.match ) {
        this.match.playerPutKeyDown(wizardName, data);
    }
};

Game.prototype.playerPutKeyUp = function(wizardName, data) {
    if ( this.match) {
        this.match.playerPutKeyUp(wizardName, data);
    }
};

//-------------------------
// Functions that control the match object of a game
//-------------------------
Game.prototype.startMatch = function() {
    this.match = new Match(this);
    this.match.start();
};

Game.prototype.stopMatch = function() {
    this.redWizard.stopSpells();
    this.blueWizard.stopSpells();
    this.match.stop();
    this.match = null;
};

//--------------------------
//  Functions for altering the match state
//--------------------------
Game.prototype.createFireBall = function(wizardName, direction, speed, radius) {
    if ( this.match ) {
        this.match.createFireBall(wizardName, direction, speed, radius);
    }
};

//-------------------------
// Functions used by the server to manage a game
//------------------------------
Game.prototype.shutDown = function() {
    if ( this.blueWizard) {
        this.blueWizard.shutDown();
    }
    if ( this.redWizard) {
        this.redWizard.shutDown();
    }
};

Game.prototype.reconnect = function(client) {
    var wizardName = client.wizardName;
    this[wizardName].newSocket(client);
    this[wizardName].sendPlayerSpellList();
    this[wizardName].changeState(this.state);
};

module.exports = Game;