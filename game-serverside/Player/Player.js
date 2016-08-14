var GameStates = require('../shared/GameStates.js');
var SpellController = require('./SpellController.js');
var SpellBook = require('./SpellBook');

function Player(game, socket, name, username) {
    this.username = username;
    this.game = game;
    this.socket = socket;
    this.socket.wizardName = name;
    this.name = name;
    this.setupSocketHandler(socket);
    // Object that handles the calls to basic spells
    this.spellBook = new SpellBook(this);
    // Object that controls the process that the wizards spells run in
    this.spellController = new SpellController(this);
    this.changeState(this.game.state);
}

Player.prototype.setupSocketHandler = function(socket) {
    var that = this;
    socket.on('key_down' , function(data) {
        that.handleKeyDown(data);
        that.game.playerKeyDown(that.name, data);
    });
    socket.on('key_up' , function(data) {
        that.game.playerKeyUp(that.name, data);
    });

    socket.on('game_state', function(message, callback) {
        var state = message.state;
        var result = that.game.requestState(that, state);
        if (typeof callback === "function")
            callback(null, {ready:result});
    });

    socket.on('disconnect', function() {
       // The socket has been disconnect
       // Any attempts to use it should be paused
       // And maybe the game should be paused
       console.log("Socket disconnected");
        that.game.playerDisconnect(that);
    });

    socket.on('error', function(error){
        console.log("Error occured");
        // TODO do something useful.
    });


};

Player.prototype.reconnect = function(socket) {
    this.socket = socket;
    this.socket.wizardName = this.name;
    this.setupSocketHandler(socket);
    this.changeState(this.game.state);
};

Player.prototype.changeState = function(state) {
    switch(state) {
        case GameStates.match:
            this.spellController.loadSpells();
    }
    this.socketEmit("game_state", { state:state});
};

Player.prototype.matchUpdate = function(state) {
    this.socketEmit("match_state", state);
};
// Function that handles emit messages to client
// Will only send messages if the socket is connected
// TODO send feedback to caller?
Player.prototype.socketEmit = function(type, message) {
    if (this.socket && this.socket.connected) {
        this.socket.emit(type, message);
    } else {
        console.log("Socket is not available");
    }
};


Player.prototype.handleKeyDown = function(data) {
    switch(data) {
        case 49:
            this.castSpell(1);
            break;
        // 2
        case 50:
            this.castSpell(2);
            break;
        // 3
        case 51:
            this.castSpell(3);
            break;
        // 4
        case 52:
            this.castSpell(4);
            break;
        // 5
        case 53:
            this.castSpell(5);
            break;
        // 6
        case 54:
            this.castSpell(6);
            break;
    }
};

Player.prototype.castSpell = function(slot) {
    this.spellController.castSpell(slot);
};

Player.prototype.shutDown = function() {
  if (this.spellController)
    this.spellController.shutDown();
};

Player.prototype.stopSpells = function() {
    if (this.spellController)
        this.spellController.reset();
};

Player.prototype.matchFinished = function(results) {
  if (this.spellController)
    this.spellController.reset();
  this.socketEmit("match_finished", results);
};

module.exports = Player;