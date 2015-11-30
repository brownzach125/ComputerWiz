var TILE_LENGTH = 24;
var WIZARD_LENGTH = 50;


var leftBound = WIZARD_LENGTH*.2;
var rightBound = WIZARD_LENGTH*.2;
var topBound = WIZARD_LENGTH*.30;
var bottomBound = WIZARD_LENGTH*.25;


function Wizard(color) {
    this.state = {
        position: {
            x: 60,
            y: 0
        },
        health: 100,
        mana: 100,
        height: 50,
        width: 50,
    };
    if ( color == 'red') {
        this.wizardImage   = ResourceManager.loadImage('./art/RedWizard.png');
    }
    else {
        this.wizardImage   = ResourceManager.loadImage('./art/BlueWizard.png');
    }
}

Wizard.prototype.init = function() {

};

Wizard.prototype.getHitBox = function() {
    var pos = {};
    var hitBoxWidth  = WIZARD_LENGTH * .2;
    var hitBoxHeight = WIZARD_LENGTH * .5;
    pos.x = this.state.position.x - .5 * hitBoxWidth - 4;
    pos.y = this.position.y - .5 * hitBoxHeight -4;

    var w = hitBoxWidth;
    var h = hitBoxHeight;
    return new PosArea(pos, w, h);
};

Wizard.prototype.draw = function() {
    var img = this.wizardImage;
    Camera.drawImage(img , this.state.position.x -  this.state.width , this.state.position.y - this.state.height , this.state.width * 2 , this.state.height * 2);
    if(DEBUG) {
        var dx = this.state.position.x +  9 - Math.sin(this.vector ) * this.velocity * 8;
        var dy = this.state.position.y + 16 - Math.cos(this.vector ) * this.velocity * 8;

        Camera.drawLine("blue", this.state.position.x + 9, this.state.position.y + 16, dx, dy);

        var vx = this.state.position.x +  9 + Math.sin(this.vector ) * 6;
        var vy = this.state.position.y + 16 + Math.cos(this.vector ) * 6;
        Camera.drawLine("green", this.state.position.x + 9, this.state.position.y + 16, vx, vy);
        var fx = this.state.position.x +  9 + 3;
        if(this.facing == "left")
            fx = this.state.position.x +  9 - 3;
        var fy = this.state.position.y + 16 ;
        Camera.drawLine("yellow", this.state.position.x + 9, this.state.position.y + 16, fx, fy);
        //DrawBoundingBox(this , "purple");
        Camera.drawLine("purple", this.getLeftBounds(), this.getTopBounds(), this.getRightBounds(), this.getTopBounds());
        Camera.drawLine("purple", this.getRightBounds(), this.getTopBounds(), this.getRightBounds(), this.getBottomBounds());
        Camera.drawLine("purple", this.getRightBounds(), this.getBottomBounds(), this.getLeftBounds(), this.getBottomBounds());
        Camera.drawLine("purple", this.getLeftBounds(), this.getBottomBounds(), this.getLeftBounds(), this.getTopBounds());
        //var box = this.getHitBox();
        //DrawBoundingBox(box , "blue");
    }
};

Wizard.prototype.getTopBounds = function() {
    return this.state.position.y + topBound;
};

Wizard.prototype.getBottomBounds = function() {
    return this.state.position.y - bottomBound;
};

Wizard.prototype.getLeftBounds = function() {
    return this.state.position.x - leftBound;
};

Wizard.prototype.getRightBounds = function() {
    return this.state.position.x + rightBound;
};

Wizard.prototype.getTopBoundsFromPos = function(pos) {
    return pos.y + topBound;
};

Wizard.prototype.getBottomBoundsFromPos = function(pos) {
    return pos.y - bottomBound;
};

Wizard.prototype.getLeftBoundsFromPos = function(pos) {
    return pos.x - leftBound;
};

Wizard.prototype.getRightBoundsFromPos = function(pos) {
    return pos.x + rightBound;
};