var SpellController = require('./SpellController.js');
var SpellBook = require('./SpellBook');

PlayerStates = {};
PlayerStates.ReadyToFight = 0;
PlayerStates.InMatch = 1;
PlayerStates.CreatingSpells = 2;

function Player(game, socket, name) {
    this.game = game;
    this.socket = socket;
    this.socket.wizardName = name;
    this.name = name;
    this.setupSocketHandler(socket);
    this.state = PlayerStates.CreatingSpells;
    this.socket.emit('gameStart',{});

    // Object that handles the calls to basic spells
    this.spellBook = new SpellBook(this);
    // Object that controlls the process that the wizards spells run in
    this.spellController = new SpellController(this);
    // this.client - set elsewhere
}

Player.prototype.newSocket = function(socket) {
    this.socket = socket;
    this.socket.wizardName = this.name;
    this.setupSocketHandler(socket);
    this.spellController.reset();
};

Player.prototype.setupSocketHandler = function(client) {
    var that = this;
    client.on('keyDown' , function(data) {
        that.handleKeyDown(data);
        that.game.playerPutKeyDown(that.name, data);
    });
    client.on('keyUp' , function(data) {
        that.game.playerPutKeyUp(that.name, data);
    });
    client.on('createSpell' , function(data) {
        that.createSpell(data);
    });
    client.on('goToFightMode' , function(data) {
        that.state = PlayerStates.ReadyToFight;
        that.game.playerIsReadyToFight();
    });

    // TODO for now I only have the restart options working
    client.on('goToSpellCreationMode' , function() {
        //that.game.playerWantsToGoToSpell();
    });

    client.on('restart' , function() {
        that.game.playerWantsToRestart();
    });

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

/*
    Handler for the game state changing
 */
Player.prototype.changeState = function(state) {
    switch(state) {
        case GameStates.Match: {
            this.socket.emit("goToFightMode", {});
            this.state = PlayerStates.InMatch;
            break;
        }
        case GameStates.SpellCreation: {
            this.socket.emit("goToSpellCreationMode", {});
            this.state =  PlayerStates.CreatingSpells;
            break;
        }
    }
};
/*
    Functions in response to match sending messages
 */
Player.prototype.matchUpdate = function(state) {
    this.socket.emit("stateUpdate" , state);
};

Player.prototype.getUID = function() {
    return this.socket.uid;
};

Player.prototype.sendPlayerSpellList = function() {
  var spells = this.spellController.spellSafe;
  this.socket.emit('spellList' , spells);
  console.log("Client send spell list");
};

Player.prototype.stopSpells = function() {
    this.spellController.reset();
};

Player.prototype.createSpell = function (spell ) {
    console.log("Creating spell " + spell.slot);
    var spellInfo = this.spellController.createSpell(spell);
    if ( spellInfo ) {
        spell.problem = spellInfo.problem;
    }
    this.socket.emit('spellCreation' , spell);
};

Player.prototype.castSpell = function(slot) {
    this.spellController.castSpell(slot);
};

// This used when the game has been told to shutdown, so now the wizard must shut down
Player.prototype.shutDown = function() {
    this.spellController.shutDown();
};

module.exports = Player;