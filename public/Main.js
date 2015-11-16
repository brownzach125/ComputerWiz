var EMBED = false;
var Ready = false;
var DEBUG = false;
var LOOP_DELAY = 16;

function loadGame() {
    attemptToStartGame();
}

function attemptToStartGame() {
    if (!ResourceManager.isGameLoaded()) {
        setTimeout(attemptToStartGame , 10);
    }
    else {
        setupGame();
    }
}

function setupGame() {
    Camera.init();
    Socket.init();
    Game.init();
    window.onresize = resizeHandler;
    window.onkeydown = KeyHandler.onKeyDown;
    window.onkeyup = KeyHandler.onKeyUp;
    Ready = true;
    setInterval(gameLoop, LOOP_DELAY);
}

function gameLoop() {
    redraw();
}

function resizeHandler(event) {
    Camera.bestFitCamera();
}

function redraw() {
    if ( !Ready)
        return;
    Game.draw();
}

var Socket = io.connect(document.URL);
Socket.init = function() {
    this.on('connect', function(data) {

    });
    this.on('stateUpdate' , function(state) {
        Game.stateUpdate(state);
    });
    this.on('goToSpellCreationMode' , function(data) {
        goToSpellCreationMode(data);
    });
    this.on('goToFightMode' , function(data) {
        goToFightMode(data);
    });
    this.on('spellCreation' , function(data) {
        spellCreated(data);
    });
};

function goToSpellCreationMode(data) {
    console.log("Going to spellcreation screen");
    document.getElementById('gameScreen').style.display = "none";
    document.getElementById('gameCanvas').style.display = "none"
    document.getElementById('spellCreationScreen').style.display = 'block';

}

function goToFightMode(data) {
    console.log("Going to fight mode");
    document.getElementById('gameScreen').style.display = "block";
    document.getElementById('gameCanvas').style.display = "block";
    document.getElementById('spellCreationScreen').style.display = 'none';
}

// Tell the server we are ready to fight
// Let the user know they are waiting
function readyToFight() {
    console.log("Told server that im ready to fight");
    Socket.emit('goToFightMode' , {});
}

function backToSpellCreation() {
    console.log("Told server that i need to go back to spell creation");
    Socket.emit('goToSpellCreationMode' , {});
}