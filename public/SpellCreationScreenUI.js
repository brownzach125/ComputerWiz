var selectors;
var selected;
function setUpSelectors() {
    selectors = document.getElementsByClassName('functionSelectors');
    for (var i =0; i < selectors.length; i++) {
        selectors[i].innerHTML = 'Spell ' + (i +1);
        selectors[i].slotNum = (i+1);
        selectors[i].onclick = function() {
            selectSpell(this.slotNum);
            var old = selected;
            var index = selected.className.indexOf(' Selected');
            selected.className = selected.className.replace(' Selected' , '');
            this.className +=" Selected";
            selected = this;
        };
        selectors[i].makeGood = function(good) {
            if ( good ) {
                // Remove bad if there
                var index = this.className.indexOf(' BadSelector');
                if ( index >= 0)
                    this.className = this.className.replace(' BadSelector' , '');
                this.className += " GoodSelector";
                this.good = true;
            }
            else {
                // Add bad if not already there
                var index = this.className.indexOf(' BadSelector');
                if ( index < 0) {
                    this.className += " BadSelector";
                }
                this.good = false;
            }
        };

        selectors[i].invalidate = function() {
            var index = this.className.indexOf('Selected');
            if ( index >= 0 ) {
                this.className = 'functionSelectors Selected';
            }
            else {
                this.className = 'functionSelectors';
            }
            this.good = false;
        };

    }
    selected = selectors[0];
}

function setUpSpellList() {
    //var spellListArea = document.getElementById('SpellList');
    var spells = document.getElementById('SpellList').childNodes;
    for ( var s = 0; s < spells.length; s++ ) {
        var spell = spells[s];
        spell.onclick = function() {
            if ( !this.expanded) {
                this.className += 'expanded';
                this.expanded = true;
            }else {
                var index = this.className.indexOf('expanded');
                this.className = this.className.substr(0 , index);
                this.expanded = false;
            }
        }
    }
}

var spells = {

};

function selectSpell(slot) {
    // Save the spell from the current selection
    var code = editor.getValue();
    var info = document.getElementById('spell_info').innerHTML;
    var spell = {
        code : code,
        info : info,
    };

    spells[selected.slotNum] = spell;
    //Set the textarea to the value in the new slected spell
    var newSpell = spells[slot];
    if ( !newSpell)
        newSpell = {
            code : '',
            info : '\"UnTested\"',
        };
    editor.ignoreChange = true;
    if ( newSpell.code ) {
        editor.setValue(newSpell.code);
    }
    else {
        editor.setValue("");
    }
    editor.ignoreChange = false;
    document.getElementById('spell_info').innerHTML = newSpell.info;
}

function submitSpell() {
    var func = editor.getValue();
    var slot = document.getElementsByClassName('functionSelectors Selected')[0].slotNum;
    var data = { slot: slot , code: func};
    spells[slot] = {
        code: func ,
        info: 'No Problems',
    };
    Socket.emit('createSpell' , data);
}

function spellCreated(data) {
    console.log("Server reported back on the spell I made");
    var slot = data.slot;
    var spell = spells[slot];
    spell.code = data.code;
    if ( data.problem ) {
        console.log("it was a bad spell...");
        spell.info = data.problem;
        selectors[slot-1].makeGood(false);
    }
    else {
        console.log("it was good spell...");
        spell.info = 'No Problems';
        selectors[slot-1].makeGood(true);
    }

    if ( selected.slotNum == slot) {
        // Update info
        document.getElementById('spell_info').innerHTML = JSON.stringify(spell.info);
    }
}

function inValidateAllSpells() {
    for ( var i = 0; i < selectors.length; i++ ) {
        selectors[i].invalidate();
    }
    console.log("Invalidating spells");
}
function inValidateSelectedSpell() {
    selected.invalidate();
}

// TODO
function showWaitingForOpponent() {

}

function checkSpells() {
    for ( var i =0; i < selectors.length; i++ ) {
        if ( spells[selectors.slotNum] && spells[selectors.slotNum].code ) {
            if ( !selectors[i].good ) {
                return false;
            }
        }
    }
    return true;
}

function recieveSpellList(spellList) {
    for ( var i in spellList) {
        spells[spellList[i].slot] = spellList[i];
        selectors[spellList[i].slot-1].makeGood(true);
    }

    var slot = selected.slotNum;
    if ( spells[slot] ) {
        editor.ignoreChange = true;
        if ( spells[slot].code ) {
            editor.setValue(spells[slot].code);
        }
        else {
            editor.setValue("");
        }
        editor.ignoreChange = false;
    }
}