/*jshint node: true, devel: true*/ 
var vm = require('vm');

function Spell(process) {
    this.process = process;
}

Spell.prototype.init = function(code , sandbox ) {
    try {
        this.script = new vm.Script(code, {filename:"UserSpell"});
        this.context = vm.createContext(sandbox);
        this.code    = code;
        return true;
    }
    catch(err) {
        console.log(err);
        return false;
    }
};

Spell.cast = function(spell) {
    try {
        spell.script.runInContext(spell.context);
        spell.process.send({type: 'done'});
    }
    catch(err) {
        // TODO maybe clean this up some
        var fullErrorMessage = err.stack;
        var errorMessage = fullErrorMessage.substring(0, fullErrorMessage.lastIndexOf("\n"));
        errorMessage = errorMessage.substring(0, errorMessage.lastIndexOf("\n"));
        spell.process.send({type:'error',  err: errorMessage});
    }
};

module.exports = Spell;