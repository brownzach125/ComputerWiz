var HUD = {};
currentSpell = null;
HUD.init = function() {

};

HUD.draw = function() {
    HUD.drawNames();
    HUD.drawHealthBars();
    HUD.drawManaBars();
    HUD.drawSpellSlots();
};

HUD.drawHealthBars = function() {

    // Red Player
    var redWizard = Game.redWizard;
    Camera.context.fillStyle= "red";
    Camera.context.fillRect( 10  * Camera.scale , 15  * Camera.scale , (redWizard.state.health*Camera.scale) , (10*Camera.scale) );

    // Blue Player
    var blueWizard = Game.blueWizard;
    Camera.context.fillStyle= "red";
    Camera.context.fillRect( (470 - blueWizard.state.health) * Camera.scale , 15  * Camera.scale, (blueWizard.state.health*Camera.scale) , (10*Camera.scale) );
};

HUD.drawManaBars = function() {
    // Red Player
    var redWizard = Game.redWizard;
    Camera.context.fillStyle= "blue";
    Camera.context.fillRect( 10  * Camera.scale, 25  * Camera.scale, (redWizard.state.mana*Camera.scale) , (10*Camera.scale) );

    // Blue Player
    var blueWizard = Game.blueWizard;
    Camera.context.fillRect( (470 - blueWizard.state.mana) * Camera.scale , 25  * Camera.scale , (blueWizard.state.mana*Camera.scale) , (10*Camera.scale) );
};

HUD.drawNames = function() {
    // Red Player
    Camera.context.font=(10*Camera.scale) + "px Georgia";
    Camera.context.fillStyle= "white";
    Camera.context.fillText("Red Player" , (10*Camera.scale), (10*Camera.scale) );


    // Blue Player
    Camera.context.font=(10*Camera.scale) + "px Georgia";
    Camera.context.fillStyle= "white";
    Camera.context.fillText("Blue Player" , (370*Camera.scale), (10*Camera.scale) );

};

HUD.drawSpellSlots = function() {
    var size = 24;
    var width  = size * Camera.scale;
    var height = size * Camera.scale;
    var fontHeight = (size-3) * Camera.scale;
    var startPointX = 235 * Camera.scale - width * 6 / 2;
    
    for ( var i = 0; i < 6; i++) {
        var xcoord = (startPointX + i * width);
        var ycoord = (CAMERA_NATIVE_HEIGHT - size + 1) * Camera.scale;
        
        Camera.context.fillStyle ='#7e7e7e';
        if ( currentSpell && currentSpell == (i + 1) ) {
            Camera.context.fillStyle = 'green';
        }
        Camera.context.fillRect(xcoord , ycoord , width , height);
        
        Camera.context.strokeStyle = '#4a4a4a';
        Camera.context.rect(xcoord , ycoord , width , height);
        Camera.context.stroke();
        
        Camera.context.fillStyle = '#262626';
        Camera.context.font = fontHeight + "px Sans-Serif";
        Camera.context.fillText(i + 1 , xcoord + width * 0.25 , ycoord + height * 0.8);
    }
};



HUD.drawMenu = function() {
    Camera.drawImage(HUD.menu, 0, 0, 480, 270);
    HUD.drawScore();
};

HUD.drawPause = function() {
    Camera.drawImage(HUD.pause, 0, 0, 480, 270);
};

HUD.drawGameOver = function() {
    Camera.drawImage(HUD.over, 0, 0, 480, 270);
    HUD.drawScore();
};