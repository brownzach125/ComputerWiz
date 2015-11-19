var fork = require('child_process').fork;
var vm = require('vm');
function initProcess(controller) {
    var spellProcess = fork('./ComputerWiz/SpellProcess.js');
    spellProcess.on('disconnect' , function() {
        controller.handleDisconnect();
    });
    spellProcess.on('message' , function(data) {
        var type = data.type;
        if ( type == 'request') {
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
}

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
        return problem;
    }
    var code = spell.code;
    var slot = spell.slot;
    this.spellSafe[slot] = spell;
    this.process.send({type: 'createSpell' , code : code , slot: slot});
};

SpellController.prototype.castSpell = function(slot) {
    if ( slot in this.spellSafe && this.spellSafe[slot]) {
        if ( this.process && this.process.running ) {
            this.process.send({type:'end'});
            var that = this;
            setTimeout(function() {
                if ( that.process.running ) {
                    that.process.kill();
                    // TODO I need to send the client something to let them know about this
                    that.reset();
                    if ( that.process.currentSpellSlot != slot) {
                        that.process.send({type: 'startSpell' , slot : slot});
                        that.process.running = true;
                    }
                } else {
                    if ( that.process.currentSpellSlot != slot) {
                        that.process.send({type: 'startSpell' , slot : slot});
                        that.process.running = true;
                    }
                }
            } , 100);
        }
        else {
            this.process.send({type: 'startSpell' , slot : slot});
            this.process.running = true;
        }
    }
    this.process.currentSpellSlot = slot;
};

SpellController.prototype.handleRequest = function(data) {
    var func = data.funcName;
    var args = data.params;
    if ( this.wizard[func] ) {
        // TODO tell user about this
        var result = this.wizard[func](args);
        this.process.send({type: 'data', value: result});
    }
};

SpellController.prototype.handleError = function(data) {
    // TODO for gods sake do soemthing
    this.process.running = false;
};

SpellController.prototype.handleDone = function(data) {
    this.process.running = false;
};

SpellController.prototype.handleDisconnect = function() {
    this.process.running = false
};

module.exports = SpellController;