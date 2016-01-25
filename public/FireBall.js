
function FireBallList() {
    this.img = ResourceManager.loadImage('./art/FireBall.png');
    this.state = [];
}

FireBallList.prototype.draw = function() {
    if ( !this.state.fireBalls )
        return;
    for ( var i =0; i < this.state.fireBalls.length; i++ ) {
        var state = this.state.fireBalls[i];
        var position = state.position;
        var pos = state.position;
        var radius = state.radius;
        var dir = state.direction;
        Camera.drawImage(this.img , position.x - radius , position.y - radius , radius * 2 , radius * 2, dir);
        if ( DEBUG) {
            Camera.drawLine("purple", this.getLeftBounds(pos , radius), this.getTopBounds(pos , radius), this.getRightBounds(pos , radius), this.getTopBounds(pos , radius));
            Camera.drawLine("purple", this.getRightBounds(pos , radius), this.getTopBounds(pos , radius), this.getRightBounds(pos , radius), this.getBottomBounds(pos , radius));
            Camera.drawLine("purple", this.getRightBounds(pos , radius), this.getBottomBounds(pos , radius), this.getLeftBounds(pos , radius), this.getBottomBounds(pos , radius));
            Camera.drawLine("purple", this.getLeftBounds(pos , radius), this.getBottomBounds(pos , radius), this.getLeftBounds(pos , radius), this.getTopBounds(pos , radius));
        }
    }
};

FireBallList.prototype.getTopBounds = function(position , radius) {
    return position.y + radius;
};

FireBallList.prototype.getBottomBounds = function(position , radius) {
    return position.y - radius;
};

FireBallList.prototype.getLeftBounds = function(position , radius) {
    return position.x - radius;
};

FireBallList.prototype.getRightBounds = function(position , radius) {
    return position.x + radius;
};

FireBallList.prototype.getTopBoundsFromPos = function(position , radius) {
    return position.y + radius;
};

FireBallList.prototype.getBottomBoundsFromPos = function(position , radius) {
    return position.y - radius;
};

FireBallList.prototype.getLeftBoundsFromPos = function(position , radius) {
    return position.x - radius;
};

FireBallList.prototype.getRightBoundsFromPos = function(position , radius) {
    return position.x + radius;
};



