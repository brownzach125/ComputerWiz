/*jshint node: true*/ 

var fork = require('child_process').fork;
var vm = require('vm');
var Spell = require('models/spell.model');
var User  = require('models/user.model');

function initProcess(controller) {
    var spellProcess = fork('./game-serverside/SpellProcess/SpellProcess.js');
    spellProcess.on('disconnect' , function() {
        controller.handleDisconnect();
    });
    spellProcess.on('message' , function(data) {
        var type = data.type;
        if ( type == 'request') {
            //console.log("Message recieved!!!");
            controller.handleRequest(data);
        }
        if ( type =='err') {
            controller.handleError(data);
        }
        if ( type =='done') {
            controller.handleDone(data);
        }
    });
    spellProcess.running = false;
    return spellProcess;
}

// TODO use jLINT instead of vm its not really that great
function badSpell(code) {
    var re = new RegExp('\n' , 'g');
    code = code.replace(re , '');
    var source = [code];
    JSHINT(source , {}  , {});
    var errors = JSHINT.data().errors;
    if ( !errors)
        return;
    return { problem : errors[0].raw + "\n" + errors[0].evidence , errorInfo : errors };
}


function SpellController(wizard) {
    this.wizard = wizard;
    this.process = initProcess(this);
    this.spellSafe = {};
    this.username = wizard.username;

    this.loadSpells();
}

SpellController.prototype.loadSpells = function() {
    var that = this;
    Spell.getByUsername(this.username)
        .then(function(spells) {
            for (var i =0; i < spells.length; i++) {
                that.spellSafe[spells[i].slot] = {code:spells[i].code, name:spells[i].name, slot:spells[i].slot};
                that.createSpell(that.spellSafe[spells[i].slot]);
            }
        })
        .catch(function(err) {

        });
};

SpellController.prototype.log = function(message) {
    //console.log(message);
};

SpellController.prototype.reset = function() {
    try {
        this.process.kill();
    }
    catch(err){}

    this.process = initProcess(this);
    for ( var key in this.spellSafe) {
        var spell = this.spellSafe[key];
        if ( spell ) {
            this.createSpell(spell);
        }
    }
};
var JSHINT = require('jshint').JSHINT;
SpellController.prototype.createSpell = function(spell) {
    var problem = badSpell(spell.code);
    if ( problem ) {
        // TODO I can do this on the spell process, but I can also do it now more directly....
        //console.log("Hey there is problem");
        return problem;
    }
    var code = spell.code;
    var slot = spell.slot;
    this.spellSafe[slot] = spell;
    this.process.send({type: 'createSpell' , code : code , slot: slot});
    //console.log("Spell made in slot " + slot);
};

SpellController.prototype.castSpell = function(slot) {
    if (! slot in this.spellSafe) {
        this.log("Slot " + slot + " Does not exist. Slot key not in spell safe");
        return;
    }
    if ( !this.spellSafe[slot]  ) {
        this.log("Slot " + slot + " Does not exist. Spell is null in spell safe");
        return;
    }
    if ( !this.process) {
        this.log("Process is null");
        return;
    }

    function startSpell(that) {
        that.process.send({type: 'startSpell' , slot : slot});
        that.process.running = true;
        that.wizard.socket.emit('startSpell' , { slot :slot});
        that.process.currentSpellSlot = slot;
    }
    function endSpell(that , callback) {
        that.process.send({type:'end'});
        // Wait for spell to end
        setTimeout(function() {
           if ( !that.process.running ) {
               // Oh good it ended
               that.log("Spell ended when asked");
               callback();
           }
           else {
               // Damn we need to kill it first
               that.log("Killing old process");
               that.process.kill();
               that.wizard.socket.emit('endSpell' , { slot : that.process.currentSpellSlot , kill: true});
               that.reset();
               callback();
           }
        } , 100);

    }
    var that = this;
    function tryToStartSpell() {
        if ( !that.process.running ) {
            that.log("Spell Process inactive starting spell");
            startSpell(that);
        }
        else {
            that.log("Spell process was already active, asking to cancel");
            endSpell(that , function() {
                if ( slot != that.process.currentSpellSlot) {
                    startSpell(that);
                }
            });
        }
    }
    tryToStartSpell();
};


// Receive a message from the spell process to cast a spell from the spell book,
SpellController.prototype.handleRequest = function(data) {
    var func = data.funcName;
    var args = data.params;
    if ( this.wizard.spellBook[func] ) {
        // TODO tell user about this result
        var arguments = [ this.wizard.game, this.wizard.name].concat(args);
        var result = this.wizard.spellBook[func].apply(this.wizard.spellBook, arguments);
        this.process.send({type: 'data', value: result});
    }
    else {
        //console.log("Function " + func + " doenst exits");
    }
};

SpellController.prototype.handleError = function(data) {
    // TODO for gods sake do something
    this.process.running = false;
};

SpellController.prototype.handleDone = function(data) {
    this.log("Spell Process reported being done");
    this.process.running = false;
    this.wizard.socket.emit('endSpell' , { slot : this.process.currentSpellSlot});
};

SpellController.prototype.handleDisconnect = function() {
    this.process.running = false;
    this.log("Spell Process disconnected");
};

// Shut down the process
SpellController.prototype.shutDown  = function() {
    if ( this.process) {
        this.process.kill();
    }
};

module.exports = SpellController;
