/*
    The actual combat between players
    TODO maybe, turn Wizard object into player object.
    Have match have a wizard object.
 */
var FireBallGen = require("./FireBall");
var Wizard = require("./Wizard");
var Utils = require("../shared/Utils.js");

function Match(data) {
    this.redWizardPlayer = data.redWizard;
    this.blueWizardPlayer = data.blueWizard;
    this.fireBallList  = new FireBallGen.FireBallList(this);
    this.redWizard  = new Wizard(100 , 100, this);
    this.blueWizard = new Wizard(200, 100, this);
}

Match.prototype.start = function() {
    // start the matchLoop
    var that = this;
    setTimeout(function() {
       that.intervalVar = setInterval( Match.matchLoop, 16, that);
    }, 1000);
};

Match.prototype.stop = function() {
    clearInterval(this.intervalVar);
};

// Match loop, what must be done each tick of a match
Match.matchLoop = function(match) {
    // update state
    match.fireBallList.update();
    match.blueWizard.update();
    match.redWizard.update();
    var that = this;
    match.state = {
        redWizard:     match.redWizard.state,
        blueWizard:    match.blueWizard.state,
        fireBallList:  match.fireBallList.state
    };
    match.redWizardPlayer.matchUpdate(match.state);
    match.blueWizardPlayer.matchUpdate(match.state);
};

Match.prototype.canBeAt = function(pos , obj) {
    if ( obj != this.redWizard ) {
        if (Utils.intersects(pos , obj , this.redWizard)) {
            return false;
        }
    }
    if ( obj != this.blueWizard ) {
        if ( Utils.intersects(pos , obj , this.blueWizard)) {
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

Match.prototype.playerKeyDown = function(wizardName, data) {
    this[wizardName].keyDown(data);
};

Match.prototype.playerKeyUp = function(wizardName, data) {
    this[wizardName].keyUp(data);
};


Match.prototype.hitWizard = function(projectile) {
    var obj = projectile;
    var pos = projectile.state.position;
    if ( obj != this.redWizard) {
        if ( Utils.intersects(pos , obj , this.redWizard)) {
            this.redWizard.takeHit(projectile);
        }
    }
    if ( obj != this.blueWizard) {
        if ( Utils.intersects(pos , obj , this.blueWizard)) {
            this.blueWizard.takeHit(projectile);
        }
    }
};

//---------------------------------------
// Functions called by spells
//---------------------------------------
Match.prototype.createFireBall = function(wizardName, direction, speed, radius) {
    var wizard = this[wizardName];
    direction = direction * Math.PI  / 180;
    if ( Math.abs(speed) > 10 ) {
        // TODO
        return false;
    }
    if ( Math.abs(radius) > 20) {
        // TODO
        return false;
    }
    var manaCost = Math.abs(speed) + radius / 5;
    var position = {
        x : wizard.state.position.x + Math.cos(direction) * (wizard.state.width  * 2  + radius),
        y : wizard.state.position.y + Math.sin(direction) * (wizard.state.height * 2  + radius),
    };
    if ( manaCost > wizard.state.mana) {
        return false;
    }  else {
        wizard.state.mana -= manaCost;
        this.fireBallList.addFireBall(direction, speed, radius, position);
        return true;
    }

};

module.exports = Match;