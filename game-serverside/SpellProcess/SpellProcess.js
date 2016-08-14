var vm = require('vm');
var Spell = require('./Spell.js');
// Fiber controller manages a single fiber that is initialized with this function
var FiberController = new (require('./FiberController.js'))(Spell.cast);
var SpellBook = require('../shared/SpellBook.js');

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

// Let my parent know I'm ready for messages
process.send({type:'alive'});

function processRequestResponse(data) {
    location = data.value;
    FiberController.resume();
}

function log(message) {
    //console.log("Spell Process: UID: + " + wizardUID + "\n --- " + message);
}

function startSpell(data) {
    var slot = data.slot;
    FiberController.startFiber(spells[slot]);
}

function createSpell(data){
    var code = data.code;
    var slot = data.slot;
    var sandbox = new spellBookSandbox();
    var spell = new Spell(process);
    var success = spell.init(code , sandbox);
    if (success)
        spells[slot] = spell;
    else {
        process.send({type: 'err' , err : err , when: 'createSpell'});
    }
}

function sendRequest(funcName , params) {
    var arrayParams = [];
    for ( var key in params) {
        arrayParams.push( params[key]);
    }
    //console.log("sendRequest: " + funcName);
    process.send({
        type: 'request',
        funcName: funcName,
        params:  arrayParams
    });
    FiberController.pause();
}

function spellBookSandbox() {
    this.sleep = function(time) {
        setTimeout( function() {
            FiberController.resume();
        } , time);
        FiberController.pause();
    };

    // Add functions from spell book
    for  (var index in SpellBook ) {
        if ( SpellBook[index].code != null) {
            var funcName = index;
            this[funcName] = function () {
                sendRequest(funcName, arguments);
                return location;
            }
        } else {
            //console.log(index + " was speical spell");
            // This must be a special spell that can only be implemented at this level
            if ( !this[index] ) {
                //console.log("Hey dummy there is a special spell that hasnt been implemented");
            }
        }
    }
}