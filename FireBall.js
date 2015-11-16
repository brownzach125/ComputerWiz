function FireBallList(game) {
    this.state = {
        // Holds the fireball states
        fireBalls: []
    };
    this.fireBalls = [];
    this.game = game;
}

FireBallList.prototype.addFireBall = function(fireball) {
    this.fireBalls.push(fireball);
    this.state.fireBalls.push(fireball.state);
    fireball.list = this;
    console.log("Fire ball added");
};

FireBallList.prototype.update = function() {
    var removeList = [];
    for ( var index in this.fireBalls ) {
        if (this.fireBalls[index].update()) {
            removeList.push(index);
        }
    }
    for ( var index in removeList ) {
        var v = removeList[index];
        this.fireBalls.splice(v , 1);
        this.state.fireBalls.splice(v , 1);
        console.log('fireball killed');
    }
};

function FireBall(direction , velocity , pos) {
    this.state = {
        direction: direction,
        velocity: velocity,
        position: {
            x: pos.x,
            y: pos.y
        },
        radius: 5,
        width: 5,
        height: 5,

    };
    console.log("Fireball created");
}

FireBall.prototype.update = function() {
    var newPos = {
        x: this.state.position.x + Math.sin(this.state.direction ) *  this.state.velocity,
        y: this.state.position.y + Math.cos(this.state.direction ) *  this.state.velocity
    };
    this.state.position = newPos;
    var nohit = this.list.game.canBeAt(newPos, this);
    this.list.game.hitWizard(this);
    if ( !nohit) {
        return true;
    }
    return false;
};

FireBall.prototype.getTopBounds = function() {
    return this.state.position.y + this.state.radius;
};

FireBall.prototype.getBottomBounds = function() {
    return this.state.position.y + this.state.radius;
};

FireBall.prototype.getLeftBounds = function() {
    return this.state.position.x + this.state.radius;
};

FireBall.prototype.getRightBounds = function() {
    return this.state.position.x + this.state.radius;
};

FireBall.prototype.getTopBoundsFromPos = function() {
    return this.state.position.y + this.state.radius;
};

FireBall.prototype.getBottomBoundsFromPos = function() {
    return this.state.position.y + this.state.radius;
};

FireBall.prototype.getLeftBoundsFromPos = function() {
    return this.state.position.x + this.state.radius;
};

FireBall.prototype.getRightBoundsFromPos = function() {
    return this.state.position.x + this.state.radius;
};

module.exports = {
    FireBallList : FireBallList,
    FireBall : FireBall
};


