function Intersectable(){}

Intersectable.prototype.getTopBounds = function() {
    return this.state.position.y;
};

Intersectable.prototype.getBottomBounds = function() {
    return this.state.position.y + this.state.height;
};

Intersectable.prototype.getLeftBounds = function() {
    return this.state.position.x;
};

Intersectable.prototype.getRightBounds = function() {
    return this.state.position.x + this.state.width;
};

Intersectable.prototype.getTopBoundsFromPos = function(pos) {
    return pos.y;
};

Intersectable.prototype.getBottomBoundsFromPos = function(pos) {
    return pos.y + this.state.height;
};

Intersectable.prototype.getLeftBoundsFromPos = function(pos) {
    return pos.x;
};

Intersectable.prototype.getRightBoundsFromPos = function(pos) {
    return pos.x + this.state.width;
};