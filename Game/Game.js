var Wizard = require('./../Wizard/Wizard.js');
var FireBallGen = require('./../FireBall.js');
var Utils = require('./../Utils.js');
var GameCommunicator = require('./GameCommunication.js');


function Game(clients) {
    this.running = true;
    this.clients = clients;
    this.communicator = new GameCommunicator(this);
    this.mode = 'spellCreationMode';
}

Game.prototype.init = function() {
    this.fireBallList  = new FireBallGen.FireBallList(this);
    this.redWizard  = new  Wizard( 50 , 60  , this );
    this.blueWizard = new  Wizard( 420   , 60 , this );

    this.communicator.init(this.clients);
    console.log("Game initialized: UID: " + this.blueWizard.client.uid + " " + this.redWizard.client.uid);};

Game.prototype.restart = function() {
    this.fireBallList  = new FireBallGen.FireBallList(this);
    this.redWizard.restart({x : 50 , y: 60});
    this.blueWizard.restart({x : 420 , y: 60});
    this.communicator.restart();
};

Game.prototype.startFight = function(data) {
    if ( this.mode != 'fightMode') {
        var that = this;
        setTimeout(function () {
            that.intervalVar = setInterval( that.gameLoop , 16 , that);
        }, 1000);
    }
    this.mode = 'fightMode';
    console.log("Clients told to go to fight mode");
    this.communicator.startFight();
};

Game.prototype.goToSpellCreation = function() {
    this.mode = 'spellCreationMode';
    clearInterval(this.intervalVar);
    console.log("Clients told to go to spell creation mode");
    this.redWizard.stopSpells();
    this.blueWizard.stopSpells();
    this.communicator.goToSpellCreation();
};

Game.prototype.start = function() {
    console.log("Game started");
    this.communicator.start();
    this.goToSpellCreation({});
};

Game.prototype.gameLoop = function(game) {
    game.blueWizard.worldObject.update();
    game.redWizard.worldObject.update();
    game.fireBallList.update();
    // Send new game state to clients
    game.state = {
        redWizard:     game.redWizard.worldObject.state,
        blueWizard:    game.blueWizard.worldObject.state,
        fireBallList:  game.fireBallList.state
    };
    game.communicator.stateUpdate(game.state);
    //game.broadcast('stateUpdate' , game.state);
};

Game.prototype.canBeAt = function(pos , obj) {
    if ( obj != this.redWizard.worldObject ) {
        if (Utils.intersects(pos , obj , this.redWizard.worldObject)) {
            return false;
        }
    }
    if ( obj != this.blueWizard.worldObject ) {
        if ( Utils.intersects(pos , obj , this.blueWizard.worldObject)) {
            return false;
        }
    }
    // Check fireballs?
    // Check if in arena.
    var height = obj.state.height;
    var width  = obj.state.width;
    if ( pos.x - width < 0 || pos.x+ width > 480 ) {
        return false;
    }
    if ( pos.y - height < 0 || pos.y + height > 240) {
        return false;
    }
    return true;
};

Game.prototype.hitWizard = function(projectile) {
    var obj = projectile;
    var pos = projectile.state.position;
    if ( obj != this.redWizard.worldObject ) {
        if ( Utils.intersects(pos , obj , this.redWizard.worldObject)) {
            this.redWizard.worldObject.takeHit(projectile);
        }
    }
    if ( obj != this.blueWizard.worldObject ) {
        if ( Utils.intersects(pos , obj , this.blueWizard.worldObject)) {
            this.blueWizard.worldObject.takeHit(projectile);
        }
    }
};

Game.prototype.addFireBall = function(fireball) {
    this.fireBallList.addFireBall(fireball);
};


Game.prototype.shutDown = function() {
    if ( this.blueWizard) {
        this.blueWizard.shutDown();
    }
    if ( this.redWizard) {
        this.redWizard.shutDown();
    }
};

Game.prototype.reconnect = function(client) {
    this.communicator.reconnect(client);
};

module.exports = Game;