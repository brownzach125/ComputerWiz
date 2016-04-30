var Game = {};

Game.init = function() {
    Game.redWizard = new Wizard('red');
    Game.blueWizard = new Wizard('blue');
    Game.fireBallList = new FireBallList();
    Arena.init();
    HUD.init();
};

Game.draw = function() {
    //Arena.draw();
    //Game.redWizard.draw();
    //Game.blueWizard.draw();
    //Game.fireBallList.draw();
    HUD.draw();
};

/*
    The game gameserver.js passes state
    {
        redWizard : stateofRedWizard,
        blueWizard: stateofRedWizard
        ...
    }
 */
Game.stateUpdate = function(state) {
    for ( var field in state) {
        if ( field in this ) {
            Game[field].state = state[field];
        }
    }
};