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

        // public functions
        vm.saveSpell = saveSpell;
        vm.createNewSpell = createNewSpell;
        vm.selectSpell = selectSpell;
        vm.quitGame = quitGame;

        function initEditor() {
            var langTools = ace.require("ace/ext/language_tools");
            var editor = ace.edit("editor_space");
            editor.setOptions({
                //enableSnippets: true,
                //enableBasicAutocompletion: true,
                //enableLiveAutocompletion: true,
                theme: "ace/theme/monokai"
            });
            editor.$blockScrolling = Infinity;
            vm.editor = editor;
            setupTernEditor(editor);

            initController();
        }
        initEditor();

        $scope.$on('$destroy' , function() {
            // Nothing needed?
        });

        function initController() {
            // get current user
            UserService.GetCurrent().then(function (user) {
                vm.user = user;
                SpellService.GetUserSpells(vm.user._id).then(function(spells) {
                    vm.spells = spells;
                    //vm.editor.setValue(vm.spells[0].code);
                    vm.spells.forEach(function(spell, index) {
                        spell.saved = true;
                        var editSession = makeEditSession(spell.code, index)
                    });
                    if ( vm.spells.length == 0) {
                        createNewSpell();
                    }
                    selectSpell(0);
                });
            });
        }

        function makeEditSession(code, index) {
            var editSession = new ace.EditSession( code, "ace/mode/javascript");
            editSession.slotIndex = index;
            editSession.on('change', function() {
                invalidateActiveSpell(editSession.slotIndex);
            });
            vm.editSessions.push(  editSession );
            return editSession;
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
            var editSession = makeEditSession("castFireBall(0,5,5);", slot-1);
            vm.spells.push({slot:slot, code:editSession.getValue(), name:"Spell in slot " + slot, saved:false});
            selectSpell(slot-1);
        }

        vm.codeGlobals = {};
        for (var key in SpellBook) {
            vm.codeGlobals[key] = false;
        }
        vm.lintOptions = [
            {
                globals: vm.codeGlobals,
                undef: true
            }
        ];
        function changeWorkerOptions(editor) {
            if (editor.session.$worker) {
                editor.session.$worker.call("changeOptions", [{
                    globals: vm.codeGlobals,
                    undef: true, // enable warnings on undefined variables
                    // other jshint options go here check jshint site for more info
                }]);
            }
            else {
                setTimeout(changeWorkerOptions, 100, editor)
            }
        }

        function selectSpell(slotIndex) {
            if (vm.activeSpell) {
                //Save current spell
                vm.activeSpell.code = vm.editor.getValue();
            }
            vm.editor.setSession(vm.editSessions[slotIndex]);
            vm.activeSpell = vm.spells[slotIndex];
            changeWorkerOptions(vm.editor);
        }
        function quitGame() {
            console.log("FUCK this");
        }
        function setupTernEditor(editor) {
            ace.config.loadModule('ace/ext/tern', function () {
                editor.setOptions({
                    /**
                     * Either `true` or `false` or to enable with custom options pass object that
                     * has options for tern server: http://ternjs.net/doc/manual.html#server_api
                     * If `true`, then default options will be used
                     */


                    enableTern: {
                        /* http://ternjs.net/doc/manual.html#option_defs */
                        defs: ['ecma5', computerwizdef],
                        /* http://ternjs.net/doc/manual.html#plugins */
                        plugins: {
                            doc_comment: {
                                fullDocs: true
                            }
                        },
                        /**
                         * (default is true) If web worker is used for tern server.
                         * This is recommended as it offers better performance, but prevents this from working in a local html file due to browser security restrictions
                         */
                        useWorker: true,
                        /* if your editor supports switching between different files (such as tabbed interface) then tern can do this when jump to defnition of function in another file is called, but you must tell tern what to execute in order to jump to the specified file */
                        switchToDoc: function (name, start) {
                            console.log('switchToDoc called but not defined. name=' + name + '; start=', start);
                        },
                        /**
                         * if passed, this function will be called once ternServer is started.
                         * This is needed when useWorker=false because the tern source files are loaded asynchronously before the server is started.
                         */
                        startedCb: function () {
                            //once tern is enabled, it can be accessed via editor.ternServer
                            console.log('editor.ternServer:', editor.ternServer);
                        },
                    },
                    /**
                     * when using tern, it takes over Ace's built in snippets support.
                     * this setting affects all modes when using tern, not just javascript.
                     */
                    enableSnippets: true,
                    /**
                     * when using tern, Ace's basic text auto completion is enabled still by deafult.
                     * This settings affects all modes when using tern, not just javascript.
                     * For javascript mode the basic auto completion will be added to completion results if tern fails to find completions or if you double tab the hotkey for get completion (default is ctrl+space, so hit ctrl+space twice rapidly to include basic text completions in the result)
                     */
                    enableBasicAutocompletion: true,
                });
            });
        }
    }
})();
