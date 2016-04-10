/**
 * Created by solevi on 4/6/16.
 */
DEBUG = false;
LOOP_DELAY = 16;

(function() {
    'use strict';

    angular
        .module('app')
        .controller('Game.MatchController', Controller);

    function Controller(UserService, SpellService, socket) {
        var vm = this;
        vm.user = null;
        vm.spells = null;

        initController();
        // public functions


        function initMatch() {
            KeyHandler.init(socket);
            Game.init();
            Camera.init(redraw);
            window.onresize = resizeHandler;
            window.onkeydown = KeyHandler.onKeyDown;
            window.onkeyup   = KeyHandler.onKeyUp;
            vm.intervalVar = setInterval(gameLoop, LOOP_DELAY);
        }
        function gameLoop() {
            Game.draw();
        }
        function resizeHandler(event) {
            Camera.bestFitCamera();
        }
        function redraw() {
            Game.draw();
        }

        function initController() {
            UserService.GetCurrent().then(function (user) {
                vm.user = user;
                SpellService.GetUserSpells(vm.user._id).then(function(spells) {
                    vm.spells = spells;
                    setupSocket();
                    initMatch();
                });
            });
        }

        function setupSocket() {
            for ( var key in socketCallbacks) {
                socket.on(key, socketCallbacks[key]);
            }
        }

        var socketCallbacks =  {};
        socketCallbacks.match_state = function(state) {
            Game.stateUpdate(state);
        };
    }
})();
