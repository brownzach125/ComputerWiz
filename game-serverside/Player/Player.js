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
    this.socket.emit("game_state", { state:state});
};

Player.prototype.matchUpdate = function(state) {
    this.socket.emit("match_state", state);
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
  this.socket.emit("match_finished", results);
};

module.exports = Player;