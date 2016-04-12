(function() {
    'use strict';

    angular
        .module('app')
        .controller('Spells.IndexController', Controller);

    function Controller(UserService, SpellService, $scope) {
        var vm = this;
        vm.user = null;
        vm.spells = null;
        vm.activeSpell = null;
        vm.editSessions = [];
        vm.aceOptions = {useWrapMode : true,
                         showGutter: true,
                         theme:'monokai',
                         mode: 'javascript',
                         onChange: invalidateActiveSpell,
                         onLoad: onAceLoad};


        // public functions
        vm.saveSpell = saveSpell;
        vm.createNewSpell = createNewSpell;
        vm.selectSpell = selectSpell;
        vm.quitGame = quitGame;

        function onAceLoad(_editor) {
            vm.editor = _editor;
            vm.editor.$blockScrolling = Infinity;
            vm.editor.on("changeSession" , function(e) {
                //vm.editor = e.session.editor;
                e.session.$onChange = e.oldSession.$onChange;
                var i = 0;
            });
            initController();
        }

        function initController() {
            // get current user
            UserService.GetCurrent().then(function (user) {
                vm.user = user;
                SpellService.GetUserSpells(vm.user._id).then(function(spells) {
                    vm.spells = spells;
                    //vm.editor.setValue(vm.spells[0].code);
                    vm.spells.forEach(function(spell, index) {
                        spell.saved = true;
                        var editSession = new ace.EditSession( spell.code, "javascript");
                        editSession.slotIndex = index;
                        editSession.on('change', function() {
                            invalidateActiveSpell(editSession.slotIndex);
                        });
                        vm.editSessions.push(  editSession );
                    });
                    if ( vm.spells.length == 0) {
                        createNewSpell();
                    }
                        selectSpell(0);
                });
            });
        }

        function invalidateActiveSpell(slotIndex) {
                // ugh I hate this hack
                setTimeout(function () {
                    vm.spells[slotIndex].saved = false;
                    $scope.$apply();
                }, 100);
        }
        function saveSpell() {
            var spell = vm.activeSpell;
            spell.code = vm.editor.getValue();
            SpellService.SaveSpell(vm.user._id, spell).then(function(nspell) {
                vm.spells[spell.slot-1] = nspell;
                vm.spells[spell.slot-1].saved = true;
                selectSpell(spell.slot-1);
                spell.saved = true;

            })
            .catch(function(err) {
                // TODO something
            });
        }
        function createNewSpell() {
            var slot = vm.spells.length +1;
            var editSession = new ace.EditSession("", "javascript");
            editSession.slotIndex = slot - 1;
            editSession.on('change', function() {
                invalidateActiveSpell(editSession.slotIndex);
            });
            vm.spells.push({slot:slot, code:editSession.getValue(), name:"Spell in slot " + slot, saved:false});
            vm.editSessions.push(  editSession );
            selectSpell(slot-1);
        }
        function selectSpell(slotIndex) {
            if (vm.activeSpell) {
                //Save current spell
                vm.activeSpell.code = vm.editor.getValue();
            }
            vm.editor.setSession(vm.editSessions[slotIndex]);
            vm.activeSpell = vm.spells[slotIndex];
        }
        function quitGame() {
            console.log("FUCK this");
        }
    }
})();
