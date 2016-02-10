/*jshint node: true, devel: true*/ 

var vm = require('vm');

function Spell(process) {
    this.process = process;
}

Spell.prototype.init = function(code , sandbox ) {
    try {
        this.script = new vm.Script(code);
        this.context = vm.createContext(sandbox);
        this.code    = code;
    }
    catch(err) {
        console.log("SUP");
        console.log(err);
        return false;
    }
};

Spell.cast = function(param) {
    spell = param[0];
    callback = param[1];
    try {
        spell.script.runInContext( spell.context );        
        spell.process.send({type :'done'});
    }
    catch(err) {
        console.log("Spell Failure");
        console.log(err);
        spell.process.send({type:'error',  err: err.message});
    }
    callback();
};

module.exports = Spell;