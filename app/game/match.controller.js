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

    function Controller(UserService, SpellService, socket, $scope) {
        var vm = this;
        vm.user = null;
        vm.spells = null;

        initController();
        // public functions

        $scope.$on("$destroy", function() {
            console.log("Match controller destroyed");
            if (vm.intervalVar) {
                window.cancelAnimationFrame(vm.intervalVar);
            }
            vm.gameUID = window.localStorage.getItem('gameUID');
            socket.emit('quit_match', {username:vm.user.username, gameUID:vm.gameUID});
        });

        function initMatch() {
            KeyHandler.init(socket);
            Game.init();
            Camera.init(redraw);
            window.onresize = resizeHandler;
            window.onkeydown = KeyHandler.onKeyDown;
            window.onkeyup   = KeyHandler.onKeyUp;
            limitLoop(gameLoop,30);
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
        socketCallbacks.match_finished = function(results) {
            console.log(results);
        };



        vm.intervalVar = null;
        var limitLoop = function (fn, fps) {

            // Use var then = Date.now(); if you
            // don't care about targetting < IE9
            var then = new Date().getTime();

            // custom fps, otherwise fallback to 60
            fps = fps || 60;
            var interval = 1000 / fps;

            return (function loop(time){
                vm.intervalVar = requestAnimationFrame(loop);

                // again, Date.now() if it's available
                var now = new Date().getTime();
                var delta = now - then;

                if (delta > interval) {
                    // Update time
                    // now - (delta % interval) is an improvement over just
                    // using then = now, which can end up lowering overall fps
                    then = now - (delta % interval);

                    // call the fn
                    fn();
                }
            }(0));
        };
    }
})();
