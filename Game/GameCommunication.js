/*
    Todo make better state machine idea, make state names and functions that
    enact transitions to those states more explicit.
 */

function GameCommunicator(game) {
    this.game = game;
    this.clientStates = { redWizard: 'spellCreation', blueWizard: 'spellCreation'};
}

GameCommunicator.prototype.init = function(clients) {
    var that = this;
    this.clients = clients;
    clients.forEach( function(client) {
        that.setupSocketHandler(client);
    });
};

GameCommunicator.prototype.reconnect = function(client) {
    var wizardName = client.wizardName;
    console.log("This client thinks its " + wizardName);
    this.setupSocketHandler(client);
    if ( this.mode == 'fightMode') {
        client.emit('goToFightMode' , {});
    }
    // Send client its spell list
    this.game[wizardName].sendClientSpellList();
};

GameCommunicator.prototype.setupSocketHandler = function(client) {
    var that = this;
    var wizard = this.game[client.wizardName];
    client.wizard = wizard;
    wizard.client = client;
    client.on('keyDown' , function(data) {
        this.wizard.worldObject.keyDown(data);
    });
    client.on('keyUp' , function(data) {
        this.wizard.worldObject.keyUp(data);
    });
    client.on('createSpell' , function(data) {
        this.wizard.createSpell(data);
    });

    client.on('goToFightMode' , function(data) {
        that.wizardReady(this);
    });

    client.on('goToSpellCreationMode' , function(data) {
        that.game.goToSpellCreation(data);
    });

    client.on('restart' , function() {
        that.game.restart();
    });
};

GameCommunicator.prototype.wizardReady = function(client) {
    if (!client) {
        console.log("Error null client");
        return;
    }
    var wizardName = client.wizardName;
    this.clientStates[wizardName] = 'readyToFight';
    if ( this.clientStates.redWizard == 'readyToFight' && this.clientStates.blueWizard =='readyToFight') {
        this.game.startFight();
    } else {
        client.emit("waitingOnOpponent", {});
    }
};


/*
    Functions that the game object calls in-order for the clients to be informed of the game
 */

// Time to fight
GameCommunicator.prototype.startFight = function() {
    for ( var i in this.clientStates ) {
        this.clientStates[i] = 'fighting';
    }
    this.broadcast('goToFightMode' , {});
};

GameCommunicator.prototype.goToSpellCreation = function() {
    this.broadcast('goToSpellCreationMode' , {});
};

GameCommunicator.prototype.start = function() {
    this.broadcast('gameStart' , {});
};

GameCommunicator.prototype.restart = function() {
    //this.broadcast('restart', {});
    this.broadcast('goToSpellCreationMode', {});
};

GameCommunicator.prototype.stateUpdate = function(state) {
    this.broadcast('stateUpdate', state);
};
//-------------------------------------


// Helper that sends a message to both clients in a game.
GameCommunicator.prototype.broadcast = function(type , obj) {
    this.clients.forEach(function(client) {
        client.emit(type,obj);
    })
};

module.exports = GameCommunicator;