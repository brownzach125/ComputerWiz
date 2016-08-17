/**
 * Created by solevi on 4/6/16.
 */
DEBUG = false;
LOOP_DELAY = 16;

(function() {
    'use strict';

    angular
        .module('app')
        .controller('Match.IndexController', Controller);

    function Controller(UserService, socket, $scope, $state) {
        var vm = this;
        var vmParent = $scope.$parent.vm;
        vm.wizardName = vmParent.wizardName;
        vm.opponent = vmParent.opponent;
        vm.user = null;

        initController();
        // public functions

        function initController() {
            UserService.GetCurrent().then(function (user) {
                vm.user = user;
                setupSocket();
                initMatch();
            });
        }

        function initMatch() {
            KeyHandler.init(socket);
            Game.init();
            Camera.init(redraw);
            window.onresize = resizeHandler;
            window.onkeydown = KeyHandler.onKeyDown;
            window.onkeyup   = KeyHandler.onKeyUp;
            gameLoop();
            //limitLoop(gameLoop,30);
        }
        
        function gameLoop() {
            requestAnimationFrame(gameLoop);
            Game.draw();
        }
        
        function resizeHandler(event) {
            Camera.bestFitCamera();
        }
        
        function redraw() {
            Game.draw();
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
        socketCallbacks.spell_error = function(state) {
            console.log("My spell was broken");
        };


        $scope.$on("$destroy", function() {
            console.log("Match controller destroyed");
            if (vm.intervalVar) {
                window.cancelAnimationFrame(vm.intervalVar);
            }
            vm.gameUID = window.localStorage.getItem('gameUID');
            socket.emit('quit_match', {username:vm.user.username, gameUID:vm.gameUID});
        });

        //vm.intervalVar = null;
        /*
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
        };*/
    }
})();
