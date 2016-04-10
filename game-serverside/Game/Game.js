var GameStates = require('../shared/GameStates.js');

var Player = require('../Player/Player.js');
var Match = require('./Match.js');

function Game() {
    this.changeState(GameStates.spell_creation);
    this.redWizard = null;
    this.blueWizard = null;
    this.users = {};
}

Game.prototype.claim = function(socket, username) {
     if ( !this.users[username]) {
         // New username so assign him to null wizard
         if ( !this.redWizard) {
             this.redWizard = new Player(this, socket, 'redWizard',username);
             this.users[username] = { socket: socket, wizardName: 'redWizard'};
         } else if ( !this.blueWizard ) {
             this.blueWizard = new Player(this, socket, 'blueWizard',username);
             this.users[username] = { socket: socket, wizardName: 'blueWizard'};
         }
     } else {
         this[this.users[username].wizardName].reconnect(socket);
     }
};

Game.prototype.changeState = function(state) {
    switch(state) {
        case GameStates.match: {
            this.startMatch();
            break;
        }
        case GameStates.spell_creation: {
            this.stopMatch();
            break;
        }
    }
    this.state = state;
    if (this.redWizard)
        this.redWizard.changeState(state);
    if (this.blueWizard)
        this.blueWizard.changeState(state);
};

Game.prototype.quit = function(username) {
    // TODO shut down game
    for (var k in this.users) {
        this.users[k].socket.emit("game_over");
    }
};

Game.prototype.requestState = function(player, state) {
    player.requestedState = state;
    if (!this.redWizard || !this.blueWizard)
        return false;
    if ( this.redWizard.requestedState === this.blueWizard.requestedState) {
        this.changeState(state);
        return true;
    }
    return false;
};

Game.prototype.startMatch = function() {
    if(this.match)
        this.match.stop();
    this.match = new Match({redWizard: this.redWizard, blueWizard: this.blueWizard});
    this.match.start();
};

Game.prototype.stopMatch = function() {
    if (this.match)
        this.match.stop();
};






Game.prototype.playerKeyDown = function(name, data) {
    if (this.match) {
        this.match.playerKeyDown(name,data);
    }
};

Game.prototype.playerKeyUp = function(name, data) {
    if (this.match) {
        this.match.playerKeyUp(name,data);
    }
};

Game.prototype.createFireBall = function(wizardName, direction, speed, radius) {
    if ( this.match ) {
        this.match.createFireBall(wizardName, direction, speed, radius);
    }
};



/*
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

//-------------------------
// Functions used by the gameserver.js to manage a game
//------------------------------
Game.prototype.shutDown = function() {
    if ( this.blueWizard) {
        this.blueWizard.shutDown();
    }
    if ( this.redWizard) {
        this.redWizard.shutDown();
    }
};

*/
module.exports = Game;