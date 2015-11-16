var Wizard = require('./Wizard.js');
var FireBallGen = require('./FireBall.js');

var Utils = require('./Utils.js');

function Game(clients) {
    this.clients = [];
    for ( var i =0; i < clients.length; i++) {
        this.clients.push( clients[i] );
    }
    this.mode;
};

Game.prototype.init = function() {
    this.fireBallList  = new FireBallGen.FireBallList(this);
    this.redWizard  = new  Wizard( 420 , 60  , this );
    this.blueWizard = new  Wizard( 50   , 60 , this );
    this.setupSocketHandlers();
};

Game.prototype.setupSocketHandlers = function() {
    var that = this;
    for ( var i =0; i < this.clients.length; i++) {
        var client = this.clients[i];
        var wizard;
        if ( i != 0) {
            wizard = this.redWizard;
        }
        else {
            wizard = this.blueWizard;
        }
        client.wizard = wizard;
        wizard.client = client;
        client.on('keyDown' , function(data) {
            this.wizard.keyDown(data);
        });
        client.on('keyUp' , function(data) {
            this.wizard.keyUp(data);
        });
        client.on('createSpell' , function(data) {
            this.wizard.createSpell(data);
        });

        client.on('goToFightMode' , function(data) {
            that.startFight(data);
        });

        client.on('goToSpellCreationMode' , function(data) {
            that.goToSpellCreation(data);
        });
    }
};

Game.prototype.startFight = function(data) {
    if ( this.mode == 'fightMode') {
        // Can't start the fight is already on going
        return;
    }
    this.mode = 'fightMode';
    console.log("Clients told to go to fight mode");
    this.broadcast('goToFightMode' , {});
    this.intervalVar = setInterval( this.gameLoop , 16 , this);
};

Game.prototype.goToSpellCreation = function(data) {
    if ( this.mode == 'spellCreationMode') {
        // Can't go to spell creation mode we're already there
        return;
    }
    this.mode = 'spellCreationMode';
    clearInterval(this.intervalVar);

    console.log("Clients told to go to spell creation mode");
    this.broadcast('goToSpellCreationMode' , {});
};

Game.prototype.start = function() {
    console.log("Game started");
    this.goToSpellCreation({});
};

Game.prototype.gameLoop = function(game) {
    game.blueWizard.update();
    game.redWizard.update();
    game.fireBallList.update();
    // Send new game state to clients
    game.state = {
        redWizard:  game.redWizard.state,
        blueWizard: game.blueWizard.state,
        fireBallList:  game.fireBallList.state,
    };
    game.broadcast('stateUpdate' , game.state);
};

Game.prototype.canBeAt = function(pos , obj) {
    if ( obj != this.redWizard ) {
        if ( Utils.intersects(pos , obj , this.redWizard))
            return false;
    }
    if ( obj != this.blueWizard ) {
        if ( Utils.intersects(pos , obj , this.blueWizard))
            return false;
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
    if ( obj != this.redWizard ) {
        if ( Utils.intersects(pos , obj , this.redWizard)) {
            this.redWizard.takeHit(projectile);
        }
    }
    if ( obj != this.blueWizard ) {
        if ( Utils.intersects(pos , obj , this.blueWizard)) {
            this.blueWizard.takeHit(projectile);
        }
    }
};

Game.prototype.addFireBall = function(fireball) {
    this.fireBallList.addFireBall(fireball);
};

Game.prototype.broadcast = function(type , obj) {
    for (var i =0; i < this.clients.length; i++) {
        this.clients[i].emit(type , obj);
    }
};

module.exports = Game;