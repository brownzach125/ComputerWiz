var Wizard = require('./Wizard/Wizard.js');
var FireBallGen = require('./FireBall.js');
var Utils = require('./Utils.js');

function Game(clients) {
    this.running = true;
    this.clients = [];
    for ( var i =0; i < clients.length; i++) {
        this.clients.push( clients[i] );
    }
    this.mode = 'spellCreationMode';
}

Game.prototype.reconnect = function(client) {
    var wizardName = client.wizardName;
    console.log("This client thinks its " + wizardName);
    this.setupSocketHandler(client);
    if ( this.mode == 'fightMode') {
        client.emit('goToFightMode' , {});
    }
    // Send client its spell list
    this[wizardName].sendClientSpellList();
};

Game.prototype.init = function() {
    this.fireBallList  = new FireBallGen.FireBallList(this);
    this.redWizard  = new  Wizard( 50 , 60  , this );
    this.blueWizard = new  Wizard( 420   , 60 , this );
    this.setupSocketHandler(this.clients[0]);
    this.setupSocketHandler(this.clients[1]);
};

Game.prototype.setupSocketHandler = function(client) {
    var that = this;
    var wizard = this[client.wizardName];
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
        that.goToSpellCreation(data);
    });

    client.on('restart' , function(data) {
        that.restart(data);
    });
};

Game.prototype.wizardReady = function(client) {

    var wizardName = client.wizardName + 'Ready';
    this[wizardName] =true;
    if ( this.blueWizardReady && this.redWizardReady ) {
        this.startFight();
        this.blueWizardReady = false;
        this.redWizardReady  = false;
    }
    else {
      client.emit('waitingOnOpponent' , {});
    }
};

Game.prototype.restart = function(data) {
    this.fireBallList  = new FireBallGen.FireBallList(this);
    this.redWizard.restart({x : 50 , y: 60});
    this.blueWizard.restart({x : 420 , y: 60});
    this.broadcast('goToSpellCreationMode' , {});
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
    this.broadcast('goToFightMode' , {});
};

Game.prototype.goToSpellCreation = function(data) {
    this.mode = 'spellCreationMode';
    clearInterval(this.intervalVar);
    console.log("Clients told to go to spell creation mode");
    this.redWizard.stopSpells();
    this.blueWizard.stopSpells();
    this.broadcast('goToSpellCreationMode' , {});
};

Game.prototype.start = function() {
    console.log("Game started");
    this.broadcast('gameStart' , {});
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
        fireBallList:  game.fireBallList.state,
    };
    game.broadcast('stateUpdate' , game.state);
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

Game.prototype.broadcast = function(type , obj) {
    this.redWizard.client.emit(type , obj);
    this.blueWizard.client.emit(type , obj);
};

module.exports = Game;