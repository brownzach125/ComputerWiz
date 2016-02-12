var vm = require('vm');

var Spell = require('./Spell.js');
var FiberController = require('./FiberController.js');

// Fiber controller manages a single fiber that is initialized with this function
FiberController = new FiberController(Spell.cast);

var p = process;
location = {};

var spells = {};
var wizardUID = "";
process.on('message' , function(data) {
    var type = data.type;
    // Message is telling me to start the spell execution
    if ( type == 'uid') {
        wizardUID = data.value;
    }
    if ( type == 'startSpell') {
        log("Received startSpell");
        startSpell(data);
    }
    if ( type == 'createSpell') {
        log("Received createSpell");
        createSpell(data);
    }
    // Message is the response to some request
    if ( type == 'data') {
        processRequestResponse(data);
    }
    if ( type =='die') {
        // Its time for this to end
        log("Received die");
        process.exit();
    }
    if (type == 'end') {
        // Set flag so spell will end next time a basic function is called
        log("Received end");
        FiberController.terminate();
        process.send({type:'done'});
    }
});

function processRequestResponse(data) {
    location = data.value;
    FiberController.resume();
}

function log(message) {
    console.log("Spell Process: UID: + " + wizardUID + "\n --- " + message);
}

function startSpell(data) {
    var slot = data.slot;
    FiberController.startFiber(spells[slot]);
}

function createSpell(data){
    var code = data.code;
    var slot = data.slot;
    var sandbox = {
        MAGIC : magicObj,
        BASIC : basicObj,
    };
    var spell = new Spell(process);
    var result = spell.init(code , sandbox);
    if ( !result ) {
        spells[slot] = spell;
    }
    else {
        process.send({type: 'err' , err : err , when: 'createSpell'});
    }
}

function sendRequest(funcName , params) {
    process.send({
        type: 'request',
        funcName: funcName,
        params:  params
    });
    FiberController.pause();
}

// Object that contains the magic
function BASIC() {
    this.sleep = function(time) {
        setTimeout( function() {
            FiberController.resume();
        } , time);
        FiberController.pause();
    }
}

function MAGIC() {
    this.getPOS = function() {
        sendRequest('getPOS' , arguments);
        return location;
    };
    this.castFireBall = function() {
        sendRequest('castFireBall' , arguments);
        return location;
    };
    this.getFireBallsPOS = function() {
        sendRequest('getFireBallsPOS' , arguments);
        return location;
    };
    this.moveToPOS = function() {
        sendRequest('moveToPOS' , arguments);
        return location;
    };
    this.getOpponentPOS = function() {
        sendRequest('getOpponentPOS' , arguments);
        return location;
    };
}
var basicObj = new BASIC();
var magicObj = new MAGIC();