var vm = require('vm');

var Spell = require('./Spell.js');
var FiberController = require('./FiberController.js');
var p = process;
location = {};

var spells = {};
var needToEnd = false;

process.on('message' , function(data) {
    var type = data.type;
    // Message is telling me to start the spell execution
    if ( type == 'startSpell') {
        console.log("Recieved startSpell");
        startSpell(data);
    }
    if ( type == 'createSpell') {
        console.log("Recieved createSpell");
        createSpell(data);
    }
    // Message is the response to some request
    if ( type == 'data') {
        console.log("Recieved response to request");
        processRequestResponse(data);
    }
    if ( type =='die') {
        // Its time for this to end
        console.log("Recieved die");
        process.exit();
    }
    if (type == 'end') {
        // Set flag so spell will end next time a baisc funciton is called
        console.log("Recieved end");
        needToEnd = true;
    }
});

function processRequestResponse(data) {
    location = data.value;
    FiberController.resume();
}

function startSpell(data) {
    needToEnd = false;
    var slot = data.slot;
    FiberController.startFiber( Spell.cast , spells[slot]);
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

function checkForEnd() {
    if ( needToEnd) {
        process.send({type:'done'});
        FiberController.terminate();
        return;
    }
}

function sendRequest(funcName , params) {
    checkForEnd();
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
        var timeRemaining = time;

        while ( timeRemaining > 0) {
            checkForEnd();
            timeRemaining-= 10;
            setTimeout( function() {
                FiberController.resume();
            } , 10);
            FiberController.pause();
        }
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