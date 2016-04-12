/**
 * Created by solevi on 4/12/16.
 */
var GameStates = require('../shared/GameStates.js');
var Player = require('../Player/Player.js');
var Match = require('./Match.js');

function Training() {
    this.changeState(GameStates.spell_creation);
    this.redWizard = null;
    this.user = null;
}

Training.prototype.claim = function(socket, username) {
    if ( !this.user) {
        this.redWizard = new Player(this,socket,'redWizard', username);
        this.user = { socket : socket, username:username};
    } else {
        this.redWizard.reconnect(socket);
        this.user.socket = socket;
    }
};

Training.prototype.changeState = function(state) {
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

Training.prototype.quit = function(username) {
    // TODO shut down Training
    for (var k in this.users) {
        this.users[k].socket.emit("Training_over");
    }

    // Stop the match
    this.stopMatch();
};

Training.prototype.requestState = function(player, state) {
    player.requestedState = state;
    this.changeState(state);
    /*
    if (!this.redWizard || !this.blueWizard)
        return false;
    if ( this.redWizard.requestedState === this.blueWizard.requestedState) {
        this.changeState(state);
        return true;
    }
    return false;
    */
};

Training.prototype.startMatch = function() {
    if(this.match)
        this.match.stop();
    this.match = new Match({redWizard: this.redWizard, blueWizard: this.blueWizard});
    this.match.start();
};

Training.prototype.stopMatch = function() {
    if (this.match)
        this.match.stop();
};

Training.prototype.playerKeyDown = function(name, data) {
    if (this.match) {
        this.match.playerKeyDown(name,data);
    }
};

Training.prototype.playerKeyUp = function(name, data) {
    if (this.match) {
        this.match.playerKeyUp(name,data);
    }
};

Training.prototype.createFireBall = function(wizardName, direction, speed, radius) {
    if ( this.match ) {
        this.match.createFireBall(wizardName, direction, speed, radius);
    }
};



/*
 //-------------------------
 // Functions that control the match object of a Training
 //-------------------------
 Training.prototype.startMatch = function() {
 this.match = new Match(this);
 this.match.start();
 };

 Training.prototype.stopMatch = function() {
 this.redWizard.stopSpells();
 this.blueWizard.stopSpells();
 this.match.stop();
 this.match = null;
 };

 //--------------------------
 //  Functions for altering the match state
 //--------------------------

 //-------------------------
 // Functions used by the Trainingserver.js to manage a Training
 //------------------------------
 Training.prototype.shutDown = function() {
 if ( this.blueWizard) {
 this.blueWizard.shutDown();
 }
 if ( this.redWizard) {
 this.redWizard.shutDown();
 }
 };

 */
module.exports = Training;