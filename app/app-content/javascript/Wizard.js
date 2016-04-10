/* jshint browser:true */
/* global ResourceManager, Camera, PosArea, DEBUG, Intersectable */

var TILE_LENGTH = 24;
var WIZARD_WIDTH = 30; //TODO this could be dynamic?
var WIZARD_HEIGHT = 44;

function Wizard(color) {
    this.state = {
        position: {
            x: 60,
            y: 0
        },
        health: 100,
        mana: 100,
        height: WIZARD_HEIGHT,
        width: WIZARD_WIDTH,
    };
    if ( color == 'red') {
        this.wizardImage   = ResourceManager.loadImage('app-content/art/RedWizard.png');
    }
    else {
        this.wizardImage   = ResourceManager.loadImage('app-content/art/BlueWizard.png');
    }
}

Wizard.prototype = new Intersectable();

Wizard.prototype.getHitBox = function() {
    var pos = {};
    var hitBoxWidth  = WIZARD_WIDTH;
    var hitBoxHeight = WIZARD_HEIGHT;
    pos.x = this.state.position.x * hitBoxWidth;
    pos.y = this.position.y * hitBoxHeight;

    var w = hitBoxWidth;
    var h = hitBoxHeight;
    return new PosArea(pos, w, h);
};

Wizard.prototype.draw = function() {
    var img = this.wizardImage;
    Camera.drawImage(img , this.state.position.x, this.state.position.y, this.state.width, this.state.height);
    if(DEBUG) {
        // draw the bounding box
        
        //top
        Camera.drawLine("purple", this.getLeftBounds(), this.getTopBounds(), this.getRightBounds(), this.getTopBounds());
        //right
        Camera.drawLine("purple", this.getRightBounds(), this.getTopBounds(), this.getRightBounds(), this.getBottomBounds());
        //top
        Camera.drawLine("purple", this.getRightBounds(), this.getBottomBounds(), this.getLeftBounds(), this.getBottomBounds());
        //left
        Camera.drawLine("purple", this.getLeftBounds(), this.getBottomBounds(), this.getLeftBounds(), this.getTopBounds());
    }
};