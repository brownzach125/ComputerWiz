var vm = require('vm');
var FireBall = require('./../FireBall.js');
var Helper = require('./../Helper.js');
var SpellController = require('./SpellController.js');
var WizardGameObject = require('./WizardWorldObject');
var SpellBook = require('./SpellBook');

function Wizard(x , y , game) {
    this.game = game;
    // Objec that represents the wizard in the game world
    this.worldObject      = new WizardGameObject(x , y , this);
    // Object that handles the calls to basic spells
    this.spellBook = new SpellBook(this);
    // Object that controlls the process that the wizards spells run in
    this.spellController = new SpellController(this);
    // this.client - set elsewhere
}

Wizard.prototype.getUID = function() {
    return this.client.uid;
};

Wizard.prototype.sendClientSpellList = function() {
  var spells = this.spellController.spellSafe;
  this.client.emit('spellList' , spells);
  console.log("Client send spell list");
};

Wizard.prototype.stopSpells = function() {
    this.spellController.reset();
};

Wizard.prototype.restart = function(pos) {
    this.worldObject.restart(pos);
    this.spellController.reset();
};

Wizard.prototype.createSpell = function ( spell ) {
    console.log("Creating spell " + spell.slot);
    var slot = spell.slot;
    var code = spell.code;
    var spellInfo = this.spellController.createSpell(spell);
    if ( spellInfo ) {
        spell.problem = spellInfo.problem;
    }
    this.client.emit('spellCreation' , spell);
};

Wizard.prototype.castSpell = function(slot) {
    this.spellController.castSpell(slot);
};


// This used when the game has been told to shutdown, so now the wizard must shut down
Wizard.prototype.shutDown = function() {
    this.spellController.shutDown();
};

module.exports = Wizard;
