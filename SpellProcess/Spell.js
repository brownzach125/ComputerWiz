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
        console.log(err);
        return false;
    }
};

Spell.cast = function(spell) {
    try {
        spell.script.runInContext( spell.context );        
        spell.process.send({type :'done'});
    }
    catch(err) {
        //console.log("Spell Failure");
        //console.log(err);
        spell.process.send({type:'error',  err: err.message});
    }
};

module.exports = Spell;