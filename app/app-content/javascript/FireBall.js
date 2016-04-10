/* jshint browser:true */
/* global ResourceManager, Camera, PosArea, DEBUG, Intersectable */

function FireBallList() {
    this.img = ResourceManager.loadImage('app-content/art/FireBall.png');
    this.state = [];
}

FireBallList.prototype = new Intersectable();

FireBallList.prototype.draw = function() {
    if ( !this.state.fireBalls )
        return;
    for ( var i =0; i < this.state.fireBalls.length; i++ ) {
        var state = this.state.fireBalls[i];
        var position = state.position;
        var pos = state.position;
        var radius = state.radius;
        var width = state.width;
        var height = state.height;
        var dir = state.direction;
        Camera.drawImage(this.img, position.x, position.y, width, height, dir);
        if ( DEBUG) {
            /* FIXME
            Camera.drawLine("purple", this.getLeftBounds(pos), this.getTopBounds(pos), this.getRightBounds(pos), this.getTopBounds(pos));
            Camera.drawLine("purple", this.getRightBounds(pos), this.getTopBounds(pos), this.getRightBounds(pos), this.getBottomBounds(pos));
            Camera.drawLine("purple", this.getRightBounds(pos), this.getBottomBounds(pos), this.getLeftBounds(pos), this.getBottomBounds(pos));
            Camera.drawLine("purple", this.getLeftBounds(pos), this.getBottomBounds(pos), this.getLeftBounds(pos), this.getTopBounds(pos));
            */
        }
    }
};

