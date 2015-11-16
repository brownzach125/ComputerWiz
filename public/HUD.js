var HUD = {};

HUD.init = function() {

};

HUD.draw = function() {
    //HUD.drawHealth();
    //HUD.drawScore();
    HUD.drawHealthBars();
};

HUD.drawHealthBars = function() {

    // Draw redWizard Stats left side
    Camera.context.font=(10*Camera.scale) + "px Georgia";
    Camera.context.fillStyle= "white";
    Camera.context.fillText("Red Wizard" , (10*Camera.scale), (10*Camera.scale) );
    Camera.context.fillStyle= "red";
    var redWizard = Game.redWizard;
    Camera.context.fillRect( 10  * Camera.scale , 15  * Camera.scale , (redWizard.state.health*Camera.scale) , (10*Camera.scale) );
    Camera.context.fillStyle= "blue";
    Camera.context.fillRect( 10  * Camera.scale, 25  * Camera.scale, (redWizard.state.mana*Camera.scale) , (10*Camera.scale) );

    // Draw blueWizard Stats
    Camera.context.font=(10*Camera.scale) + "px Georgia";
    Camera.context.fillStyle= "white"
    Camera.context.fillText("Blue Wizard" , (370*Camera.scale), (10*Camera.scale) );
    var blueWizard = Game.blueWizard;
    Camera.context.fillStyle= "red";
    Camera.context.fillRect( (470 - blueWizard.state.health) * Camera.scale , 15  * Camera.scale, (blueWizard.state.health*Camera.scale) , (10*Camera.scale) );
    Camera.context.fillStyle= "blue";
    Camera.context.fillRect( (470 - blueWizard.state.mana) * Camera.scale , 25  * Camera.scale , (blueWizard.state.mana*Camera.scale) , (10*Camera.scale) );
};

HUD.drawHealth = function() {
    var x = 3;
    for(var i = 0; i < player.health; i++) {
        Camera.drawImage(HUD.heart, x + (i * 10), 3, 7, 8);
    }
};

HUD.drawScore = function() {
    //console.log(score);
    Camera.context.font=(10*Camera.scale) + "px Georgia";
    Camera.context.fillStyle= "white";
    Camera.context.fillText("Score: "+score , (400*Camera.scale), (20*Camera.scale));

    var high = score;
    if( localStorage["highScore"] != null)
    {
        if(score > localStorage["highScore"])
            localStorage["highScore"] = score;
        else
            high = localStorage["highScore"];
    }

    Camera.context.font=(10*Camera.scale) + "px Georgia";
    Camera.context.fillStyle= "white";
    Camera.context.fillText("High Score: "+high , (400*Camera.scale), (10*Camera.scale));
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