var EMBED = false;
var Ready = false;
var DEBUG = false;
var LOOP_DELAY = 16;
var intervalVar;
var gameState = '';
var identity = document.cookie;

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
    //intervalVar = setInterval(gameLoop, LOOP_DELAY);
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
    this.emit('identity' , {value: identity});
    this.on('connect' , function() {
        this.emit('identity' , {value: identity});
    });
    this.on('identity', function(data) {
       document.cookie = data.value;
        var i = 0;
    });
    var count = 0;
    this.on('stateUpdate' , function(state) {
        Game.stateUpdate(state);
    });
    this.on('goToSpellCreationMode' , function(data) {
        console.log("Ive been told to make spells");
        goToSpellCreationMode(data);
    });
    this.on('goToFightMode' , function(data) {
        console.log("Ive been told to fight");
        goToFightMode(data);
        intervalVar = setInterval(gameLoop, LOOP_DELAY);
    });
    this.on('spellCreation' , function(data) {
        clearInterval(intervalVar);
        spellCreated(data);
    });
    this.on('disconnect' , function() {
        clearInterval(intervalVar);
    });
    this.on('gameStart' , function() {
       inValidateAllSpells();
    });

    this.on('waitingOnOpponent' , function() {
       showWaitingForOpponent();
    });

    this.on('spellList' , function(spells) {
       recieveSpellList(spells);
    });

    this.on('startSpell' , function(data) {
        var slot = data.slot;
        currentSpell = slot;

    });
    this.on('endSpell' , function(data) {
        var slot = data.slot;
        currentSpell = null;
    });

};

function goToSpellCreationMode(data) {
    console.log("Going to spellcreation screen");
    document.getElementById('gameScreen').style.display = "none";
    document.getElementById('gameCanvas').style.display = "none";
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
    var spellsReady = checkSpells();
    if ( !spellsReady ) {
        alert("You have unchecked spells");
    }
    else {
        console.log("Told server that im ready to fight");
        Socket.emit('goToFightMode' , {});
    }
}

function backToSpellCreation() {
    console.log("Told server that i need to go back to spell creation");
    Socket.emit('goToSpellCreationMode' , {});
}

function restart() {
    Socket.emit('restart' , {});
}