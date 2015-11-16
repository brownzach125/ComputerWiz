var selectors;
var selected;
function setUpSelectors() {
    selectors = document.getElementsByClassName('functionSelectors');
    for (var i =0; i < selectors.length; i++) {
        selectors[i].innerHTML = 'Spell ' + (i +1);
        selectors[i].slotNum = (i+1);
        selectors[i].onclick = function() {
            selectSpell(this.slotNum);
            var old = document.getElementsByClassName('functionSelectors Selected');
                var index = selected.className.indexOf(' Selected');
                selected.className = selected.className.substr(0 , index) + selected.className.substr(index + 9);
            this.className +=" Selected";
            selected = this;
        };
        selectors[i].makeGood = function(good) {
            if ( good ) {
                // Remove bad if there
                var index = this.className.indexOf(' BadSelector');
                if ( index >= 0)
                    this.className = this.className.substr( 0 , index) + this.className.substr(index + 12);
            }
            else {
                // Add bad if not already there
                var index = this.className.indexOf(' BadSelector');
                if ( index < 0) {
                    this.className += " BadSelector";
                }
            }
        };
    }
    selected = selectors[0];
}

var spells = {

};

function selectSpell(slot) {
    // Save the spell from the current selection
    var selected = document.getElementsByClassName('functionSelectors Selected')[0];
    var code = document.getElementById('function_input').value;
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
            info : 'No Problem',
        };
    document.getElementById('function_input').value = newSpell.code;
    document.getElementById('spell_info').innerHTML = newSpell.info;
}

function submitSpell() {
    var func = document.getElementById('function_input').value;
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