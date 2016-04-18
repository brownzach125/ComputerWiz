/**
 * Created by solevi on 4/12/16.
 */
var GameStates = require('../shared/GameStates.js');
var Player = require('../Player/Player.js');
var Match = require('./Match.js');

var GameParent = require('./GameParent');

function Training() {
    GameParent.call(this);
}

Training.prototype = Object.create(GameParent.prototype);
Training.prototype.constructor = Training;


Training.prototype.claim = function(socket, username) {
    if ( !this.user) {
        this.redWizard = new Player(this,socket,'redWizard', username);
        this.users[username] = { socket : socket, username:username};
    } else {
        this.redWizard.reconnect(socket);
        this.users[username].socket = socket;
    }
    if (this.redWizard) {
        var gameInfo = {
            wizardName: "redWizard",
            opponent : {
                username: this.blueWizard ? this.blueWizard.username : "",
                wizardName: 'blueWizard'
            }
        };
        this.redWizard.socket.emit('game_info',gameInfo)
    }
    if (this.blueWizard) {
        var gameInfo = {
            wizardName: "blueWizard",
            opponent : {
                username: this.redWizard ? this.redWizard.username : "",
                wizardName: 'redWizard'
            }
        };
        this.blueWizard.socket.emit('game_info',gameInfo)
    }
};

Training.prototype.requestState = function(player, state) {
    player.requestedState = state;
    this.changeState(state);
};

module.exports = Training;